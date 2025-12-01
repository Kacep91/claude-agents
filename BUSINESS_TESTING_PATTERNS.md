# Business Testing Patterns

**Guide for LLM-powered test writing for enterprise applications.**

**Principle**: Test business behavior, not code. Minimum complexity — maximum confidence in operations.

**Fundamentals**: KISS + YAGNI + DRY + Occam's Razor. When in doubt between two approaches — choose the simpler one.

---

## Table of Contents

1. [Testing Philosophy](#-testing-philosophy)
2. [Test Infrastructure](#-test-infrastructure)
3. [Test Types by Pattern](#-test-types-by-pattern)
4. [React Hook Form Patterns](#-react-hook-form-patterns)
5. [Redux and Sagas Testing](#-redux-and-sagas-testing)
6. [Business Scenarios](#-business-scenarios-and-constants)
7. [Domain-Specific Patterns](#-domain-specific-patterns)
8. [Performance and Optimization](#-performance-and-optimization)
9. [E2E vs Unit vs Integration](#-e2e-vs-unit-vs-integration)
10. [Practical Rules](#-practical-rules)
11. [Anti-patterns](#-anti-patterns)
12. [Readiness Checklist](#-test-readiness-checklist)

---

## Testing Philosophy

**What we test**: Real component behavior and business logic
**What we DON'T test**: Implementation details, CSS, UI library internals

**Priorities**:

1. **Data correctness** — values, formats, calculations, fees
2. **Operation security** — validation, signatures, access rights
3. **Compliance** — industry standards, regulations
4. **UX of critical flows** — create → sign → submit operations

## Test Infrastructure

### Core Utilities

- **renderWithProviders**: Main entry point with Redux, Router, Form library
  - Keys: `initialState`, `formDefaultValues`, `initialEntries`, `formRef`, `onSubmit`, `store`
- **Mock builders**: `mockData.ts` with DeepPartial + mergeDeep, DTO/Options factories
- **API mocks**: `mockApiService`, `mockDictionaryApi`, `mockUserApi`
- **Redux utilities**: `mockInitialState`, `mockLoadedState`, store factories
- **Assertions**: Valid date/amount/format helper assertions

### Memory Optimization (REQUIRED for all new tests!)

**Problem**: `jest.requireActual('@ui-library')` loads heavy modules per test file, causing memory overload with parallel workers.

**Solution**: Use lightweight mock from `src/__mocks__/ui-library-lightweight.tsx` — **76x savings**!

**CORRECT — Lightweight mock (for ALL new tests):**

```typescript
// Simple usage
jest.mock('@ui-library', () => require('@src/__mocks__/ui-library-lightweight'));

// With customization
jest.mock('@ui-library', () => ({
  ...require('@src/__mocks__/ui-library-lightweight'),
  useNotifications: () => ({ toast: mockToast, notice: mockNotice }),
}));

// Via helper function (backward compatibility)
jest.mock('@ui-library', () =>
  require('@src/__mocks__/ui-library-lightweight').createMinimalUiMock()
);
```

**WRONG — Heavy mock (DON'T use!):**

```typescript
// FORBIDDEN! Loads heavy modules
jest.mock('@ui-library', () => ({
  ...jest.requireActual('@ui-library'),
  useNotifications: () => ({ toast: mockToast }),
}));
```

**Benefits**:

- **60-75% memory reduction** during coverage testing
- **Faster test startup** (less module loading)
- **More stable CI/CD** (fewer OOM errors)

**On error "component X is not defined"**:
Add missing component to `src/__mocks__/ui-library-lightweight.tsx`:

```typescript
export const NewComponent = ({ children, ...props }: any) => (
  <div data-testid="new-component" {...props}>
    {children}
  </div>
);
```

### Strategic Mocking

**MOCK with surgical precision:**

- **UI library**: `require('@src/__mocks__/ui-library-lightweight')` (lightweight mock)
- **External APIs**: `jest.mock('@api/service')` with mock implementations
- **UI notifications**: `useNotifications` → `{ toast: jest.fn() }`
- **Feature flags/contexts**: Mock for test scenario control
- **Debounce**: Stub lodash.debounce for immediate execution

**DON'T MOCK**: Business logic, Redux state, form validation, mappers
**SELECTIVELY**: Form context only for specific validation scenarios

### Test Data Optimization

**Minimize fixtures** — use only necessary fields:

```typescript
// CORRECT — Minimal data
const mockMinimalAccount = (patch?) => mergeDeep({
  id: 'account-12345',
  currency: { code: 'USD' },
  amount: '1000.00',
}, patch || {});

// WRONG — Excessive data
const mockFullAccount = () => ({
  id: 'account-12345',
  currency: { code: 'USD', name: 'US Dollar', symbol: '$', ... },
  amount: '1000.00',
  branch: { /* 50+ fields */ },
  history: [ /* 100+ records */ ],
  // ... 200 more lines of unnecessary data
});
```

**Edge-case tests** — use realistic volumes:

- **Before**: `Array.from({ length: 150 }, ...)` — excessive for tests
- **After**: `Array.from({ length: 40 }, ...)` — sufficient for logic verification
- **Savings**: 3.75x less data, tests run faster

## Test Types by Pattern

### 1. Components (RTL)

Render via `renderWithProviders`, minimal UI checks.

```typescript
describe('DataForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render form correctly', () => {
    // ARRANGE
    const { container, store } = renderWithProviders(<DataForm />, {
      initialState: { data: mockLoadedState() },
      formDefaultValues: mockFormData(),
    });

    // ACT
    const submitBtn = container.querySelector('[data-tid="btn-next"]');
    fireEvent.click(submitBtn);

    // ASSERT
    expect(store.getState().data.metadata.step).toBe(2);
    expect(mockApiService.updateData).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'test-id' })
    );
  });

  it('should handle validation error', async () => {
    // Test error path with validation
  });
});
```

### 2. Actions/Reducers (pure functions)

Test Redux state transitions directly.

```typescript
describe('dataSlice', () => {
  it('should correctly update editor step', () => {
    // ARRANGE
    const initialState = { ...dataInitialState, metadata: { step: 1 } };

    // ACT
    const action = DataActions.setStep(3);
    const newState = dataSlice.reducer(initialState, action);

    // ASSERT
    expect(newState.metadata.step).toBe(3);
    expect(newState.metadata.maxReachedStep).toBe(3);
  });
});
```

### 3. Sagas (step-by-step generators)

Check effects step by step, emulate errors via `.throw()`.

```typescript
describe('createDataSaga', () => {
  it('should create data successfully', () => {
    // ARRANGE
    const payload = { init: mockInitDto() };
    const gen = createDataSaga({ type: 'createData', payload });

    // ACT & ASSERT
    expect(gen.next().value).toEqual(call(apiService.createData, payload.init));

    const response = mockDataContainer();
    expect(gen.next(response).value).toEqual(put(DataActions.createDataSuccess(response)));

    expect(gen.next().done).toBe(true);
  });

  it('should handle creation error', () => {
    // ARRANGE
    const gen = createDataSaga({ type: 'createData', payload: {} });
    gen.next(); // skip call

    // ACT
    const error = new Error('API Error');
    const result = gen.throw(error);

    // ASSERT
    expect(result.value).toEqual(put(DataActions.createDataFailure(error)));
  });
});
```

### 4. Validators

Stub debounce, test success (undefined) and errors (string/array).

```typescript
// Stub debounce for controlled tests
jest.mock(
  'lodash.debounce',
  () => (fn: any) =>
    Object.assign((...a: any[]) => fn(...a), { cancel: jest.fn(), flush: jest.fn() })
);

describe('validateUniqueId', () => {
  it('should pass validation for unique ID', async () => {
    // ARRANGE
    mockApiService.validateIdAsync.mockResolvedValue(undefined);
    const callback = jest.fn();

    // ACT
    await validateUniqueId(123456, 'data-id', callback);

    // ASSERT
    expect(callback).toHaveBeenCalledWith(undefined); // Success
  });

  it('should return error for duplicate ID', async () => {
    // ARRANGE
    mockApiService.validateIdAsync.mockRejectedValue(
      new Error('ID already exists')
    );
    const callback = jest.fn();

    // ACT
    await validateUniqueId(123456, 'data-id', callback);

    // ASSERT
    expect(callback).toHaveBeenCalledWith(['ID already exists']);
  });
});
```

### 5. Mappers (DTO ⇄ form)

Check type transformations, date/number normalization, conditional logic.

```typescript
describe('mapContainerDtoToForm', () => {
  it('should correctly transform DTO to form', () => {
    // ARRANGE
    const dto = mockContainerDto({
      dataDto: { amount: '1000.50', currency: 'USD' },
      recipientDto: { name: 'Test Company' },
    });

    // ACT
    const result = mapContainerDtoToForm(dto);

    // ASSERT
    expect(result.amount).toBe('1000.50');
    expect(result.currency).toBe('USD');
    expect(result.recipientName).toBe('Test Company');
  });
});
```

### 6. Integration Tests

Check API/business logic connections without DOM rendering.

```typescript
describe('Data Flow Integration', () => {
  it('should process complete data creation cycle', async () => {
    // ARRANGE
    const initData = mockInitDto();
    mockApiService.createData.mockResolvedValue(mockDataContainer());

    // ACT
    const store = createTestStore();
    store.dispatch(DataActions.createData({ init: initData }));

    // ASSERT
    await waitForStoreUpdate(store, (state) => state.data.metadata.status === 'loaded');

    expect(mockApiService.createData).toHaveBeenCalledWith(initData);
    expect(store.getState().data.data.id).toBeDefined();
  });
});
```

## React Hook Form Patterns

> **Detailed guide**: All RHF component testing patterns are described in separate documentation.

**Quick summary** for general tests:

### Basic formRef Usage

```typescript
// formRef for access to form state
const formRef = React.createRef<any>();
renderWithProviders(<Component />, { formRef });

// Access to values
const formValues = formRef.current?.values;
expect(formValues.amount).toBe('5000.00');

// Programmatic change
formRef.current?.setValue('field', 'value', { shouldValidate: true });
```

### Form Validation

```typescript
// Validation via blur
fireEvent.blur(input);
await waitFor(() => {
  expect(screen.getByText(/required field/i)).toBeInTheDocument();
});
```

### Input Simulation

```typescript
// fireEvent.change (used in 95% of tests)
fireEvent.change(input, { target: { value: '7500.00' } });
await waitFor(() => {
  expect(input).toHaveValue('7500.00');
});
```

**Why fireEvent, not userEvent?**

- Better compatibility with UI library mocks
- Predictable behavior in complex forms

---

## Redux and Sagas Testing

### Using Real Redux Store (preferred)

**Pattern**: createTestStore with real reducers (used in 80% of tests)

```typescript
// CORRECT — Real Redux store for integration tests
it('should load document by ID from URL parameter', () => {
  // ARRANGE
  const store = createTestStore({
    document: {
      isLoading: true,
      error: null,
      data: null,
    },
  });

  const dispatchSpy = jest.spyOn(store, 'dispatch');

  // ACT
  renderWithProviders(<DocumentPage />, {
    initialEntries: ['/document/get/test-doc-123'],
    store,
  });

  // ASSERT
  const loadDocumentCalls = dispatchSpy.mock.calls.filter(
    (call) => call[0]?.type === DocumentActions.loadDocument.type
  );
  expect(loadDocumentCalls[0][0]).toEqual(
    expect.objectContaining({
      type: DocumentActions.loadDocument.type,
      payload: expect.objectContaining({ documentId: 'test-doc-123' }),
    })
  );
});

// WRONG — redux-mock-store (NOT used in project)
// Reason: doesn't test real reducer behavior
```

### Manual Saga Testing (100% of sagas tested this way)

**Why NOT redux-saga-test-plan**: Full control over each step, branch testing, no dependencies.

```typescript
// CORRECT — Step-by-step saga generator testing
describe('createDataSaga', () => {
  it('should create data successfully', () => {
    // ARRANGE
    const payload = { init: mockInitDto() };
    const gen = createDataSaga({ type: 'createData', payload });

    // ACT & ASSERT — Step 1: API call
    expect(gen.next().value).toEqual(call(apiService.createData, payload.init));

    // Step 2: Handle successful response
    const response = mockDataContainer();
    expect(gen.next(response).value).toEqual(put(DataActions.createDataSuccess(response)));

    // Step 3: Generator complete
    expect(gen.next().done).toBe(true);
  });

  // CORRECT — Testing error path via generator.throw()
  it('should handle creation error', () => {
    const gen = createDataSaga({ type: 'createData', payload: {} });
    gen.next(); // skip call

    // ACT — Emulate error
    const error = new Error('API Error');
    const result = gen.throw(error);

    // ASSERT
    expect(result.value).toEqual(put(DataActions.createDataFailure(error)));
  });
});
```

### Checking Redux State via Selectors

```typescript
// CORRECT — Using selectors for verification
it('should update state after successful creation', async () => {
  const store = createTestStore();

  // ACT
  store.dispatch(DataActions.setData({ data: mockDataDto() }));

  // ASSERT — Check via selector
  const state = store.getState();
  expect(DataSelectors.data(state)).toBeTruthy();
  expect(DataSelectors.isLoading(state)).toBe(false);
});
```

---

## Business Scenarios and Constants

### createBusinessScenario Helper

**Predefined scenarios** for quick test data creation:

```typescript
// CORRECT — Using ready business scenarios
import { createBusinessScenario } from '@test-utils/businessScenarios';

it('should process standard operation', () => {
  // ARRANGE — 5 types of ready scenarios
  const standardOperation = createBusinessScenario('standard', {
    id: 'test-123',
    status: Status.CREATED,
  });

  const priorityOperation = createBusinessScenario('priority', {
    urgencyLevel: 'high',
  });

  const batchOperation = createBusinessScenario('batch', {
    items: [
      { amount: '30000.00', currency: 'USD' },
      { amount: '20000.00', currency: 'EUR' },
    ],
  });
});
```

### Business Constants (test data standardization)

```typescript
// CORRECT — Using ready constants
import { TEST_ACCOUNTS, TEST_AMOUNTS, TEST_DATA } from '@test-utils/mockData';

it('should correctly process USD operation', () => {
  const data = mockDataDto({
    sourceAccount: TEST_ACCOUNTS.SOURCE_USD,
    targetAccount: TEST_ACCOUNTS.TARGET_USD,
    amount: TEST_AMOUNTS.MEDIUM, // '50000.00'
    currency: TEST_DATA.CURRENCIES.USD,
  });
});

// WRONG — Hardcoded values
const data = mockDataDto({
  sourceAccount: '40702840600000012345', // Magic number
  amount: '12345.67', // Non-standard amount
});
```

**Available constants**:

- `TEST_ACCOUNTS` — source, target accounts (USD, EUR, etc.)
- `TEST_AMOUNTS` — standard amounts (SMALL, MEDIUM, LARGE, ZERO)
- `TEST_DATA` — currencies, countries, codes

---

## Performance and Optimization

### TIMING_CONSTANTS — timeout standardization

```typescript
// CORRECT — Using named constants
export const TIMING_CONSTANTS = {
  DEBOUNCE_INPUT: 500,      // Input debounce (300ms in component + buffer)
  DEBOUNCE_CALCULATION: 1500, // Calculation debounce (1000ms + buffer)
  ASYNC_SELECT_LOAD: 1000,  // AsyncSelect loading
  SHORT: 300,               // Short operations (component loading)
  MEDIUM: 1000,             // Medium operations (async calls)
  LONG: 3000,               // Long operations (complex scenarios)
  API_CALL: 1000,           // API calls
  FORM_SUBMIT: 2000,        // Form submission
  SIGNATURE: 3000,          // Digital signature
} as const;

// Usage
await waitFor(() => {
  expect(mockApi.getData).toHaveBeenCalled();
}, { timeout: TIMING_CONSTANTS.ASYNC_SELECT_LOAD });

// WRONG — Magic numbers
await waitFor(() => { ... }, { timeout: 2500 }); // Where does 2500 come from?
```

### Fixture Minimization (memory and speed savings)

```typescript
// CORRECT — Minimal data via DeepPartial + mergeDeep
const mockMinimalData = (patch?: DeepPartial<DataDto>) =>
  mergeDeep(
    {
      id: 'data-123',
      amount: '50000.00',
      currency: 'USD',
      status: Status.CREATED,
    },
    patch
  );

// WRONG — Excessive data
const mockFullData = () => ({
  id: 'data-123',
  amount: '50000.00',
  currency: 'USD',
  status: Status.CREATED,
  metadata: {
    /* 30+ fields */
  },
  audit: {
    /* change history */
  },
  relatedDocuments: [
    /* 50+ related documents */
  ],
  // ... 300 more lines of unnecessary data
});
```

---

## E2E vs Unit vs Integration

### Test Type Selection Criteria

**Unit tests (70% of all tests)** — isolated function testing:

**When to write**:

- Validators
- Mappers
- Utils (calculateTotal, formatAmount)
- Pure functions without side effects

```typescript
// Unit test for validator
describe('validateCode', () => {
  it('should accept valid 20-digit code', async () => {
    const result = await validateCode('12345678901234567890');
    expect(result).toBeNull();
  });

  it('should reject code not of 20 digits', async () => {
    const result = await validateCode('123456789012345678'); // 18 digits
    expect(result).toBe('Code must be 20 digits');
  });
});
```

**Integration tests (20%)** — testing component interactions:

**When to write**:

- Pages with Redux + RHF integration
- Complex flows (create → edit → preview)
- API + Redux sagas interaction
- Multi-step forms

```typescript
// Integration test for page
describe('DocumentPage', () => {
  it('should load document and display form', async () => {
    const store = createTestStore({
      document: { data: mockDocumentDto() },
    });

    renderWithProviders(<DocumentPage />, {
      store,
      initialEntries: ['/document/get/test-123'],
    });

    await waitFor(() => {
      expect(screen.getByTestId('document-form')).toBeInTheDocument();
    });

    expect(store.getState().document.data?.id).toBe('test-123');
  });
});
```

**E2E tests (5%)** — critical business flows:

**When to write**:

- Complete operation cycle (create → sign → submit → execute)
- Digital signature
- Critical business operations

**Decision Matrix**:

| What we test | Test Type | % of all |
| --- | --- | --- |
| Validators, mappers, utils | Unit | 70% |
| Form components in isolation | Unit | |
| Pages with Redux | Integration | 20% |
| Multi-step forms | Integration | |
| API + Sagas | Integration | |
| Critical business flows | E2E | 5% |
| Digital signature | E2E | |
| Complete document cycle | E2E | |

---

## Practical Rules

### Mock Management

- **Always**: `jest.clearAllMocks()` in `beforeEach`
- **API**: Use `mockApiService` from test-utils + `jest.spyOn` for local overrides
- **External modules**: Mock only what's necessary (KISS/YAGNI)
- **DON'T duplicate**: Centralize common mocks in `test-utils/mockApi.tsx`

### Query Priorities

1. **data-testid** (45%) — for specific elements
2. **getByRole** (40%) — for semantic elements (button, input)
3. **getByText** (10%) — for text content
4. **getByLabelText** (5%) — for forms with labels

```typescript
// Priority 1 — data-testid for specific fields
const input = screen.getByTestId(`currency-field-${Fields.AMOUNT}`);

// Priority 2 — getByRole for buttons
const addButton = screen.getByRole('button', { name: /add account/i });

// Priority 3 — getByText for content verification
expect(screen.getByText('Debit Amount')).toBeInTheDocument();

// queryBy* — only for checking absence
expect(screen.queryByTestId('redirect')).not.toBeInTheDocument();
```

### Assertions

- **Business effect**: Store state, API calls with correct arguments
- **Business data**: Use ready assertions from `test-utils/assertions.ts`
- **Stable selectors**: `data-tid`/`data-testid`, avoid text/role selectors

### Asynchronicity

- **Timeouts**: Use constants from `TIMING_CONSTANTS`, not magic numbers
- **Waiting**: `await waitFor(...)` for DOM changes (used in 70% of async tests)
- **Debounce**: Explicit stub or `useFakeTimers` only when necessary

## Anti-patterns

### 1. Duplicating jest.mock in every file

```typescript
// BAD — Duplication in every test file
// DataForm.test.tsx
jest.mock('@ui-library', () => ({
  ...require('@src/__mocks__/ui-library-lightweight'),
  useNotifications: () => ({ toast: jest.fn(), notice: jest.fn() }),
}));

// DataPreview.test.tsx
jest.mock('@ui-library', () => ({
  ...require('@src/__mocks__/ui-library-lightweight'),
  useNotifications: () => ({ toast: jest.fn(), notice: jest.fn() }),
}));

// GOOD — Centralization in test-utils/mockApi.tsx
// Set up once, reuse everywhere
// Import setupCommonMocks() in each test
```

### 2. Missing error message verification

```typescript
// BAD — Only checking for error presence
it('should validate field', async () => {
  const input = screen.getByTestId('field');
  fireEvent.blur(input);

  // Not checking specific error message
  expect(formRef.current.formState.errors.field).toBeTruthy();
});

// GOOD — Checking specific message
it('should show specific validation error', async () => {
  const input = screen.getByTestId('field');
  fireEvent.blur(input);

  await waitFor(() => {
    expect(screen.getByText(/field cannot be empty/i)).toBeInTheDocument();
  });

  const error = getFieldError(formRef, 'field');
  expect(error).toBe('Field cannot be empty');
});
```

### 3. Excessive fixtures

```typescript
// BAD — Excessive data in mock
const mockData = () => ({
  id: 'data-123',
  // ... 500+ lines of unnecessary data for simple test
});

// GOOD — Minimal data via DeepPartial
const mockData = (patch?: DeepPartial<DataDto>) =>
  mergeDeep(
    {
      id: 'data-123',
      amount: '50000.00',
      currency: 'USD',
      status: Status.CREATED,
    },
    patch
  );
```

### 4. Magic numbers in timeout

```typescript
// BAD — Magic numbers without explanations
await waitFor(
  () => {
    expect(element).toBeInTheDocument();
  },
  { timeout: 2500 }
); // Where does 2500 come from?

// GOOD — Named constants
await waitFor(
  () => {
    expect(element).toBeInTheDocument();
  },
  { timeout: TIMING_CONSTANTS.ASYNC_SELECT_LOAD }
); // 1000ms — clear we're waiting for loading
```

### 5. Long "all-in-one" tests

```typescript
// BAD — One test checks everything
it('should handle entire creation and signing flow', async () => {
  // 100+ lines in one test
});

// GOOD — Split into independent cases
describe('Data Creation Flow', () => {
  it('should create draft when filling required fields', async () => { ... });
  it('should save changes to draft', async () => { ... });
});

describe('Data Signing', () => {
  it('should initiate signing process', async () => { ... });
  it('should handle incorrect password error', async () => { ... });
});
```

### 6. Testing implementation details

```typescript
// BAD — Testing RHF internals
it('should use react-hook-form with yup resolver', () => {
  expect(formRef.current.resolver).toBeDefined();
  expect(formRef.current._options.mode).toBe('onBlur');
});

// GOOD — Testing form behavior
it('should validate field on blur', async () => {
  renderWithProviders(<Form />);

  const input = screen.getByTestId('amount');
  fireEvent.blur(input);

  await waitFor(() => {
    expect(screen.getByText(/required field/i)).toBeInTheDocument();
  });
});
```

### 7. Fragile selectors

```typescript
// BAD — Selectors by DOM structure
const submitButton = container.querySelector('div > div > form > div:nth-child(3) > button');

// GOOD — data-testid for stability
const submitButton = screen.getByTestId('submit-button');

// GOOD — getByRole for semantics
const addButton = screen.getByRole('button', { name: /add account/i });
```

### 8. Ignoring edge cases

```typescript
// BAD — Only happy path
describe('Amount Validation', () => {
  it('should accept valid amount', () => {
    expect(validateAmount('5000.00')).toBeNull();
  });
});

// GOOD — Cover edge cases
describe('Amount Validation', () => {
  it('should accept valid amount', () => {
    expect(validateAmount('5000.00')).toBeNull();
  });

  it('should reject amount with more than 2 decimal places', () => {
    expect(validateAmount('5000.123')).toBe('Maximum 2 decimal places');
  });

  it('should reject amount exceeding daily limit', () => {
    expect(validateAmount('1000000.00')).toContain('Exceeds limit');
  });

  it('should reject zero amount', () => {
    expect(validateAmount('0.00')).toBe('Amount must be greater than 0');
  });

  it('should reject negative amount', () => {
    expect(validateAmount('-5000.00')).toBe('Amount cannot be negative');
  });
});
```

---

## Test Readiness Checklist

### Before commit verify:

**Structure:**

- Test name clearly reflects business scenario
- Uses AAA pattern with explicit comments (// ARRANGE, // ACT, // ASSERT)
- One test = one check (not "all-in-one")
- `beforeEach(() => jest.clearAllMocks())` present

**Infrastructure:**

- **Lightweight UI mock** — `require('@src/__mocks__/ui-library-lightweight')` instead of `requireActual`
- Uses `renderWithProviders` from test-utils
- API mocks from centralized `mockApiService`
- **Minimal fixtures** — only necessary fields via DeepPartial + mergeDeep

**React Hook Form:**

- `formRef` used for access to values/errors/formState (when needed)
- Validation tested via `methods.trigger()` or `fireEvent.blur()`
- Input simulation via `fireEvent.change` (not userEvent)

**Redux:**

- Uses real Redux store via `createTestStore` (not redux-mock-store)
- Sagas tested manually via `generator.next()` (not redux-saga-test-plan)
- State checked via selectors

**Queries and Assertions:**

- Selector priority: data-testid (45%) > getByRole (40%) > getByText (10%)
- Uses business assertions from `test-utils/assertions.ts`
- Verifies business effect: store state, API calls with correct arguments

**Asynchronicity:**

- Uses `await waitFor(...)` for DOM changes (not setTimeout)
- **No magic numbers** — timeout via `TIMING_CONSTANTS`
- Debounce stubbed or uses `useFakeTimers`

**Business specifics:**

- Error paths covered (validation, API failures, edge cases)
- Business edge cases verified (limits, special fields)
- Uses business constants (`TEST_ACCOUNTS`, `TEST_AMOUNTS`)

**Anti-patterns avoided:**

- No jest.mock duplication (centralized in test-utils)
- Error messages verified, not just error presence
- No excessive fixtures (Array.from({ length: 40 }, ...), not 150)
- No implementation details testing (RHF internals, configuration)
- No fragile selectors (DOM structure, nth-child)

---

## Final Recommendations for LLM

### When writing a new test:

1. **Determine test type** (Unit 70% / Integration 20% / E2E 5%)
   - Validators, mappers, utils → Unit
   - Pages with Redux + RHF → Integration
   - Critical business flows → E2E

2. **Use correct domain pattern**

3. **Reuse test-utils**:
   - `renderWithProviders` with `formRef` for RHF
   - `createBusinessScenario` for ready scenarios
   - `TEST_ACCOUNTS`, `TEST_AMOUNTS` for constants
   - Business assertions

4. **Follow AAA pattern**:

   ```typescript
   it('should create data with USD currency', async () => {
     // ARRANGE — Prepare data and mocks
     const data = mockDataDto({ currency: 'USD' });

     // ACT — Action
     const result = await createData(data);

     // ASSERT — Verify business effect
     expect(result.id).toBeDefined();
     expect(mockApiService.createData).toHaveBeenCalledWith(
       expect.objectContaining({ currency: 'USD' })
     );
   });
   ```

5. **Cover edge cases**:
   - Happy path (main scenario)
   - Error paths (validation, API failures)
   - Boundary conditions (limits, empty values, max lengths)
   - Business requirements

### Common LLM mistakes and how to avoid them:

**Mistake**: Using `jest.requireActual('@ui-library')`
**Correct**: `require('@src/__mocks__/ui-library-lightweight')`

**Mistake**: Magic numbers in timeout: `{ timeout: 2500 }`
**Correct**: `{ timeout: TIMING_CONSTANTS.ASYNC_SELECT_LOAD }`

**Mistake**: Duplicating jest.mock in every file
**Correct**: Centralization in test-utils/mockApi.tsx

**Mistake**: Excessive fixtures with 500+ lines of data
**Correct**: Minimal data via `mergeDeep({...}, patch)`

**Mistake**: Testing RHF internals (resolver, _options)
**Correct**: Testing behavior (validation on blur, error messages)

**Mistake**: Unclear names: "works correctly", "test data"
**Correct**: "should create data with USD → EUR conversion"

---

## Conclusion

**Remember the key point**: In enterprise systems, a simple and verified solution is almost always better than a complex and "clever" one.

### Golden rules of testing:

1. **Test behavior, not code** — What the component does, not how it does it
2. **KISS + DRY + YAGNI** — Simplicity, reuse, only what's necessary
3. **AAA pattern everywhere** — Arrange, Act, Assert with explicit comments
4. **Business edge cases** — Limits, validation, compliance requirements
5. **Minimal fixtures** — DeepPartial + mergeDeep, realistic volumes
6. **Centralization** — test-utils for reuse, no duplication
7. **Named constants** — TIMING_CONSTANTS, TEST_ACCOUNTS, no magic numbers

### Successful test structure:

```typescript
describe('Business Domain — Specific Feature', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupApiMocks(); // Centralized setup
  });

  it('should perform specific business scenario', async () => {
    // ARRANGE — Prepare business data
    const data = createBusinessScenario('standard', {
      amount: TEST_AMOUNTS.MEDIUM,
      currency: 'USD',
    });

    // ACT — Action
    const result = await processData(data);

    // ASSERT — Verify business effect
    expect(result.status).toBe(Status.PROCESSED);
    expectBusinessValidation.amount(result.amount); // Custom assertion
  });
});
```

**This document is a living reference**. Use it when writing every test. Follow project patterns, don't reinvent the wheel.

**Good luck with testing!**

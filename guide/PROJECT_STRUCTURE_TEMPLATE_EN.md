# PROJECT_STRUCTURE.md

> Architectural map for AI agents and developers. Enables quick navigation and dependency analysis.

## Overview

**[PROJECT_NAME]** is a **[ARCHITECTURE_TYPE]** built with **[MAIN_STACK]**.

<!-- Example: CCT-UI is a microfrontend built with React 17 + TypeScript + Redux -->

### Stack

| Layer    | Technology                                                              |
| -------- | ----------------------------------------------------------------------- |
| Frontend | [FRONTEND_STACK] <!-- Example: React 17, TypeScript 5.7, Redux-Saga --> |
| Build    | [BUILD_STACK] <!-- Example: Webpack 5, Babel, Module Federation -->     |
| Styles   | [STYLES_STACK] <!-- Example: SCSS, CSS Modules, Design Tokens -->       |
| Testing  | [TESTING_STACK] <!-- Example: Jest, React Testing Library -->           |

---

## Project Tree

<details>
<summary>Expand full structure (tree -L 3)</summary>

```
.
├── [CONFIG_FILES]           # Root configs
│   ├── package.json
│   ├── tsconfig.json
│   └── [BUILD_CONFIG]       # webpack.config.js, vite.config.ts, etc.
├── [SOURCE_FOLDER]/         # Source code
│   ├── [ENTRY_POINT]        # index.tsx, main.ts
│   ├── [COMPONENTS_DIR]/    # Reusable components
│   ├── [PAGES_DIR]/         # Page containers
│   ├── [STATE_DIR]/         # State management (store, reducers)
│   ├── [ROUTES_DIR]/        # Routing configuration
│   ├── [API_DIR]/           # API clients
│   ├── [HOOKS_DIR]/         # Custom hooks
│   ├── [UTILS_DIR]/         # Utilities
│   ├── [TYPES_DIR]/         # TypeScript types
│   └── [CONSTANTS_DIR]/     # Constants
├── [PUBLIC_DIR]/            # Static files
├── [ASSETS_DIR]/            # Fonts, images, styles
└── [OUTPUT_DIR]/            # Build output (generated)
```

**Statistics:**

- Directories: ~[DIR_COUNT] <!-- Example: ~400 -->
- Source files: ~[FILE_COUNT]+ <!-- Example: ~1200+ -->
- Components: ~[COMPONENT_COUNT] <!-- Example: ~90 -->
- Test coverage: [COVERAGE]% <!-- Example: 72% -->

</details>

---

## Path Aliases

<!-- Configure in tsconfig.json, update when adding new paths -->

| Alias           | Path                           | Purpose          |
| --------------- | ------------------------------ | ---------------- |
| `@src/*`        | `[SOURCE_FOLDER]/*`            | Base imports     |
| `@components/*` | `[SOURCE_FOLDER]/components/*` | UI components    |
| `@pages/*`      | `[SOURCE_FOLDER]/pages/*`      | Page containers  |
| `@hooks/*`      | `[SOURCE_FOLDER]/hooks/*`      | Custom hooks     |
| `@api/*`        | `[SOURCE_FOLDER]/api/*`        | API layer        |
| `@utils/*`      | `[SOURCE_FOLDER]/utils/*`      | Utilities        |
| `@types/*`      | `[SOURCE_FOLDER]/types/*`      | TypeScript types |
| `@constants/*`  | `[SOURCE_FOLDER]/constants/*`  | Constants        |
| `@assets/*`     | `[ASSETS_FOLDER]/*`            | Static resources |

<!-- Add project-specific aliases -->

---

## NPM Scripts

| Script             | Description                                           |
| ------------------ | ----------------------------------------------------- |
| `[DEV_COMMAND]`    | Start dev server <!-- Example: npm start -->          |
| `[BUILD_COMMAND]`  | Production build <!-- Example: npm run build:prod --> |
| `[TEST_COMMAND]`   | Run tests <!-- Example: npm test -->                  |
| `[LINT_COMMAND]`   | Lint code <!-- Example: npm run lint -->              |
| `[FORMAT_COMMAND]` | Format code <!-- Example: npm run format -->          |

<!-- Add project-specific scripts -->

---

## Source Structure (`[SOURCE_FOLDER]/`)

### Entry Points

- `[ENTRY_POINT]` — App bootstrap <!-- Example: index.tsx -->
- `[ROOT_COMPONENT]` — Root component <!-- Example: App.tsx -->
- `[ROUTES_CONFIG]` — Route definitions <!-- Example: routes/index.ts -->

### API Layer (`[API_DIR]/`)

<!-- List main API clients -->

- `[API_CLIENT_1]` — [DESCRIPTION] <!-- Example: transferApi.ts — Transfer operations -->
- `[API_CLIENT_2]` — [DESCRIPTION]
- `[BASE_CONFIG]` — Base URL, interceptors <!-- Example: baseURL.ts, retry.ts -->

### Components (`[COMPONENTS_DIR]/`)

Organized by type:

- **[COMPONENT_CATEGORY_1]/**: [DESCRIPTION] <!-- Example: RHFComponents/ — React Hook Form adapters -->
- **[COMPONENT_CATEGORY_2]/**: [DESCRIPTION] <!-- Example: Modals/ — Modal dialogs -->
- **[COMPONENT_CATEGORY_3]/**: [DESCRIPTION]

### Pages (`[PAGES_DIR]/`)

<!-- List main page modules -->

| Module     | Path        | Description                          |
| ---------- | ----------- | ------------------------------------ | ----------- | ---------------------- |
| [MODULE_1] | `[PATH_1]/` | [DESCRIPTION] <!-- Example: Transfer | TransferV2/ | Currency transfers --> |
| [MODULE_2] | `[PATH_2]/` | [DESCRIPTION]                        |
| [MODULE_3] | `[PATH_3]/` | [DESCRIPTION]                        |

### State Management (`[STATE_DIR]/`)

<!-- Describe state architecture -->

- **Pattern**: [STATE_PATTERN] <!-- Example: Redux + Redux-Saga -->
- **Slices**: [SLICE_LIST] <!-- Example: transfer, rpp, dict, user -->
- **Side effects**: [SIDE_EFFECTS] <!-- Example: Sagas in reducers/rootSagas.ts -->

### Hooks (`[HOOKS_DIR]/`)

<!-- List key custom hooks -->

- `[HOOK_1]` — [PURPOSE] <!-- Example: useTransferData.ts — Load transfer data -->
- `[HOOK_2]` — [PURPOSE]
- `[HOOK_3]` — [PURPOSE]

### Validators (`[VALIDATORS_DIR]/`)

<!-- If applicable -->

- Organized by domain: `[DOMAIN_1]/`, `[DOMAIN_2]/`
- Shared validators: `[SHARED_VALIDATORS]`

---

## Configuration

### Build ([BUILD_TOOL])

<!-- Key build configuration -->

- Entry: `[ENTRY_POINT]`
- Output: `[OUTPUT_DIR]/`
- Dev server: [DEV_SERVER_INFO] <!-- Example: port 3000, HMR enabled -->
- [SPECIAL_CONFIG]: [DESCRIPTION] <!-- Example: Module Federation for microfrontend -->

### TypeScript

- Target: [TARGET] <!-- Example: ES2020 -->
- Module: [MODULE] <!-- Example: ESNext -->
- Strict mode: [ENABLED/DISABLED]

### Testing ([TEST_FRAMEWORK])

- Environment: [ENV] <!-- Example: jsdom -->
- Setup: `[SETUP_FILE]` <!-- Example: testSetup.ts -->
- Mocks: `[MOCKS_DIR]/` <!-- Example: src/__mocks__/ -->
- Coverage threshold: [THRESHOLD]% <!-- Example: 80% -->

---

## Key Architectural Patterns

<!-- Document project-specific patterns -->

### [PATTERN_1_NAME]

[PATTERN_1_DESCRIPTION]

<!-- Example:
### Create → Edit → Preview Flow
Standard CRUD flow for all entities:
CREATE PAGE → EDIT PAGE → PREVIEW PAGE (read-only + actions)
-->

### [PATTERN_2_NAME]

[PATTERN_2_DESCRIPTION]

---

## External Integrations

<!-- If applicable -->

| Integration     | Purpose   | Config Location |
| --------------- | --------- | --------------- |
| [INTEGRATION_1] | [PURPOSE] | [PATH]          |
| [INTEGRATION_2] | [PURPOSE] | [PATH]          |

---

## Maintenance

### When to Update This File

- New directory added to `[SOURCE_FOLDER]/`
- New alias added to tsconfig.json
- NPM script added/changed
- Architectural pattern introduced

### Verification Commands

```bash
# Verify structure matches documentation
ls [SOURCE_FOLDER]/
ls [SOURCE_FOLDER]/components/
ls [SOURCE_FOLDER]/pages/

# Check aliases
cat tsconfig.json | grep "paths" -A 20

# List scripts
cat package.json | grep "scripts" -A 30
```

### Sync Checklist

- [ ] Path aliases match tsconfig.json
- [ ] NPM scripts match package.json
- [ ] Directory listings are current
- [ ] Statistics are approximate but reasonable

---

> **Note**: This document is a navigation aid. Keep it accurate but don't over-document. Update when architecture changes, not for every file addition.

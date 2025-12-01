# Claude Agents Collection

Specialized Claude AI agent configurations for software development workflows. Each agent follows SLON, KISS, and Occam's razor principles.

## Core Principles

- **SLON** - Simplicity, Lean solutions, One clear thing, No over-engineering
- **KISS** - As simple as possible, but not simpler than necessary
- **Occam's Razor** - Every abstraction must justify its existence
- **DRY** - Extract shared logic, avoid repetition

## Agents

| Agent                   | Model  | Purpose                                | When to Use                                           |
| ----------------------- | ------ | -------------------------------------- | ----------------------------------------------------- |
| **architect**           | Sonnet | Systems architecture, design decisions | Design, refactoring planning, architecture evaluation |
| **prd-writer**          | Opus   | LLM-optimized PRDs                     | Formalizing requirements before development           |
| **worker**              | Opus   | Production-ready TS/JS code            | Implementing features, executing plans                |
| **test-writer-worker**  | Sonnet | Unit/integration tests                 | Writing tests for components, sagas, validators       |
| **refactor**            | Opus   | Code modularization                    | Files >500 lines, breaking monoliths                  |
| **test-auditor**        | Opus   | Test coverage audit                    | Verifying test quality and coverage                   |
| **linus-code-reviewer** | Opus   | Brutally honest code review            | PR reviews, validating AI-generated code              |

## Scripts

Utility scripts for test and type checking workflows.

| Script               | Purpose                                               | When to Use                                             |
| -------------------- | ----------------------------------------------------- | ------------------------------------------------------- |
| `analyzeCoverage.js` | Parses lcov.info, outputs coverage stats by directory | After running tests with coverage to find weak spots    |
| `extract-tests.js`   | Runs tests with progress bar, ETA, failure extraction | Need detailed failure reports (test-results.failed.txt) |
| `tscFilesRunner.js`  | TypeScript check for specific files                   | Manual TS check on arbitrary files                      |
| `tscParser.js`       | TypeScript check for git staged files                 | Pre-commit TS validation                                |

**Usage:**

```bash
# Coverage analysis (requires coverage/lcov.info)
node scripts/analyzeCoverage.js

# Run tests with progress tracking
node scripts/extract-tests.js

# Check specific files
node scripts/tscFilesRunner.js --files "src/a.ts,src/b.tsx"

# Check staged files
node scripts/tscParser.js
```

## Workflow

**All tasks follow the same flow regardless of complexity:**

### 1. Enter Planning Mode

Use Claude's planning mode or prompt: "Create a detailed step-by-step plan, analyzing the information below"

### 2. Write Your Prompt

- Reference files that may be related to the issue (without assumptions - avoid biasing the AI)
- Specify info gathering: `use multiple @explore subagents to get info, search files and research`
- Specify execution: `use multiple parallel @worker to implement the plan`
- End with: "analyze the information you find and provide at least 3 possible causes"

### 3. For Complex Bugs (optional)

Add reverse analysis: "Conduct reverse analysis from the component where X is used to its source code"

### 4. Refine the Plan

Discuss with AI, iterate until the plan is ideal. Challenge assumptions, debate approaches if needed.

### 5. Execute & Monitor

Accept the plan and monitor execution. Correct in real-time or interrupt if it goes off track.

### 6. Context Management

If context is low (15-20% Claude / 50% Codex remaining):

1. Ask AI to save the complete plan to a file
2. Restart session with clean context
3. Attach the plan and prompt: `Get necessary information with multiple @explore subagents in parallel`

This allows targeted context gathering since the AI knows exactly what to look for.

## License

GNU General Public License v3.0. See [LICENSE](LICENSE) for details.

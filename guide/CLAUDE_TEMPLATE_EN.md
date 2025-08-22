<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# [PROJECT_NAME]

[Brief project description in 1-2 sentences]

**ALWAYS RESPOND IN ENGLISH**

## 📋 Core Working Principles

1. For maximum efficiency, whenever you need to perform multiple independent operations, invoke all relevant tools simultaneously and in parallel.
2. Before you finish, please verify your solution
3. Do what has been asked; nothing more, nothing less.
4. NEVER create files unless they're absolutely necessary for achieving your goal.
5. ALWAYS prefer editing an existing file to creating a new one.
6. NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.
7. ADDITIONAL INFO ON PROJECT CAN BE FOUND IN [./docs or other folder]
8. PROJECT STRUCTURE IS IN ./PROJECT_STRUCTURE.md

## 🚀 Efficient Commands

One CLI command > Multiple tool calls

    1. Pattern Search:
    - rg -n "pattern" --glob '!node_modules/*' instead of multiple Grep calls
    
    2. File Finding:
    - fd filename or fd .ext directory instead of Glob tool
    
    3. File Preview:
    - bat -n filepath for syntax-highlighted preview with line numbers
    
    4. Bulk Refactoring:
    - rg -l "pattern" | xargs sed -i 's/old/new/g' for mass replacements
    
    5. Project Structure:
    - tree -L 2 directories for quick overview
    
    6. JSON Inspection:
    - jq '.key' file.json for quick JSON parsing
    
## 🏗️ Project Stack

- **[Main language/framework]** - [description]
- **[Type system]** - [version and features]
- **[State Management]** - [if applicable]
- **[Bundler]** - [webpack/vite/rollup/etc]
- **[Styles]** - [CSS/SCSS/styled-components/etc]
- **[UI library]** - [if used]
- **[Testing]** - [framework and approach]
- **[Runtime]** - [Node.js/Deno/Bun version]


## 🏛️ Architectural Principles

**"As simple as possible, but not simpler"**

- **KISS + DRY + YAGNI + Occam's Razor**: each new entity must justify its existence
- **Prior-art first**: look for existing solutions first, then write our own
- **Documentation = part of code**: architectural decisions are recorded in code and comments
- **No premature optimization**
- **100% certainty**: evaluate cascading effects before changes


## 🚨 Code Quality Standards

**All code checks are mandatory - code must be ✅ CLEAN!**
No errors. No formatting issues. No compiler warnings.

**Architectural standards:**

- Minimally sufficient patterns (don't overcomplicate)
- Decomposition: break tasks into subtasks
- Cascading effects: evaluate impact of changes


## 🎯 Main Project Features

1. **[Feature 1]** - [description]
2. **[Feature 2]** - [description]
3. **[Feature 3]** - [description]
[Add as needed]

## 📁 Project Structure

```
[root]/
  📱 [entry point]          # Application entry point
  🧩 [components/modules]   # Main modules
  📄 [pages/views]          # Pages/views
  🔧 [config]               # Configuration
  🛠️ [utils/helpers]       # Utilities and helpers
  🏷️ [types]               # Types (if applicable)
  🎨 [styles]               # Styles
```

> 📖 **Detailed architecture**: Full structure in PROJECT_STRUCTURE.md

## ✅ Verification Checkpoints

**Stop and check** at these moments:

- After implementing a complete function
- Before starting a new component/module
- Before declaring "done"

Run check: `[check commands: lint, test, build]`

> Why: This prevents error accumulation and ensures code stability.

## 💻 Coding Standards

### Mandatory rules:

- Always use specific types (if language supports)
- Use constants and configuration
- Reuse existing components and utilities
- Always handle exceptions
- **Meaningful names** for variables and functions
- **Early returns** to reduce nesting
- **Error handling** explicit and clear


## 📊 Implementation Standards

### Code is considered ready when:

- ✓ Build passes without errors
- ✓ All tests pass
- ✓ Formatting applied
- ✓ Compiler produces no errors/warnings
- ✓ Function works end-to-end
- ✓ Old/unused code removed
- ✓ Code is understandable to junior developer


### Testing Strategy

- Unit tests for functions and modules
- Integration tests for API/services
- E2E tests for critical functionality (if applicable)
- Critical functionality → write tests first


### **Security always**:

- Validate all external data
- Don't store sensitive data openly
- Use HTTPS/TLS for communication
- Escape user input


## 📘 Code Pattern Examples

### [Main project pattern example]

```[language]
// Add characteristic project code example
// that demonstrates main patterns
```


## 🛠️ Development Commands

### Main commands

- `[build command]` - Build project
- `[dev command]` - Run in development mode
- `[test command]` - Run tests
- `[lint command]` - Check code quality
- `[format command]` - Format code


### Additional commands

[Add project-specific commands]

### Development mode

- **Dev server**: `[URL and port]`
- **API/Backend**: `[URL and port if applicable]`
- **Hot reloading**: [enabled/disabled]


## 🌟 Key Project Features

### [Feature 1]

- Description of key architectural decisions
- Important dependencies
- Integration points


### [Feature 2]

- Project-specific details
- Important to know during development

***

## 📝 Template Adaptation Instructions

When adapting this template for a specific project:

1. Replace all placeholders in square brackets `[...]` with actual values
2. Remove non-applicable sections
3. Add project-specific sections
4. Update code examples with real ones from project
5. Specify actual commands and dependencies
6. Follow KISS, Occam's razor, DRY, YAGNI principles

Template should be:

- **Minimally sufficient** - only necessary information
- **Practical** - real commands and examples
- **Current** - match project's current state
- **Clear** - understandable to any developer

---

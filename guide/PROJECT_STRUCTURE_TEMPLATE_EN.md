<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Project Structure [PROJECT_NAME]

> **Architectural map of the project for AI agents and developers**

## 🏗️ General Architecture

The project is a **[ARCHITECTURE_TYPE]** based on **[MAIN_STACK]** with [ARCHITECTURE_PATTERN] architecture. Uses **[MAIN_LANGUAGE]** with **[BUILD_TOOL]** for building and **[TEST_FRAMEWORK]** for testing.

### Technology Stack

- **Frontend/Main**: [FRONTEND_STACK]
- **Build**: [BUILD_STACK]
- **Styles**: [STYLES_STACK]
- **Testing**: [TESTING_STACK]
- **[ADDITIONAL_STACK_CATEGORY]**: [ADDITIONAL_STACK_DESCRIPTION]


## 📁 Directory Structure

### Root Directory

```
/[PROJECT_FOLDER]/
├── [CONFIG_FILES]           # [CONFIG_DESCRIPTION]
├── [MAIN_CONFIG]            # [MAIN_CONFIG_DESCRIPTION]
├── [DEPENDENCIES_FILE]      # Dependencies and scripts
├── [BUILD_CONFIG]           # Build configuration
├── [TEST_CONFIG]            # Test configuration
└── [DOCS_FOLDER]/          # Documentation
```


### Source Code (`[SOURCE_FOLDER]/`)

```
[SOURCE_FOLDER]/
├── [ENTRY_POINT]           # Application entry point
├── [COMPONENTS_DIR]/       # [COMPONENTS_DESCRIPTION]
├── [PAGES_CONTAINERS]/     # [PAGES_DESCRIPTION]
├── [STATE_MANAGEMENT]/     # [STATE_DESCRIPTION]
├── [ROUTING_CONFIG]/       # [ROUTING_DESCRIPTION]
├── [UTILS_HELPERS]/        # Utilities and helpers
├── [TYPES_DIR]/           # Types/interfaces
├── [STYLES_DIR]/          # Styles
├── [ASSETS_DIR]/          # Assets (images, fonts)
├── [CONFIG_DIR]/          # Configuration
└── [TESTS_CONFIG]         # Test settings
```


### Resources and Static Files

```
[PUBLIC_DIR]/              # Static files
├── [IMAGES_DIR]/         # Images
├── [FONTS_DIR]/          # Fonts
├── [FILES_DIR]/          # Documents and files
└── [STATIC_FILES]        # Additional static resources

[OUTPUT_DIR]/             # Build output
└── (generated automatically)
```


### Auxiliary Directories

```
[MOCKS_DIR]/              # Test mocks
[COVERAGE_DIR]/           # Test coverage reports
[BUILD_SCRIPTS]/          # Build scripts
[CACHE_DIR]/             # Development cache
[ADDITIONAL_DIRS]         # Other auxiliary folders
```


## 🧩 Key Architecture Components

### 1. Entry Point (`[ENTRY_POINT_PATH]`)

- [ENTRY_POINT_RESPONSIBILITIES]
- [INITIALIZATION_STEPS]
- [MAIN_SETUP_FEATURES]


### 2. [MAIN_ARCHITECTURE_COMPONENT]

- **[COMPONENT_1]**: [DESCRIPTION_1]
- **[COMPONENT_2]**: [DESCRIPTION_2]
- **[COMPONENT_3]**: [DESCRIPTION_3]


### 3. Modular Structure

Each functional module includes:

- **[MODULE_PART_1]** (`[MODULE_PATH_1]/`)
- **[MODULE_PART_2]** (`[MODULE_PATH_2]/`)
- **[MODULE_PART_3]** (`[MODULE_PATH_3]/`)
- **[MODULE_PART_4]** (`[MODULE_PATH_4]/`)


### 4. [ROUTING_SYSTEM] (`[ROUTING_PATH]`)

Centralized route management:

- [ROUTING_FEATURES]
- [API_ROUTING_INFO]
- [FRONTEND_ROUTING_INFO]


## 🔧 Configuration Files

### [BUILD_TOOL] (`[BUILD_CONFIG_FILE]`)

- **Entry point**: `[ENTRY_POINT]`
- **Output**: `[OUTPUT_DIRECTORY]`
- **Dev server**: [DEV_SERVER_INFO]
- **[PROXY_INFO]**: [PROXY_DESCRIPTION]
- **Aliases**: [ALIASES_INFO]


### [LANGUAGE_CONFIG] (`[LANGUAGE_CONFIG_FILE]`)

- **Target**: [COMPILE_TARGET]
- **Module**: [MODULE_SYSTEM]
- **Aliases**:
[PATH_ALIASES_LIST]


### [TEST_FRAMEWORK] (`[TEST_CONFIG_FILE]`)

- **Environment**: [TEST_ENVIRONMENT]
- **Coverage**: [COVERAGE_THRESHOLD]
- **Mocks**: [MOCKED_LIBRARIES]
- **Transformations**: [TEST_TRANSFORMATIONS]


### [TRANSPILER] (`[TRANSPILER_CONFIG]`)

- **Presets**: [PRESETS_LIST]
- **Plugins**: [PLUGINS_LIST]


## 🎯 Main Application Modules

### Large Functional Blocks:

#### 1. [MODULE_1_NAME] (`[MODULE_1_PATH]/`)

- [MODULE_1_FEATURE_1]
- [MODULE_1_FEATURE_2]
- [MODULE_1_FEATURE_3]
- [MODULE_1_FEATURE_4]


#### 2. [MODULE_2_NAME] (`[MODULE_2_PATH]/`)

- [MODULE_2_FEATURE_1]
- [MODULE_2_FEATURE_2]
- [MODULE_2_FEATURE_3]
- [MODULE_2_FEATURE_4]


#### 3. [MODULE_3_NAME] (`[MODULE_3_PATH]/`)

- [MODULE_3_FEATURE_1]
- [MODULE_3_FEATURE_2]
- [MODULE_3_FEATURE_3]
- [MODULE_3_FEATURE_4]


#### 4. [MODULE_4_NAME] (`[MODULE_4_PATH]/`)

- [MODULE_4_FEATURE_1]
- [MODULE_4_FEATURE_2]
- [MODULE_4_FEATURE_3]
- [MODULE_4_FEATURE_4]


#### 5. [MODULE_5_NAME] (`[MODULE_5_PATH]/`)

- [MODULE_5_FEATURE_1]
- [MODULE_5_FEATURE_2]
- [MODULE_5_FEATURE_3]
- [MODULE_5_FEATURE_4]


### Reusable Components (`[COMPONENTS_DIR]/`)

- **[COMPONENT_1]**: [COMPONENT_1_DESCRIPTION]
- **[COMPONENT_2]**: [COMPONENT_2_DESCRIPTION]
- **[COMPONENT_3]**: [COMPONENT_3_DESCRIPTION]
- **[COMPONENT_4]**: [COMPONENT_4_DESCRIPTION]
- **[COMPONENT_5]**: [COMPONENT_5_DESCRIPTION]


## 🔄 Data Flow

### [DATA_FLOW_PATTERN]

```
[DATA_FLOW_DIAGRAM]
```


### [DATA_MANAGEMENT_SYSTEM]:

- **[DATA_COMPONENT_1]**: [DATA_COMPONENT_1_DESCRIPTION]
- **[DATA_COMPONENT_2]**: [DATA_COMPONENT_2_DESCRIPTION]
- **[DATA_COMPONENT_3]**: [DATA_COMPONENT_3_DESCRIPTION]
- **[DATA_COMPONENT_4]**: [DATA_COMPONENT_4_DESCRIPTION]


### [SELECTORS_OR_QUERIES]

- [SELECTOR_FEATURE_1]
- [SELECTOR_FEATURE_2]
- [SELECTOR_FEATURE_3]


## 🛠️ Development Tools

### [PACKAGE_MANAGER] Commands

```bash
[DEV_COMMAND]             # [DEV_DESCRIPTION]
[BUILD_COMMAND]           # [BUILD_DESCRIPTION]
[TEST_COMMAND]            # [TEST_DESCRIPTION]
[LINT_COMMAND]            # [LINT_DESCRIPTION]
[FORMAT_COMMAND]          # [FORMAT_DESCRIPTION]
[START_COMMAND]           # [START_DESCRIPTION]
[ADDITIONAL_COMMANDS]     # [ADDITIONAL_DESCRIPTIONS]
```


### [DEVELOPMENT_SERVER_NAME] (`[DEV_SERVER_PATH]/`)

- [DEV_SERVER_FEATURE_1]
- [DEV_SERVER_FEATURE_2]
- [DEV_SERVER_FEATURE_3]
- [DEV_SERVER_FEATURE_4]


## 🧪 Testing

### Test Structure

- **[TEST_TYPE_1]**: `[TEST_PATTERN_1]`
- **[TEST_TYPE_2]**: `[TEST_PATTERN_2]`
- **[TEST_TYPE_3]**: `[TEST_PATTERN_3]`
- **[TEST_TYPE_4]**: `[TEST_PATTERN_4]`


### Code Coverage

- Minimum threshold: [COVERAGE_PERCENTAGE]%
- Exclusions: [COVERAGE_EXCLUSIONS]
- [COVERAGE_REPORT_FORMATS] reports


## 🎨 Styles and UI

### [STYLES_ARCHITECTURE] Architecture

```
[STYLES_DIR]/
├── [STYLES_CONFIG_FILE]     # [STYLES_CONFIG_DESCRIPTION]
├── [GLOBAL_STYLES_FILE]     # [GLOBAL_STYLES_DESCRIPTION]
├── [MIXINS_FILE]           # [MIXINS_DESCRIPTION]
├── [TYPOGRAPHY_FILE]       # [TYPOGRAPHY_DESCRIPTION]
└── [STYLES_ENTRY_FILE]     # [STYLES_ENTRY_DESCRIPTION]
```


### [UI_LIBRARY] ([UI_LIBRARY_VERSION])

- [UI_LIBRARY_FEATURE_1]
- [UI_LIBRARY_FEATURE_2]
- [UI_LIBRARY_FEATURE_3]
- [UI_LIBRARY_FEATURE_4]


## 🔗 External Dependencies

### Main Libraries

- **[MAIN_LIB_1]**: [MAIN_LIB_1_DESCRIPTION]
- **[MAIN_LIB_2]**: [MAIN_LIB_2_DESCRIPTION]
- **[MAIN_LIB_3]**: [MAIN_LIB_3_DESCRIPTION]
- **[MAIN_LIB_4]**: [MAIN_LIB_4_DESCRIPTION]
- **[MAIN_LIB_5]**: [MAIN_LIB_5_DESCRIPTION]
- **[MAIN_LIB_6]**: [MAIN_LIB_6_DESCRIPTION]


### Dev Dependencies

- **[DEV_LIB_1]**: [DEV_LIB_1_DESCRIPTION]
- **[DEV_LIB_2]**: [DEV_LIB_2_DESCRIPTION]
- **[DEV_LIB_3]**: [DEV_LIB_3_DESCRIPTION]
- **[DEV_LIB_4]**: [DEV_LIB_4_DESCRIPTION]
- **[DEV_LIB_5]**: [DEV_LIB_5_DESCRIPTION]


## 📊 Metrics and Monitoring

### Project Size

- ~[FILES_COUNT]+ files in [SOURCE_DIR]/
- ~[API_ROUTES_COUNT]+ [API_INFO]
- ~[COVERAGE_PERCENT]% test coverage
- [LANGUAGE_SPECIFIC_INFO]


### Performance

- [PERFORMANCE_FEATURE_1]
- [PERFORMANCE_FEATURE_2]
- [PERFORMANCE_FEATURE_3]
- [PERFORMANCE_FEATURE_4]


## 🚨 Important Development Notes

### Architectural Constraints

1. **[LIMITATION_1]**: [LIMITATION_1_DESCRIPTION]
2. **[LIMITATION_2]**: [LIMITATION_2_DESCRIPTION]
3. **[LIMITATION_3]**: [LIMITATION_3_DESCRIPTION]
4. **[LIMITATION_4]**: [LIMITATION_4_DESCRIPTION]

### Integration Points

- **[INTEGRATION_1]**: [INTEGRATION_1_DESCRIPTION]
- **[INTEGRATION_2]**: [INTEGRATION_2_DESCRIPTION]
- **[INTEGRATION_3]**: [INTEGRATION_3_DESCRIPTION]
- **[INTEGRATION_4]**: [INTEGRATION_4_DESCRIPTION]


### Critical Dependencies

- **[CRITICAL_DEP_1]**: [CRITICAL_DEP_1_DESCRIPTION]
- **[CRITICAL_DEP_2]**: [CRITICAL_DEP_2_DESCRIPTION]
- **[CRITICAL_DEP_3]**: [CRITICAL_DEP_3_DESCRIPTION]

***

## 📝 Template Adaptation Instructions

When adapting this template for a specific project:

1. **Project Analysis**: Study folder structure, package.json, configuration files
2. **Replace Placeholders**: Replace all values in square brackets `[...]` with actual values
3. **Remove Irrelevant**: Remove sections that don't apply to the project
4. **Add Specific**: Add unique project architecture features
5. **Update Commands**: Ensure all commands and paths are correct
6. **Verify Structure**: Cross-check with actual file structure of the project

The document should be:

- **Accurate** - reflect the actual project structure
- **Complete** - cover all key architecture components
- **Current** - match the current state of the codebase
- **Navigational** - help quickly orient within the project

***

> **Note**: This document serves as a navigation map for AI agents and developers. When making architectural changes, update the corresponding sections.
<span style="display:none">[^1][^2][^3][^4][^5][^6][^7][^8][^9]</span>

<div style="text-align: center">⁂</div>

[^1]: https://translate.google.com/?hl=ru\&layout=1\&eotf=1\&sl=en\&tl=es\&text=

[^2]: https://www.onlinedoctranslator.com/en/translate-russian-to-english_ru_en

[^3]: http://www.lingvista.ru/en/projects/projects-translation/

[^4]: https://www.talkrussian.com/technical-russian-translation

[^5]: https://www.russian-translation-pros.com/russian-translation-technical.html

[^6]: http://www.benevox.com/en/tekhnicheskij-perevod.html

[^7]: https://translate.google.ca

[^8]: https://www.canva.com/features/document-translator/

[^9]: https://quillbot.com/translate/russian-to-english


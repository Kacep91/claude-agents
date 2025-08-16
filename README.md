# Claude Agents Collection

A comprehensive collection of specialized Claude AI agent configurations designed to streamline and optimize software development workflows. Each agent serves a distinct role in the development process, following SLON principles, KISS philosophy, and Occam's razor to maintain simplicity and effectiveness.

## Overview

This project provides seven specialized Claude agents that work together to create a complete software development ecosystem:

- **Scanner** - Information gathering and analysis
- **Architect** - Systems design and architecture
- **Project Planner** - Strategic planning and task coordination
- **PRD Writer** - Product requirements documentation
- **Worker** - Implementation and execution
- **Refactor** - Code optimization and modularization
- **Auditor** - Quality verification and completion validation

## Agent Profiles

### 🔍 Scanner Agent

- **Model**: Sonnet
- **Color**: Blue
- **Purpose**: Comprehensive, unbiased information gathering and analysis
- **Capabilities**:
  - Systematic codebase reconnaissance
  - Pattern recognition and documentation
  - Context discovery and mapping
  - Raw data collection without interpretation
  - Gap identification in implementations
  - PROJECT_STRUCTURE.md analysis for project-wide issues

**When to Use**: Before making any major decisions, understanding complex bugs, or analyzing existing architectures.

### 🏗️ Architect Agent

- **Model**: Sonnet
- **Color**: Purple
- **Purpose**: Systems architecture and design excellence
- **Capabilities**:
  - Complete component mapping and dependency analysis
  - SLON/KISS violation identification
  - Architectural decision records (ADR)
  - Performance and scalability assessment
  - Migration and rollout planning
  - **ALWAYS ULTRATHINK methodology** for comprehensive analysis
  - Multi-pass design approach (Initial Scan → Simplify → Design → Review)

**When to Use**: For design decisions, refactoring planning, or architecture evaluation tasks.

### 📋 Project Planner Agent

- **Model**: Opus
- **Color**: Orange
- **Purpose**: Comprehensive project analysis and strategic planning
- **Capabilities**:
  - Multi-step hierarchical planning
  - Risk assessment and mitigation strategies
  - Technical requirement extraction
  - Implementation phase structuring
  - Worker task delegation

**When to Use**: For new features, complex projects, or when you need strategic implementation roadmaps.

### 📄 PRD Writer Agent

- **Model**: Sonnet
- **Color**: Green
- **Purpose**: Product Requirements Document creation
- **Capabilities**:
  - Business and user goal documentation
  - User persona development
  - Functional requirements specification
  - User story creation with acceptance criteria
  - Technical considerations documentation

**When to Use**: When formalizing product specifications or documenting feature requirements.

### ⚡ Worker Agent

- **Model**: Sonnet
- **Color**: Yellow
- **Purpose**: Precise implementation and execution
- **Capabilities**:
  - Code implementation following project conventions
  - Quality assurance and testing
  - Error handling and edge case management
  - Documentation updates
  - Validation and verification

**When to Use**: For executing planned solutions, implementing features, or fixing identified issues.

### 🔧 Refactor Agent

- **Model**: Sonnet
- **Color**: Cyan
- **Purpose**: Code optimization and modularization specialist
- **Capabilities**:
  - **PROACTIVE large file decomposition when files exceed 500 lines**
  - Logical boundary identification
  - Component extraction and modularization
  - Dead code elimination
  - Interface design and cleanup
  - Monolith slaying methodology with systematic analysis and execution

**When to Use**: For breaking down monoliths, optimizing large files, or improving code structure.

### ✅ Auditor Agent

- **Model**: Sonnet
- **Color**: Pink
- **Purpose**: Comprehensive task completion verification and quality assurance
- **Capabilities**:
  - Complete requirement verification against original specifications
  - End-to-end solution validation
  - Quality assessment using SLON, KISS, and Occam's razor principles
  - Gap analysis and missing functionality identification
  - Production-readiness evaluation

**When to Use**: To verify task completion, validate implementations meet all requirements, or confirm production readiness.

## Workflow Integration

### Typical Development Flow

```mermaid
graph TD
    A[Task/Issue] --> B[Scanner Agent]
    B --> C{Analysis Complete?}
    C -->|Complex Design| D[Architect Agent]
    C -->|New Feature| E[Project Planner]
    C -->|Documentation Needed| F[PRD Writer]
    D --> G[Implementation Plan]
    E --> G
    F --> G
    G --> H[Worker Agent]
    H --> I{Code Quality Check}
    I -->|Large Files >500 lines| J[Refactor Agent]
    I -->|Complete| K[Auditor Agent]
    J --> K
    K --> L{Verification Complete?}
    L -->|Gaps Found| H
    L -->|Complete| M[Delivery]
```

### Agent Interaction Patterns

1. **Discovery Phase**: Scanner → (Architect/Planner)
2. **Planning Phase**: (Architect/Planner) → Worker
3. **Implementation Phase**: Worker → (Refactor if needed)
4. **Quality Verification Phase**: Auditor → (Worker if gaps found)
5. **Documentation Phase**: PRD Writer (as needed)

## ULTRATHINK Methodology

ULTRATHINK is an advanced multi-agent coordination approach that maximizes parallel processing and comprehensive analysis through simultaneous agent deployment.

### USAGE EXAMPLE

> Use multiple, simultaneous scanner subagents to search, analyze, collect and extract information from code and the internet
> Use project-planner subagent for thorough planning, creating step-by-step plans, with maximum details and phases  
> Use multiple, simultaneous, parallel worker subagents to execute the plan
> ULTRATHINK
> {USER_PROMPT}

### Practical Implementation

```mermaid
graph TD
    A[Complex Task] --> B[Deploy Multiple Scanner Agents]
    B --> C[Scanner 1: Codebase Analysis]
    B --> D[Scanner 2: Dependencies Check]
    B --> E[Scanner 3: Documentation Review]
    B --> F[Scanner 4: External Research]

    C --> G[Project Planner Agent]
    D --> G
    E --> G
    F --> G

    G --> H[Detailed Multi-Phase Plan]
    H --> I[Deploy Parallel Worker Agents]

    I --> J[Worker 1: Core Implementation]
    I --> K[Worker 2: Testing & Validation]
    I --> L[Worker 3: Documentation Updates]
    I --> M[Worker 4: Integration Tasks]

    J --> N[Synchronized Completion]
    K --> N
    L --> N
    M --> N
```

### Multi-Agent Coordination Example

```python
# ULTRATHINK coordination pattern
async def ultrathink_workflow(complex_task):
    # Phase 1: Parallel Information Gathering
    scanner_tasks = await asyncio.gather(
        scanner_agent_1.analyze_codebase(task.codebase),
        scanner_agent_2.check_dependencies(task.dependencies),
        scanner_agent_3.review_docs(task.documentation),
        scanner_agent_4.research_external(task.requirements)
    )

    # Phase 2: Comprehensive Planning
    comprehensive_plan = await project_planner.create_detailed_plan(
        scanner_results=scanner_tasks,
        complexity_level="maximum_detail",
        phases="multi_step_breakdown"
    )

    # Phase 3: Parallel Execution
    execution_results = await asyncio.gather(
        worker_agent_1.implement_core(comprehensive_plan.phase_1),
        worker_agent_2.handle_testing(comprehensive_plan.phase_2),
        worker_agent_3.update_docs(comprehensive_plan.phase_3),
        worker_agent_4.integrate_systems(comprehensive_plan.phase_4)
    )

    return synchronized_completion(execution_results)
```

### Best Practices for Multi-Agent Coordination

#### 1. **Information Gathering Phase**

- Deploy 3-4 scanner agents simultaneously for different aspects
- Assign specific domains: codebase, dependencies, documentation, external research
- Ensure no overlap in scanning responsibilities
- Aggregate findings before planning phase

#### 2. **Strategic Planning Phase**

- Use single Project Planner agent for consistency
- Feed all scanner results into comprehensive analysis
- Request maximum detail level and multi-phase breakdown
- Validate plan completeness before execution

#### 3. **Parallel Execution Phase**

- Deploy multiple worker agents for different plan phases
- Maintain clear separation of concerns between workers
- Implement synchronization points for dependent tasks
- Monitor progress across all parallel streams

#### 4. **Quality Assurance**

- Run Auditor agent after all workers complete
- Validate against original requirements from scanners
- Ensure no gaps in implementation coverage
- Confirm production readiness

#### 5. **Coordination Guidelines**

- **Always start with parallel scanning** for complex tasks
- **Single source of truth** for planning (one Project Planner)
- **Clear task boundaries** for parallel workers
- **Explicit synchronization** points between phases
- **Comprehensive validation** at completion

### When to Use ULTRATHINK

- **Complex, multi-faceted projects** requiring comprehensive analysis
- **Large codebases** with multiple interconnected components
- **Critical implementations** where thoroughness is paramount
- **Cross-domain tasks** involving code, documentation, and external research
- **High-stakes projects** requiring maximum quality assurance

## Usage Guidelines

### Core Principles

All agents follow these foundational principles:

- **SLON Principles**: Strive for Simplicity, Lean solutions, doing One clear thing, and No unnecessary overengineering
- **KISS (Keep It Simple, Stupid)**: "As simple as possible, but not simpler than necessary"
- **Occam's Razor**: Every new entity or abstraction must justify its existence

### Best Practices

1. **Always start with Scanner** for complex or unfamiliar codebases
2. **Use Project Planner** for multi-step features and strategic planning
3. **Architect handles** design decisions and architectural evaluations
4. **PRD Writer** formalizes requirements before development
5. **Worker executes** with precision and quality focus
6. **Refactor PROACTIVELY** when files exceed 500 lines (automatic trigger)

### Agent Selection Guide

| Scenario                        | Recommended Agent | Reason                                         |
| ------------------------------- | ----------------- | ---------------------------------------------- |
| Understanding existing codebase | Scanner           | Comprehensive analysis without bias            |
| Planning new feature            | Project Planner   | Strategic multi-step planning                  |
| Architecture decisions          | Architect         | Design expertise and SLON principles           |
| Documenting requirements        | PRD Writer        | Structured requirement documentation           |
| Implementing solutions          | Worker            | Precise execution and quality                  |
| Large file optimization         | Refactor          | Automatic for >500 lines                       |
| Verifying task completion       | Auditor           | Comprehensive validation and quality assurance |

## Getting Started

1. **Identify your task type** using the agent selection guide
2. **Start with analysis** (Scanner) for complex scenarios
3. **Plan strategically** (Project Planner/Architect) for significant changes
4. **Document requirements** (PRD Writer) for new features
5. **Implement precisely** (Worker) following the plan
6. **Optimize continuously** (Refactor) as code grows
7. **Verify completion** (Auditor) to ensure quality and requirement fulfillment before considering the task finished

## Agent Tools and Capabilities

Each agent comes with specialized tools optimized for their role:

- **Scanner**: 35 tools including Figma API integration, Context7 library access, full Playwright browser automation (25 tools), IDE integration, plus comprehensive file analysis and search capabilities
- **Project Planner**: 32 tools including IDE integration, Context7 library access, full Playwright browser automation, comprehensive research and documentation tools
- **Architect**: 7 tools focused on quick analysis (Bash, Grep, LS, WebSearch, TodoWrite, NotebookRead, Glob) for architectural assessment and documentation
- **PRD Writer**: 8 tools for research and documentation (Task, Bash, Grep, LS, Read, Write, WebSearch, Glob)
- **Worker**: 9 implementation-focused tools (Read, Write, Edit, MultiEdit, Bash, Grep, Glob, LS, TodoWrite) for precise code execution
- **Refactor**: 4 specialized tools (Read, Edit, Bash, Grep) for code analysis and restructuring
- **Auditor**: Comprehensive quality verification tools (Read, Grep, Glob) plus extensive analysis capabilities for thorough task completion validation

## License

This project is released under the GNU General Public License v3.0. See [LICENSE](LICENSE) for details.

---

**Philosophy**: Each agent embodies expertise while maintaining simplicity. Together, they create a powerful development workflow that scales from simple tasks to complex architectural challenges, always prioritizing maintainable, high-quality outcomes.

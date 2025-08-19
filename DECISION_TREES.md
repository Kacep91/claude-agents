# DECISION TREES AND SELECTION GUIDES

Comprehensive guide for selecting the right agent for your task. Choose wisely to avoid over-engineering and get optimal results.

## MAIN AGENT SELECTION DECISION TREE

```
Problem/Task Input
├── Need to understand existing code/system?
│   ├── Yes → **SCANNER** (Reconnaissance first)
│   └── No → Continue below
│
├── What type of work is this?
│   ├── Analysis/Research → **SCANNER**
│   ├── Planning/Strategy → **PLANNER** 
│   ├── Documentation → **PRD WRITER**
│   ├── Implementation → **WORKER**
│   ├── Architecture/Design → **ARCHITECT**
│   ├── Code Organization → **REFACTOR**
│   └── Verification/QA → **AUDITOR**
│
└── How complex is the task?
    ├── Simple (1-2 steps) → Direct to primary agent
    ├── Complex (3-5 steps) → SCANNER → Primary agent
    └── Major project (5+ steps) → SCANNER → PLANNER → Multiple agents
```

## COMPLEXITY-BASED SELECTION

### Simple Tasks (1-2 steps)
**Go directly to the appropriate agent:**
- Quick fixes → **WORKER**
- Basic documentation → **PRD WRITER** 
- Simple refactoring → **REFACTOR**
- Quick verification → **AUDITOR**

### Moderate Tasks (2-5 steps)
**Scanner + Primary Agent:**
1. **SCANNER** → Understand the landscape
2. Primary agent → Execute the work
3. Optional: **AUDITOR** → Verify completion

### Complex Tasks (5+ steps)
**Full ULTRATHINK Methodology:**
1. **SCANNER** → Comprehensive analysis
2. **PLANNER** → Break down into phases
3. Multiple specialized agents → Execute phases
4. **AUDITOR** → Final verification

### Enterprise/Critical Tasks
**Maximum rigor:**
1. **SCANNER** → Full reconnaissance
2. **ARCHITECT** → Design solution architecture  
3. **PLANNER** → Create detailed execution plan
4. **WORKER** → Implement core functionality
5. **REFACTOR** → Organize and optimize code
6. **AUDITOR** → Comprehensive verification

---

## SCENARIO-BASED SELECTION GUIDES

### By Project Phase

#### Requirements Gathering
- **Primary**: PRD WRITER
- **Support**: SCANNER (to understand existing systems)
- **Follow-up**: PLANNER (to plan implementation)

#### Planning & Architecture
- **Primary**: PLANNER (for execution plans)
- **Primary**: ARCHITECT (for system design)
- **Prerequisites**: SCANNER (for existing system analysis)

#### Implementation
- **Primary**: WORKER 
- **Prerequisites**: PLANNER (for clear tasks)
- **Support**: REFACTOR (for large file organization)

#### Testing & Verification
- **Primary**: AUDITOR
- **Support**: WORKER (for fixing issues)

#### Deployment & Documentation
- **Primary**: PRD WRITER (for user documentation)
- **Support**: WORKER (for deployment scripts)

### By Complexity Level

#### Simple (1-3 files, <100 lines)
```
Task Type → Direct Agent
├── Bug fix → WORKER
├── Documentation → PRD WRITER  
├── Code cleanup → REFACTOR
└── Verification → AUDITOR
```

#### Moderate (3-10 files, 100-500 lines)
```
SCANNER → Primary Agent → AUDITOR
├── New feature → SCANNER → WORKER → AUDITOR
├── Refactoring → SCANNER → REFACTOR → AUDITOR
├── Architecture change → SCANNER → ARCHITECT → WORKER
└── Documentation update → SCANNER → PRD WRITER
```

#### Complex (10+ files, 500+ lines)
```
SCANNER → ARCHITECT/PLANNER → Multiple Agents → AUDITOR
├── New system → SCANNER → ARCHITECT → PLANNER → WORKER → AUDITOR
├── Major refactor → SCANNER → ARCHITECT → REFACTOR → WORKER → AUDITOR
└── System integration → SCANNER → PLANNER → WORKER → PRD WRITER → AUDITOR
```

#### Enterprise (Multiple systems, 1000+ lines)
```
Full ULTRATHINK Process:
SCANNER → ARCHITECT → PLANNER → [WORKER + REFACTOR] → PRD WRITER → AUDITOR
```

### By Domain

#### Web Development
- **Frontend UI**: SCANNER → WORKER
- **Backend API**: SCANNER → ARCHITECT → WORKER
- **Full-stack**: SCANNER → PLANNER → WORKER → AUDITOR
- **Performance**: SCANNER → REFACTOR → AUDITOR

#### Data Science
- **Data analysis**: SCANNER → WORKER
- **ML pipeline**: SCANNER → ARCHITECT → WORKER
- **Data documentation**: PRD WRITER
- **Model optimization**: REFACTOR → AUDITOR

#### DevOps
- **Infrastructure**: SCANNER → ARCHITECT → WORKER
- **CI/CD**: SCANNER → PLANNER → WORKER
- **Monitoring**: WORKER → PRD WRITER
- **Security audit**: SCANNER → AUDITOR

#### System Architecture
- **Design**: ARCHITECT → PRD WRITER
- **Migration**: SCANNER → ARCHITECT → PLANNER → WORKER
- **Integration**: SCANNER → PLANNER → WORKER → AUDITOR
- **Optimization**: SCANNER → REFACTOR → AUDITOR

### By Team Size

#### Solo Developer
- **Quick tasks**: Direct to agent (skip SCANNER)
- **Complex tasks**: SCANNER → Primary agent
- **Critical tasks**: Add AUDITOR for verification

#### Small Team (2-5 developers)
- **Standard flow**: SCANNER → PLANNER → WORKER → AUDITOR
- **Parallel work**: PLANNER creates multiple tasks for WORKER
- **Documentation**: Always include PRD WRITER for team alignment

#### Large Team (5+ developers)
- **Full process**: All agents as needed
- **Architecture phase**: Always include ARCHITECT
- **Documentation**: PRD WRITER → Multiple WORKER agents → AUDITOR
- **Code organization**: Regular REFACTOR agent usage

#### Enterprise
- **Governance required**: SCANNER → ARCHITECT → PRD WRITER → PLANNER → WORKER → AUDITOR
- **Multiple systems**: Multiple parallel agent chains
- **Risk management**: AUDITOR at every major milestone

---

## WHEN NOT TO USE - ANTI-PATTERNS

### SCANNER Anti-patterns
**Don't use SCANNER when:**
- ❌ Simple, well-understood tasks
- ❌ Creating entirely new projects from scratch
- ❌ Quick bug fixes in familiar code
- ❌ Emergency/hotfix situations

**Instead:** Go directly to WORKER for simple implementations

### PLANNER Anti-patterns  
**Don't use PLANNER when:**
- ❌ Single-step tasks
- ❌ Well-defined, straightforward work
- ❌ Emergency fixes
- ❌ Simple documentation updates

**Instead:** Use WORKER for direct implementation

### WORKER Anti-patterns
**Don't use WORKER when:**
- ❌ Complex architectural decisions needed
- ❌ Requirements are unclear
- ❌ Large files need refactoring (>500 lines)
- ❌ System design is needed

**Instead:** Use ARCHITECT for design, PLANNER for strategy, REFACTOR for organization

### ARCHITECT Anti-patterns
**Don't use ARCHITECT when:**
- ❌ Simple implementations
- ❌ Small bug fixes
- ❌ Well-established patterns
- ❌ Quick prototypes

**Instead:** Use WORKER for straightforward implementation

### PRD WRITER Anti-patterns
**Don't use PRD WRITER when:**
- ❌ Technical documentation (code comments)
- ❌ Implementation details
- ❌ Internal team processes
- ❌ Quick updates to existing docs

**Instead:** Use WORKER for technical docs, direct editing for updates

### REFACTOR Anti-patterns
**Don't use REFACTOR when:**
- ❌ Files under 200 lines (unless truly complex)
- ❌ New greenfield development
- ❌ Simple cleanup tasks
- ❌ Emergency fixes

**Instead:** Use WORKER for small cleanups and new development

### AUDITOR Anti-patterns
**Don't use AUDITOR when:**
- ❌ Obviously incomplete work
- ❌ Work still in progress
- ❌ Simple, low-risk tasks
- ❌ Internal team testing

**Instead:** Complete the work first, use AUDITOR for final verification only

---

## QUICK REFERENCE CARDS

### 1-Minute Agent Selection Flowchart

```
START: What do you need?

UNDERSTAND something → SCANNER
PLAN something → PLANNER  
BUILD something → WORKER
DESIGN something → ARCHITECT
DOCUMENT something → PRD WRITER
ORGANIZE code → REFACTOR
VERIFY something → AUDITOR

Complex task? Add SCANNER first
Critical task? Add AUDITOR last
```

### Quick Decision Matrix

| Task Type | Simple | Moderate | Complex | Enterprise |
|-----------|--------|----------|---------|------------|
| **Bug Fix** | WORKER | SCANNER→WORKER | SCANNER→WORKER→AUDITOR | SCANNER→PLANNER→WORKER→AUDITOR |
| **New Feature** | WORKER | SCANNER→WORKER→AUDITOR | SCANNER→PLANNER→WORKER→AUDITOR | SCANNER→ARCHITECT→PLANNER→WORKER→AUDITOR |
| **Refactoring** | REFACTOR | SCANNER→REFACTOR | SCANNER→REFACTOR→AUDITOR | SCANNER→ARCHITECT→REFACTOR→AUDITOR |
| **Documentation** | PRD WRITER | SCANNER→PRD WRITER | SCANNER→PRD WRITER→AUDITOR | SCANNER→PRD WRITER→AUDITOR |
| **Architecture** | ARCHITECT | SCANNER→ARCHITECT→WORKER | SCANNER→ARCHITECT→PLANNER→WORKER | Full ULTRATHINK |

### Common Scenario Shortcuts

#### "I need to fix a bug"
- **Known issue**: WORKER
- **Complex issue**: SCANNER → WORKER
- **Critical issue**: SCANNER → WORKER → AUDITOR

#### "I want to add a feature"  
- **Simple feature**: WORKER
- **Medium feature**: SCANNER → PLANNER → WORKER
- **Major feature**: SCANNER → ARCHITECT → PLANNER → WORKER → AUDITOR

#### "My code is messy"
- **Small file**: WORKER (for cleanup)
- **Large file**: REFACTOR
- **Entire system**: SCANNER → ARCHITECT → REFACTOR

#### "I need documentation"
- **User docs**: PRD WRITER
- **Technical docs**: WORKER
- **Requirements**: PRD WRITER
- **Architecture docs**: ARCHITECT → PRD WRITER

### Emergency/Urgent Task Patterns

#### Hotfix Pattern
```
Problem → WORKER (direct fix) → AUDITOR (quick verify)
Skip: SCANNER, PLANNER (save time)
```

#### Production Issue Pattern
```  
Issue → SCANNER (quick analysis) → WORKER (fix) → AUDITOR (verify)
Skip: PLANNER, ARCHITECT (too slow)
```

#### Quick Prototype Pattern
```
Idea → WORKER (build MVP) → PRD WRITER (document)
Skip: SCANNER, ARCHITECT (premature optimization)
```

---

## AGENT CHAINS FOR COMMON PATTERNS

### The "Greenfield Project" Chain
```
PRD WRITER → ARCHITECT → PLANNER → WORKER → AUDITOR
```

### The "Legacy Integration" Chain  
```
SCANNER → ARCHITECT → PLANNER → WORKER → REFACTOR → AUDITOR
```

### The "Performance Optimization" Chain
```
SCANNER → REFACTOR → WORKER → AUDITOR
```

### The "Documentation Overhaul" Chain
```
SCANNER → PRD WRITER → AUDITOR
```

### The "Major Refactoring" Chain
```
SCANNER → ARCHITECT → REFACTOR → WORKER → AUDITOR
```

---

## KEY PRINCIPLES FOR AGENT SELECTION

1. **SLON First** - Don't over-engineer simple tasks
2. **Context Matters** - Unknown systems need SCANNER first
3. **Right Tool, Right Job** - Match agent expertise to task type
4. **Quality Gates** - Use AUDITOR for critical/complex work
5. **Iterative Approach** - Start simple, add complexity only if needed

**Remember**: It's better to use one agent well than to use multiple agents poorly. When in doubt, start with SCANNER to understand the landscape, then choose your primary agent.
# Claude Code Setup Guide

A practical guide for setting up Claude Code and achieving 80-90% success rate on development tasks.

## Quick Start

### Step 1: Create CLAUDE.md

Copy `CLAUDE_TEMPLATE_EN.md` to your project root as `CLAUDE.md`, then run:

```
Fill in all placeholders in @CLAUDE.md to match my project. Follow KISS, Occam's razor, DRY, YAGNI principles.
```

### Step 2: Create PROJECT_STRUCTURE.md

Use `PROJECT_STRUCTURE_TEMPLATE_EN.md` as base:

```
Analyze my project structure and create PROJECT_STRUCTURE.md based on PROJECT_STRUCTURE_TEMPLATE_EN.md template.

1. Study file structure - use ls, tree commands
2. Analyze configs - package.json, tsconfig.json, webpack.config.js
3. Determine architecture - main modules, components, entry points
4. Find dependencies - from package.json
5. Study commands - scripts from package.json
6. Identify unique features

Follow KISS, DRY, YAGNI - remove non-applicable sections.
```

### Step 3: Configure Agents

Place agent files from `/agents/` folder in your Claude config directory (`~/.claude/agents/` on macOS).

---

## CLAUDE.md Best Practices

### Essential Sections

| Section | Purpose | Example |
|---------|---------|---------|
| **Project Stack** | Tech overview | React 18, TypeScript, Redux |
| **Architecture** | Key patterns | Module Federation, Microservices |
| **Commands** | Dev workflows | `npm start`, `npm test` |
| **Code Standards** | Quality rules | No `any`, strict typing |
| **Constraints** | What to avoid | No console.log in prod |

### Keep It Effective

**DO:**
- Keep under 500 lines
- Update when architecture changes
- Include actual command examples
- List critical constraints

**DON'T:**
- Document every file
- Include stale information
- Over-explain obvious patterns
- Duplicate package.json content

### Maintenance

Claude Code may ignore CLAUDE.md as context grows. When behavior becomes erratic:
1. Start new chat session
2. Reference CLAUDE.md explicitly in complex prompts
3. Keep file focused and current

---

## Task Classification

### Simple Tasks (1-2 steps)
Processing similar files, minor edits, text changes, docs fixes.

**Approach:** Direct prompt, no agents needed.

### Medium Tasks (3-5 steps)
New features, known bug fixes, feature additions.

**Approach:** Use workflow flows below.

### Complex Tasks (5+ steps)
Large features, multi-component changes, architecture work.

**Approach:** Break into stages, use PRD → Scanner → Planner → Worker → Auditor flow.

---

## Workflow Selection

### Standard Flow (Most Common)
```
Scanner → Planner → Worker
```

Prompt addition: `"First, use scanner to gather information and then use planner to make a plan"`

### Plan Mode Flow (More Control)
```
Scanner → Plan Mode → Worker
```

Prompt addition: `"First, use scanner to gather information, then create a plan with to-do for all workers"`

### Token-Efficient Flow
```
Scanner (Sonnet) → Planner (Opus) → Worker (Sonnet)
```

Use when context length is a concern.

### ULTRATHINK (Complex Projects)
```
Multiple Scanners (parallel) → Single Planner → Multiple Workers (parallel) → Auditor
```

Use for large-scale refactoring or multi-component features.

---

## Agent Reference

| Agent | Model | Use Case |
|-------|-------|----------|
| **Scanner** | Sonnet | Gather info, find files, research |
| **Architect** | Sonnet | Design, evaluate architecture |
| **Planner** | Opus | Strategic planning, task breakdown |
| **PRD Writer** | Sonnet | Requirements documentation |
| **Worker** | Opus | Implementation, code execution |
| **Refactor** | Sonnet | Modularize files >500 lines |
| **Auditor** | Sonnet | Verify, test, quality check |

---

## Prompt Patterns

### Bug Fix
```
ULTRATHINK

@path/to/component.tsx
@path/to/related-file.tsx

In {ComponentName}, the {Feature} is not working. Currently:
1. [Actual behavior]
2. [Expected behavior]

Need to fix so that [desired outcome].
```

### New Feature
```
Create a plan for implementing [feature]:

Stage 1:
1. [Step 1]
2. [Step 2]

Stage 2:
3. [Step 3]
4. [Step 4]

First use scanner to gather information, then create a detailed plan.
```

### Large Task (PRD Approach)
1. Describe requirements in detail
2. Ask PRD Writer to create `prd.md`
3. Execute stages sequentially with Scanner → Planner → Worker → Auditor

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Agent ignores CLAUDE.md | Start new session, reference explicitly |
| Wrong files modified | Be specific with @file references |
| Incomplete implementation | Break into smaller tasks |
| Context overflow | Use token-efficient flow |
| Erratic behavior | Check CLAUDE.md freshness, restart session |

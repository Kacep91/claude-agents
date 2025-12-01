# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Claude Agents Collection is a set of specialized Claude AI agent configurations designed for software development workflows. Each agent serves a distinct role following SLON principles (Simplicity, Lean, One thing, No over-engineering), KISS, and Occam's razor.

## Repository Structure

```
/agents/              # Agent configuration files (.md with YAML frontmatter)
/guide/               # Setup guides and templates
  CLAUDE_CODE_GUIDE.md       # Usage guide for workflows
  CLAUDE_TEMPLATE_EN.md      # Template for project CLAUDE.md files
  PROJECT_STRUCTURE_TEMPLATE_EN.md  # Template for PROJECT_STRUCTURE.md
DECISION_TREES.md     # Agent selection flowcharts and decision matrices
```

## Agent Configurations

Agent files use YAML frontmatter with:
- `name`: Agent identifier
- `description`: When/how to use the agent (shown in agent selection)
- `model`: `sonnet`, `opus`, or `haiku`
- `tools`: Comma-separated list of allowed tools
- `color`: UI color identifier

**Core Agents:**
- **Scanner** (Sonnet): Information gathering, codebase reconnaissance
- **Architect** (Sonnet): System design, architecture evaluation
- **Project Planner** (Opus): Strategic planning, limited to 5 tools (Read, LS, Grep, Glob, TodoWrite)
- **PRD Writer** (Sonnet): Product requirements documentation
- **Worker** (Opus): Implementation and code execution
- **Refactor** (Sonnet): Code modularization (trigger when files >500 lines)
- **Auditor** (Sonnet): Verification and quality assurance

## Workflow Patterns

### Task Complexity Classification:
1. **Simple (1-2 steps)**: Go directly to primary agent
2. **Medium (3-5 steps)**: Scanner → Primary agent → Auditor
3. **Complex (5+ steps)**: Scanner → Architect/Planner → Worker → Auditor

### Token-Efficient Flow:
Scanner (Sonnet) → Project-Planner (Opus) → Worker (Sonnet)

### Maximum Capability Flow:
Scanner → Plan Mode → Worker

### ULTRATHINK (for complex projects):
1. Deploy multiple Scanner agents in parallel
2. Single Project-Planner for comprehensive planning
3. Deploy multiple Worker agents for execution
4. Run Auditor for final verification

## Key Principles Applied Across Agents

- **SLON**: Simplicity, Lean, One thing, No over-engineering
- **KISS**: "As simple as possible, but not simpler than necessary"
- **Occam's Razor**: Every abstraction must justify its existence
- **DRY**: Extract shared logic, avoid repetition
- **Root Cause Focus**: Fix fundamental problems, not symptoms

## CLI Preferences (for agent prompts)

Agents prefer single CLI commands over multiple tool calls:
```bash
rg -n "pattern" --glob '!node_modules/*'  # Pattern search
fd filename directory                       # File finding
tree -L 2 directories                       # Quick structure overview
```

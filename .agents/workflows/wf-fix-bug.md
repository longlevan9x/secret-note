---
name: WF - Fix Bug
description: Analyze root cause and fix bugs systematically
---

# Workflow: Fix Bug

## Phase 1: Analysis & Reproduction
- Ask the User for error logs, screenshots, or reproduction steps (if information is unclear).
- Read the files directly related to the error message.
- Identify the root cause of the bug. Do not guess — base conclusions on actual code logic.

## Phase 2: Plan the Fix
- Propose a concise fix strategy.
- If the bug is complex and spans multiple files, create an `IMPLEMENTATION_PLAN.md` to get User approval before modifying code.
- If the bug is simple (e.g., typo, null reference), proceed with the fix immediately.

## Phase 3: Implementation
- Use file editing tools to apply the code fix.
- Strictly follow the project's existing code style. Do not reformat unrelated code sections.

## Phase 4: Verification
- // turbo
- Run `npm run build` or `npm run lint` to verify the fix does not accidentally introduce syntax errors or break other parts.
- Report the changes to the User and guide them to verify on the UI.

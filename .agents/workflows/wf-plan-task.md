---
name: WF - Plan Task
description: Comprehensive analysis and implementation planning for a new Task/Feature
---

# Workflow: Plan Task

## Phase 1: Requirement Analysis
- Read and thoroughly analyze the User's requirements.
- Ask clarifying questions if any details are unclear (e.g., Who is the target audience? What are the inputs/outputs?).
- Identify the impact of this Task on the existing system.

## Phase 2: Current State Research
- Use `grep_search` or file-reading tools to scan the source code.
- Search for existing files, Components, APIs, or Utils with similar functionality to **reuse**, avoiding redundant code.
- Reference `AGENTS.md` (or rule files) to ensure the solution does not violate project principles.

## Phase 3: Implementation Plan
- Create an Artifact: `IMPLEMENTATION_PLAN.md`.
- The plan must be clearly structured:
  - **Objective**: Brief summary.
  - **Open Questions**: Issues that require User decisions (Should we use Library A or B? Where should the UI be placed?).
  - **Proposed Changes**: Grouped by directory, clearly marking files as `[NEW]`, `[MODIFY]`, or `[DELETE]`.
  - **Verification Plan**: How to test and confirm the code works correctly.

## Phase 4: Save to Backlog
- Automatically read and update the `plan.md` file at the project root.
- Add the analyzed Task to the work list as a Checklist item (e.g., `- [ ] Task Name - with path or plan summary`).

## Phase 5: Approval
- STOP all execution.
- Ask the User to review the plan and wait for their decision (Approve / Reject / Comment).
- **NEVER** create new code files or modify source code before receiving User approval on the plan.

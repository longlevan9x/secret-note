---
name: phase-workflow
description: Manage the Secret Note repo's implementation phases from `docs/phases/`. Use when the user asks to start a numbered phase, execute a phase checklist, break a phase into smaller tasks, review a phase technically, track progress against a phase file, or continue work from any `docs/phases/*.md` plan in this repository.
---

# Phase Workflow

## Overview

Use this skill to turn the repo's phase documents into concrete execution steps.
Work from `docs/phases/README.md` and the matching `docs/phases/phase-*.md` file, then plan, implement, review, or track the requested phase.

## Phase Lookup

Read `docs/phases/README.md` first when the user references phases loosely.
Open the matching phase file when the user names a specific phase.

Default mapping:

- `phase 01` -> `docs/phases/phase-01-foundation-state-and-schema.md`
- `phase 02` -> `docs/phases/phase-02-service-detail-and-project-flow.md`
- `phase 03` -> `docs/phases/phase-03-backup-import-export-and-workspace-safety.md`
- `phase 04` -> `docs/phases/phase-04-search-filter-and-navigation.md`
- `phase 05` -> `docs/phases/phase-05-secret-health-and-security-hardening.md`
- `phase 06` -> `docs/phases/phase-06-storage-settings-and-github-sync.md`
- `phase 07` -> `docs/phases/phase-07-graph-polish-and-impact-analysis.md`
- `phase 08` -> `docs/phases/phase-08-qa-polish-and-release-readiness.md`

Use `docs/product-roadmap-and-technical-review.md` only when broader product or architecture context is needed.

## Request Modes

Choose the lightest mode that satisfies the user request.

### Start or execute a phase

Read the target phase file.
Inspect the relevant code before proposing changes.
Implement directly unless the user clearly asks for planning only.
Use the phase's suggested files and definition of done as guardrails, not as hard limits.

### Break a phase into smaller tasks

Convert the phase into small, ordered tasks that can be finished in one sitting.
Prefer tasks that are 30-120 minutes each.
Group tasks by dependency order:

- foundation
- implementation
- verification
- cleanup

### Review a phase technically

Compare the phase file against the current codebase.
Prioritize:

- missing prerequisites
- architecture conflicts
- risky sequencing
- hidden migration costs
- testing gaps

When asked for a review, lead with findings and risks before giving summaries.

### Track progress on a phase

Measure the current codebase against:

- scope
- task list
- suggested files
- definition of done

State clearly what is done, in progress, blocked, or not started.

## Execution Rules

Read the relevant code before editing.
Prefer implementing one phase at a time.
Keep changes aligned with `AGENTS.md`, especially the Next.js warning and the UI interaction rules.
Before coding against unfamiliar or changed Next.js behavior, read the relevant guide in `node_modules/next/dist/docs/` as required by `AGENTS.md`.
Do not assume the phase document is fully correct; reconcile it with the current codebase first.
If the user asks to "do phase X", execute the highest-value slice that fits the phase and current repo state instead of only restating the checklist.

## Output Patterns

For planning:

- restate the phase goal
- list ordered tasks
- call out dependencies and risks

For implementation:

- summarize what was changed
- note what remains from the phase
- mention verification run or blockers

For review:

- list findings first
- include file references when relevant
- keep summaries brief

## Example Triggers

- `bat dau phase 01`
- `trien khai phase 02`
- `chia nho phase 03 thanh task`
- `review ky thuat phase 05`
- `kiem tra phase 06 da san sang chua`

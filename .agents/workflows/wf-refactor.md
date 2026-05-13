---
name: WF - Refactor
description: Refactor code to reduce technical debt and improve readability
---

# Workflow: Refactor Code

## Phase 1: Analysis
- Read the file to be refactored carefully and fully understand its current functionality.
- Identify issues: Logic too long? UI component holding too much state? Code duplication? Overly complex component?

## Phase 2: Planning
- Plan the decomposition: How should the large file be split into smaller files?
- Which custom hooks need to be created for logic extraction? Which utilities should be separated?
- Wait for User to Approve the plan before making changes.

## Phase 3: Execution
- Cut/paste and adjust code according to the plan.
- Ensure all core Business Logic remains unchanged.

## Phase 4: Verification
- // turbo
- Run `npm run lint` and `npm run build` to ensure no imports are broken or syntax errors introduced.

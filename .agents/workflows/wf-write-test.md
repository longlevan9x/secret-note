---
name: WF - Write Test
description: Initialize and write automated Unit Tests for a File/Component
---

# Workflow: Write Test

## Phase 1: Research
- Read the source code file that needs tests.
- Analyze the functions, logic branches (if/else), and states that need to be covered.

## Phase 2: Create Test File
- Create a file with the same name plus a `.test.ts` or `.test.tsx` suffix.
- Set up the test environment (Mocks, Spies if external libraries are used).

## Phase 3: Implement Test Cases
- Write test cases from basic (Happy path) to advanced (Edge cases, Error handling).
- Ensure test cases are clear, using well-structured `describe` and `it` blocks.

## Phase 4: Confirmation
- Report the list of test scenarios written so the User can assess the coverage level.

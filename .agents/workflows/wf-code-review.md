---
name: WF - Code Review
description: Code review process — inspect, review, and suggest improvements
---

# Workflow: Code Review

## Phase 1: Overview Analysis
- Use file-reading tools to inspect the content of the file/component under review.
- Examine related files or parent/child components to fully understand the operating context.

## Phase 2: Standards Checklist
When reviewing, evaluate against the following criteria:
- **Project Rules Compliance**: Read and strictly apply rules from `.agents/rules/` (especially `rule-no-hardcode.md`). Ensure no text strings or configuration values are hardcoded. Everything must be extracted into Constants.
- **UI/UX & Interface**: Per project rules (`AGENTS.md`), do all interactive elements (buttons, links) have `hover` effects, `transition`, and `cursor: pointer`? Does the interface display well on mobile?
- **Performance**: Are React Components re-rendering unnecessarily? Is state management efficient?
- **Security & Data**: If the code calls APIs or a Database, is error handling comprehensive? Is there any risk of leaking sensitive data?
- **Clean Code**: Are variable/function names clear and readable? Is the logic overly complex and in need of refactoring?

## Phase 3: Review Report
- Present a clear Review Report to the User.
- Use Diff Markdown format to show specifically: Old code -> Proposed new code.
- Briefly explain why each change is recommended.
- Wait for User feedback on whether they want the AI to automatically apply the proposed changes.

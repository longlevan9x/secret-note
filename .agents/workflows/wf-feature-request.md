---
name: WF - Feature Request
description: Develop a new feature from planning to verification
---

# Workflow: Feature Request

## Phase 1: Research
- Scan related files using `grep` or `ls` commands.
- Check `.agents/rules/` files to understand the project's coding style.

## Phase 2: Planning (Mandatory)
- Create an Artifact named `IMPLEMENTATION_PLAN.md`.
- List all files that will be created or modified.
- Describe the data processing and security logic.
- Wait for User to click "Approve".

## Phase 3: Implementation
- Write clean code with comments.
- If TypeScript errors exist, they must be fully resolved before reporting completion.

## Phase 4: Verification
- Run `npm run build` to ensure no build errors.
- Use Browser Tool to perform basic UI/UX testing.
- Take a screenshot of the results and send to the User.
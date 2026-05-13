---
name: WF - Deploy Prep
description: Comprehensive pre-deployment checklist before pushing code to Production/Vercel
---

# Workflow: Deploy Preparation (Pre-commit)

## Phase 1: Preparation
- Ensure all files have been saved and fully processed.

## Phase 2: Automated Checks
- // turbo-all
- Run `npm run lint` to check code standards. (Attempt to automatically find and fix syntax errors if any.)
- Run `npx tsc --noEmit` to catch all hidden TypeScript errors in the project.
- Run `npm run build` to ensure Next.js can successfully build a Production bundle.

## Phase 3: Report
- If all commands above pass successfully (Exit code 0), notify the User: "The project is ready to Deploy / Commit!"
- If errors occur, report the details and automatically propose a Fix Bug plan.

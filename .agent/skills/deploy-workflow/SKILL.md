---
name: Deploy Workflow
description: Quy trình kiểm tra code và chuẩn bị để deploy lên Vercel/Production.
triggers:
  - deploy
  - check-release
---

# Skill: Deploy Workflow

This skill ensures the project is ready for production deployment by running essential checks.

## Instructions for the Assistant

1. **Build Check**:
   - Run `npm run build` to ensure there are no compilation errors.
2. **Lint Check**:
   - Run `npm run lint` to check for code quality issues.
3. **Environment Check**:
   - Verify that all required environment variables for the selected storage adapter are present.
4. **Summary**:
   - Report any errors or warnings found.
   - If everything passes, confirm the project is "Ready for Deploy".

---
name: Analyze Project
description: Phân tích cấu trúc source code và đưa ra lộ trình phát triển tiếp theo.
triggers:
  - analyze
  - roadmap
---

# Skill: Project Analysis & Feature Roadmap

This skill is designed to analyze the current state of the "Secret Note" project and provide actionable recommendations for the next features or improvements.

## Instructions for the Assistant

When this skill is invoked, follow these steps systematically:

1.  **Analyze Project Structure**:
    - List the root directory and `src` directory to understand the layout.
    - Check `package.json` for dependencies and scripts.
    - Identify the core technology stack (Next.js, Tailwind, etc.).

2.  **Evaluate Progress against Plan**:
    - Read `plan.md` (or any existing roadmap files).
    - Map implemented files in `src/app` and `src/components` to the planned features.
    - Identify what is "Done", "In Progress", and "Pending".

3.  **Identify Technical Debt & UX Gaps**:
    - Look for "TODO" comments in the code.
    - Check if components follow the premium UI/UX rules (hover effects, transitions, cursors) defined in `AGENTS.md`.
    - Evaluate state management and data persistence patterns.

4.  **Generate Recommendations**:
    - Propose the next 3-5 high-priority features.
    - Suggest specific UI/UX enhancements to make the app feel "premium".
    - Highlight any architectural improvements needed.

5.  **Output Format**:
    - Provide a "Current Status" summary.
    - List "Completed Features".
    - Provide a "Recommended Next Steps" list with brief justifications for each.

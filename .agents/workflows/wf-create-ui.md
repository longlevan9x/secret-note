---
name: WF - Create UI
description: Initialize a standards-compliant UI Component for the project
---

# Workflow: Create UI Component

## Phase 1: Requirements
- Carefully read the UI requirements from the User.
- Strictly follow `AGENTS.md`: All buttons and interactive elements must have Hover effects, Transitions, and `cursor: pointer`.

## Phase 2: Build
- Use `class-variance-authority` (cva), `tailwind-merge`, and `clsx` to manage variants and merge classes.
- Support Dark Mode properly (using Tailwind's `dark:` prefixes).
- Ensure Responsive design, starting with a Mobile-first approach.

## Phase 3: Finalize
- Export the Component correctly.
- Ensure clean code with strict TypeScript Interface/Props definitions.

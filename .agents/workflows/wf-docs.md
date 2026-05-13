---
name: WF - Docs
description: Read code and auto-generate explanatory documentation and diagrams
---

# Workflow: Generate Documentation

## Phase 1: Data Flow Analysis
- Read the directories/files specified by the User.
- Trace the data flow from UI -> Logic (Hooks/Utils) -> API -> Database.

## Phase 2: Output Documentation
- Analyze and report findings.
- MUST draw a `mermaid` diagram illustrating the structure or data flow for easy User visualization.
- Clearly explain the purpose of each important function/module.

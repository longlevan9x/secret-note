# Phase 02: Service Detail and Project Flow

## Objective

Break down the biggest UI logic areas into smaller maintainable pieces.

## Why This Phase Matters

`ServiceDetail` and `ProjectList` currently hold too much business logic. These files will become the main bottleneck for maintenance and new features if they stay as they are.

## Scope

- split large UI components
- move mutation logic into workspace actions
- simplify project and service interaction flow

## Main Tasks

### 1. Refactor `ServiceDetail`

Split into smaller components such as:

- `ServiceHeader`
- `ServiceMetadataForm`
- `SecretsTable`
- `SecretEditor`
- `DependencySelector`

### 2. Extract service utilities

Move reusable logic out of the component:

- `.env` import parsing
- `.env` export generation
- secret update helpers
- dependency helpers

### 3. Refactor `ProjectList`

- stop mutating workspace snapshots directly in the component
- remove hidden global selection event if possible
- simplify project/service selection flow

### 4. Clean up dead or duplicate logic

- remove duplicated delete/update logic
- remove unused imports
- reduce inline mutation code inside JSX

## Suggested Files To Touch

- `src/components/dashboard/ServiceDetail.tsx`
- `src/components/dashboard/ProjectList.tsx`
- `src/components/dashboard/ProjectItem.tsx`
- new files under `src/components/dashboard`
- new utility files under `src/core` or `src/components/dashboard`

## Definition of Done

- `ServiceDetail` is split into smaller components
- mutation logic comes from workspace actions
- project/service selection is easier to follow
- duplicate logic is removed

## Risks and Notes

- Keep UI behavior familiar to avoid accidental regressions
- This phase is about maintainability, not redesign


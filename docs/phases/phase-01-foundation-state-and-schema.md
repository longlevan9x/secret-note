# Phase 01: Foundation, State, and Schema

## Objective

Create a stable core architecture for workspace data before adding more product features.

## Why This Phase Comes First

The current app updates full workspace snapshots directly inside UI components. That is workable for a demo, but it will slow down every future feature:

- backup and restore
- sync
- settings
- search
- security upgrades

## Scope

- refactor workspace state flow
- centralize workspace actions
- prepare schema for future growth
- remove fragile ID generation

## Main Tasks

### 1. Refactor workspace state layer

- Turn `WorkspaceContext` into a real state manager
- Add action functions instead of only `updateWorkspaceData`
- Keep persistence logic behind the context or a small store layer

Suggested actions:

- `addProject`
- `removeProject`
- `addService`
- `updateService`
- `removeService`
- `upsertSecret`
- `deleteSecret`
- `toggleDependency`
- `updateSettings`

### 2. Introduce status state

Add state such as:

- `isLoading`
- `isSaving`
- `isSyncing`
- `error`

### 3. Improve schema structure

Update `WorkspaceData` and related types so they can support:

- storage settings
- sync metadata
- future encrypted payload metadata
- health metadata

### 4. Replace `Date.now()` IDs

- Use `crypto.randomUUID()` for project and service IDs

## Suggested Files To Touch

- `src/context/WorkspaceContext.tsx`
- `src/core/schema/types.ts`
- `src/core/constants/app.ts`
- any new helpers under `src/core` or `src/context`

## Definition of Done

- UI no longer manually rebuilds large workspace snapshots everywhere
- Workspace actions exist and are reusable
- IDs are UUID-based
- Schema is ready for storage and security growth
- Existing app behavior still works

## Risks and Notes

- Keep this phase focused on architecture, not feature expansion
- Avoid implementing GitHub sync here
- Avoid doing crypto migration in this phase


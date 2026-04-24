# Phase 06: Storage Settings and GitHub Sync

## Objective

Make storage abstraction real by connecting settings to behavior and shipping remote sync v1.

## Why This Phase Matters

The codebase already suggests a storage-agnostic architecture, but users cannot benefit from it yet. This phase closes that product gap.

## Scope

- real settings persistence
- adapter selection
- GitHub sync v1
- sync status visibility

## Main Tasks

### 1. Upgrade storage interface

Expand storage capabilities:

- `load`
- `save`
- `sync`
- `testConnection`
- `getStatus`

### 2. Real settings page

- save selected backend settings
- show current storage backend
- show sync status
- disable unfinished options clearly

### 3. Implement GitHub adapter

- load encrypted workspace from private repo
- save encrypted workspace to private repo
- handle missing config safely

### 4. Manual sync flow

- add explicit sync button
- show success and error states
- keep conflict handling simple in first version

## Suggested Files To Touch

- `src/core/interfaces/IStorage.ts`
- `src/core/adapters/LocalStorageAdapter.ts`
- `src/core/adapters/GitHubAdapter.ts`
- `src/components/dashboard/SettingsView.tsx`
- `src/context/WorkspaceContext.tsx`

## Definition of Done

- settings affect real storage behavior
- GitHub sync works manually for happy-path use
- sync state is visible to the user

## Risks and Notes

- Keep conflict resolution simple in v1
- Only implement after workspace state layer is stable


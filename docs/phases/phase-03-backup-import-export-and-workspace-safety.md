# Phase 03: Backup, Import/Export, and Workspace Safety

## Objective

Make the app safe to use with real data by giving users backup and restore controls.

## Why This Phase Matters

This is one of the highest-value product upgrades with relatively low complexity. It reduces fear of data loss and makes the app much more trustworthy.

## Scope

- full workspace export
- full workspace import
- validation before restore
- safer `.env` handling

## Main Tasks

### 1. Workspace export

- Export all workspace data to JSON
- Choose whether export is raw workspace format or wrapped in a versioned package

### 2. Workspace import

- Validate imported structure
- Handle version mismatch
- Show clear overwrite confirmation
- Reject malformed data safely

### 3. Reset workspace flow

- Add a clear reset action
- Require confirmation
- Consider offering auto-backup before reset

### 4. Improve `.env` handling

- Move `.env` import/export logic out of UI component
- Validate duplicate keys
- Handle comments, quotes, blank lines, and malformed entries more safely

## Suggested Files To Touch

- `src/components/dashboard/ServiceDetail.tsx`
- `src/components/dashboard/SettingsView.tsx`
- new backup/import utility files
- `src/core/schema/types.ts`

## Definition of Done

- User can export entire workspace
- User can import valid workspace safely
- Malformed imports are handled gracefully
- `.env` parsing is reusable and safer

## Risks and Notes

- Preserve backward compatibility for existing workspace data
- Keep user confirmation flows strong for destructive actions


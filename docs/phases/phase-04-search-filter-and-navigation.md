# Phase 04: Search, Filter, and Navigation

## Objective

Make the app usable when the workspace grows beyond a few services.

## Why This Phase Matters

Without search and filtering, the current UI will become hard to use once users store many services and secrets.

## Scope

- search
- filter
- navigation shortcuts
- command palette improvements

## Main Tasks

### 1. Global search

Support search by:

- project name
- service name
- provider
- environment
- secret key

### 2. Filters

Add filters for:

- environment
- provider
- project

### 3. Better selection and navigation

- improve service switching
- allow opening items quickly from search
- improve command palette usefulness

### 4. Prepare for saved views later

- keep state structure clean enough for future saved filters or tabs

## Suggested Files To Touch

- `src/components/layout/CommandPalette.tsx`
- `src/components/dashboard/ProjectList.tsx`
- `src/components/graph/DependencyGraph.tsx`
- `src/context/WorkspaceContext.tsx`
- new search/filter helpers

## Definition of Done

- User can quickly find a service without scrolling manually
- Filters work consistently in both list and graph where appropriate
- Search and filter state is easy to maintain

## Risks and Notes

- Keep the first version simple
- Avoid overbuilding full-text search infrastructure too early


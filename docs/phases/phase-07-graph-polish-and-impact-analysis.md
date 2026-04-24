# Phase 07: Graph Polish and Impact Analysis

## Objective

Turn the graph from a nice visualization into a more useful architecture tool.

## Why This Phase Matters

The graph is one of the clearest differentiators of the product. Strengthening it increases the product's identity.

## Scope

- cleaner graph architecture
- better filtering
- dependency impact visibility

## Main Tasks

### 1. Refactor graph data mapping

- extract workspace-to-graph transformation into a pure helper
- separate graph actions from render logic

### 2. Graph filtering

Support filtering by:

- project
- provider
- environment

### 3. Dependency impact mode

When selecting a service, make it easier to see:

- what it depends on
- what depends on it
- which project group it belongs to

### 4. Better graph UX

- clearer empty states
- clearer controls
- cleaner node and edge interactions

## Suggested Files To Touch

- `src/components/graph/DependencyGraph.tsx`
- `src/components/graph/ServiceGraphNode.tsx`
- `src/components/graph/ProjectGroupNode.tsx`
- `src/core/constants/graph.ts`
- new graph mapping helpers

## Definition of Done

- graph logic is easier to maintain
- filters work without messy component growth
- impact relationships are easier to understand

## Risks and Notes

- Keep graph responsiveness acceptable
- Do not overcomplicate with advanced auto-layout too early


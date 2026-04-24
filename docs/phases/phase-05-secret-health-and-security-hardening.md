# Phase 05: Secret Health and Security Hardening

## Objective

Improve trust in the product by making secret management more informative and more secure.

## Why This Phase Matters

Security is part of the product promise. Right now the app encrypts values, but the security design is still basic compared to the vision in the planning documents.

## Scope

- secret health indicators
- better crypto model
- clearer password and decrypt behavior

## Main Tasks

### 1. Secret health features

Add health signals for:

- empty secret values
- duplicate keys
- secrets with `ttlDays` nearing expiration
- secrets with stale `lastRotated`

### 2. Better encryption design

Move toward:

- structured encrypted payloads
- `salt`
- `iv`
- algorithm metadata
- payload versioning

### 3. Better decrypt failure handling

- distinguish between empty values and invalid decryption
- add clear unlock validation behavior

### 4. Master password handling review

- reduce reliance on `sessionStorage`
- decide whether convenience mode and strict mode should both exist

## Suggested Files To Touch

- `src/core/security/crypto.ts`
- `src/core/schema/types.ts`
- `src/context/WorkspaceContext.tsx`
- `src/components/dashboard/ServiceDetail.tsx`
- any health dashboard or badge components you add

## Definition of Done

- secret warnings are visible and useful
- crypto design is more future-proof
- incorrect password state is easier to reason about

## Risks and Notes

- This phase can introduce migrations
- Do not mix GitHub sync changes into the crypto migration unless necessary


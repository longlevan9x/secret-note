# Secret Note: Product Roadmap, Feature Matrix, and Technical Review

## 1. Product Direction

Secret Note is not just a note-taking app. Based on the current codebase, it is better positioned as a personal control plane for developers to manage:

- projects
- services
- secrets
- environment variables
- dependency relationships between services

The strongest product angle right now is:

**A local-first serverless ecosystem workspace for managing secrets and service architecture.**

This direction is stronger than a generic "secret vault" because the app already has:

- service templates
- dependency graph visualization
- per-service secrets and notes
- `.env` import/export

## 2. Current State Assessment

### What already works

- Project CRUD
- Service CRUD
- Secret CRUD
- Dependency graph with React Flow
- Local browser persistence
- Client-side encryption for secret values
- Provider templates for common services
- `.env` import/export per service

### What is still incomplete

- GitHub sync is still a stub
- Settings page is not connected to real storage logic
- State updates are repeated in many UI components
- Security model is still basic compared to the product vision
- No backup/restore for full workspace
- No search/filter
- No health or rotation management for secrets
- No revision history or conflict handling

### Main gap between vision and implementation

The vision in `plan.md` aims for a storage-agnostic, zero-knowledge, multi-backend workspace. The current implementation is still mostly a polished local-first demo with partial architecture for future expansion.

## 3. Product Roadmap

### Weeks 1-8

#### Week 1: Stabilize Core Data Flow

Goals:

- Introduce a real workspace action layer instead of direct snapshot replacement
- Standardize CRUD operations for project, service, secret, dependency
- Replace `Date.now()` IDs with `crypto.randomUUID()`
- Add schema migration flow tied to `WorkspaceData.version`

Expected outcome:

- Lower technical debt
- Easier feature development later
- Safer persistence and sync changes

#### Week 2: Backup and Restore

Goals:

- Export full workspace as JSON
- Import workspace with schema validation
- Add reset workspace flow with confirmation
- Move `.env` import/export logic into reusable utility layer

Expected outcome:

- Users can safely back up and restore data
- Product becomes much more trustworthy for real usage

#### Week 3: Search, Filter, and Command Palette

Goals:

- Search by project, service, provider, environment, secret key
- Filter by provider and environment
- Add quick actions in command palette

Expected outcome:

- Better usability when workspace grows
- Faster navigation and operations

#### Week 4: Secret Health Dashboard

Goals:

- Detect empty secrets
- Detect duplicate secret keys
- Show secrets that are stale or near rotation
- Support `ttlDays` and better `lastRotated` usage

Expected outcome:

- Product evolves from storage tool to management tool

#### Week 5: Security Hardening

Goals:

- Move from basic `crypto-js` AES usage to Web Crypto API
- Add `salt`, `iv`, `algorithm`, and payload versioning
- Stop relying on `sessionStorage` for master password by default
- Add proper unlock validation and decryption failure handling

Expected outcome:

- Security model becomes much closer to zero-knowledge vision

#### Week 6: Real Settings and Storage Management

Goals:

- Connect settings to real workspace state
- Allow selecting active storage backend
- Add connection test and storage status
- Show sync state and last sync metadata

Expected outcome:

- Settings page becomes useful instead of placeholder UI

#### Week 7: GitHub Sync v1

Goals:

- Implement `GitHubAdapter`
- Push and pull encrypted workspace file from private repository
- Add simple conflict resolution options
- Support manual sync before auto sync

Expected outcome:

- Users gain remote backup and multi-device continuity

#### Week 8: QA and Product Polish

Goals:

- Improve empty states, loading states, and error states
- Improve keyboard navigation and accessibility
- Add smoke tests around CRUD, import/export, and graph actions
- Reduce technical debt in the biggest UI files

Expected outcome:

- MVP is stable enough for broader real-world usage

### Month 3

- Shared services across multiple projects
- Dependency impact analysis
- Graph filtering by environment and provider
- Local revision history

### Month 4

- Stack-oriented templates such as SaaS app, AI app, auth stack
- Secret policy engine basics
- Bulk operations
- Cross-tab sync in local mode

### Month 5

- Team-ready foundation
- Read-only sharing mode
- Change history improvements
- Provider metadata sync

### Month 6

- Release candidate hardening
- Better conflict resolution
- Better test coverage
- Onboarding flow and product documentation

## 4. Feature Matrix

| Feature | MVP | v1 | v2 |
|---|---|---|---|
| Project CRUD | Yes | Polish | Bulk actions |
| Service CRUD | Yes | Better templates | Shared services |
| Secret CRUD | Yes | Validation + health | Rotation workflow |
| `.env` import/export | Yes | Diff and merge UX | Smart merge |
| Dependency graph | Yes | Filter + impact view | Architecture insights |
| Local storage | Yes | Stable backup/restore | Cross-tab sync |
| Workspace export/import | No | Yes | Encrypted package + preview |
| Search and filter | No | Yes | Saved views |
| Settings connected to real state | No | Yes | Multi-profile backends |
| GitHub sync | Stub | Yes | Auto sync + revision handling |
| Security hardening | Basic | Yes | Recovery and key rotation |
| Revision history | No | Basic | Full timeline |
| Secret health dashboard | No | Yes | Policy engine |
| Team collaboration | No | No | Yes |
| Provider integrations | No | Limited | Rich sync and validation |

## 5. Scope by Release

### MVP

- Project/service/secret CRUD
- `.env` import/export
- Dependency graph
- Local-first persistence
- Service templates

### v1

- Backup/restore workspace
- Search/filter
- Secret health
- Real settings
- Manual GitHub sync
- Security upgrades
- State and storage refactor

### v2

- Team mode
- Shared services
- Full revision history
- Provider API integrations
- Policy engine
- Auto sync and advanced conflict resolution

## 6. Deep Technical Review

### 6.1 Workspace State Layer

File:

- `src/context/WorkspaceContext.tsx`

Current issues:

- The context is only a thin load/save wrapper
- Storage adapter is hardcoded
- UI components are responsible for building full updated workspace snapshots
- Master password is stored in `sessionStorage`
- There is no action layer, no persistence status, no sync status

Why this matters:

- Feature complexity will grow too fast
- Sync and storage switching will become painful
- Bugs will likely appear because multiple components repeat update logic

Recommended refactor:

- Introduce workspace actions:
  - `addProject`
  - `removeProject`
  - `addService`
  - `updateService`
  - `removeService`
  - `upsertSecret`
  - `deleteSecret`
  - `toggleDependency`
  - `updateSettings`
- Add persistence state:
  - `isLoading`
  - `isSaving`
  - `isSyncing`
  - `error`
- Separate storage adapter creation from UI context

### 6.2 Service Detail Component

File:

- `src/components/dashboard/ServiceDetail.tsx`

Current issues:

- This component has too many responsibilities
- It mixes rendering, mutation logic, import/export, dependency editing, and metadata editing
- Workspace update logic is repeated many times
- There is dead or unused logic/imports
- Some updates happen inline in JSX, making maintenance harder

Why this matters:

- This file will become the biggest source of bugs and slowdowns
- Reuse is poor
- Testing individual behavior will be difficult

Recommended refactor:

- Split into:
  - `ServiceHeader`
  - `ServiceMetadataForm`
  - `SecretsTable`
  - `SecretEditor`
  - `DependencySelector`
  - `envImportExport.ts`
- Move mutations into workspace action layer
- Add validation helpers
- Add reusable secret parsing and export helpers

### 6.3 Project List

File:

- `src/components/dashboard/ProjectList.tsx`

Current issues:

- Full workspace snapshot manipulation happens directly in the component
- Selection uses a global window event
- IDs are generated with `Date.now()`

Why this matters:

- Harder to scale and reason about
- Hidden coupling through browser events
- ID generation is okay for demo, weak for long-term data consistency

Recommended refactor:

- Move selection state into store or route/query state
- Replace `Date.now()` with `crypto.randomUUID()`
- Use workspace actions for CRUD

### 6.4 Storage Layer

Files:

- `src/core/interfaces/IStorage.ts`
- `src/core/adapters/LocalStorageAdapter.ts`
- `src/core/adapters/GitHubAdapter.ts`

Current issues:

- `IStorage` is too small for the roadmap
- Storage key usage is not centralized
- Local storage implementation is basic
- GitHub adapter is still a stub

Why this matters:

- The product vision depends on storage abstraction actually being real

Recommended refactor:

- Expand storage interface to include:
  - `load`
  - `save`
  - `sync`
  - `testConnection`
  - `getStatus`
- Centralize storage keys under one config source
- Add `StorageManager` or adapter factory
- Implement GitHub sync only after workspace actions are stable

### 6.5 Security Module

File:

- `src/core/security/crypto.ts`

Current issues:

- Encryption API is too simple for a secret manager product
- There is no versioned encrypted payload
- Failed decryption returns empty string, which is ambiguous

Why this matters:

- Security trust is a core product promise
- Migration later will be harder if payload format stays underspecified

Recommended refactor:

- Use structured encrypted payload fields:
  - `version`
  - `algorithm`
  - `salt`
  - `iv`
  - `ciphertext`
- Separate:
  - `deriveKey`
  - `encryptValue`
  - `decryptValue`
  - `validateMasterPassword`
- Introduce migration for old encrypted values

### 6.6 Dependency Graph Layer

File:

- `src/components/graph/DependencyGraph.tsx`

Current issues:

- Graph rendering and workspace mutation are tightly coupled
- Mapping from workspace model to React Flow model is embedded in component logic
- Future filters and impact analysis will be harder to add cleanly

Why this matters:

- Graph is one of the strongest product differentiators
- This area should stay flexible for future expansion

Recommended refactor:

- Create pure mapper from workspace data to graph view model
- Create dedicated graph actions
- Prepare for graph filtering and impact mode

### 6.7 Settings Page

File:

- `src/components/dashboard/SettingsView.tsx`

Current issues:

- Local-only component state
- Placeholder save behavior
- UI can create false expectations about available sync capability

Recommended refactor:

- Connect settings to workspace state
- Show true backend status
- Disable or clearly mark unfinished features

### 6.8 Schema Design

File:

- `src/core/schema/types.ts`

Current issues:

- `Secret.value` is only a string, which is too weak for future encrypted payload needs
- `EncryptionMethod` is too loose
- No sync metadata or backend settings in persisted schema

Recommended refactor:

- Extend schema with:
  - storage settings
  - sync metadata
  - encrypted payload type
  - health metadata

## 7. Refactor Priority Order

Refactor in this order:

1. `src/context/WorkspaceContext.tsx`
2. `src/components/dashboard/ServiceDetail.tsx`
3. `src/components/dashboard/ProjectList.tsx`
4. `src/core/schema/types.ts`
5. `src/core/interfaces/IStorage.ts`
6. `src/core/adapters/LocalStorageAdapter.ts`
7. `src/core/security/crypto.ts`
8. `src/components/graph/DependencyGraph.tsx`
9. `src/components/dashboard/SettingsView.tsx`
10. `src/core/adapters/GitHubAdapter.ts`

## 8. Strategic Recommendation

The best positioning for this project is:

**A local-first developer workspace for managing secrets, environments, and service dependencies across a serverless stack.**

To get there, the most important next moves are:

1. stabilize the workspace state architecture
2. add full backup/restore
3. improve security model
4. implement search/filter
5. ship GitHub sync v1

That sequence gives the strongest balance of:

- user value
- technical leverage
- product credibility


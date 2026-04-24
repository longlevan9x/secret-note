# Phase 09: Advanced Templates & Ecosystem Expansion

## Objective
Diversify service types and optimize data entry using a robust template system.

## Why This Phase Matters
As the ecosystem grows, manually entering keys for every service becomes tedious. Templates ensure consistency and speed.

## Scope
- Pre-defined templates for major providers (AWS, GCP, Cloudflare, etc.).
- Custom template engine for user-defined services.
- Rich text (Markdown) support for service notes.
- Environment-specific branding (icons/colors).

## Main Tasks

### 1. Provider Templates
- Implement a template registry in `src/core/templates`.
- Create standard fields for:
  - **AWS:** Access Key ID, Secret Access Key, Region.
  - **Supabase:** Project URL, Anon Key, Service Role Key.
  - **GitHub:** Personal Access Token, Repo Owner.
  - **OpenAI:** API Key, Organization ID.

### 2. Custom Template Builder
- UI to define a new Service Type with custom fields.
- Field types: `password` (hidden), `text`, `select` (for regions/runtimes).

### 3. Rich Documentation
- Add a Markdown editor/previewer for the "Notes" section in `ServiceDetail`.
- Allow linking between services in the notes (using `@` mention style).

### 4. Visual Customization
- Add color pickers for Service Nodes in the Graph.
- Icon library integration for better visual identification.

## Definition of Done
- Users can create a service from a template in under 10 seconds.
- Graph nodes look distinct based on their service type/provider.
- Documentation for each service is clear and formatted.

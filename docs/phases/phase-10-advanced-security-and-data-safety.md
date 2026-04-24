# Phase 10: Advanced Security & Data Resilience

## Objective
Elevate security to enterprise standards and ensure absolute data portability and safety.

## Why This Phase Matters
Security is the core value proposition. Features like Multi-Vault and Self-Destruct provide peace of mind for high-stakes secrets.

## Scope
- Multi-Vault support (switching between different encrypted databases).
- Self-Destruct mechanism.
- Data export/import to standard password manager formats.
- Local-only Audit Logs.

## Main Tasks

### 1. Multi-Vault Architecture
- Update `StorageConfig` to support multiple profiles.
- UI for "Switch Vault" which triggers the Vault Lock screen for the new profile.
- Enable separate Master Passwords for different vaults.

### 2. Self-Destruct Mode
- Counter for failed password attempts in `WorkspaceContext`.
- Setting to enable "Self-Destruct" after N failed attempts.
- Logic to clear all local storage and reset the adapter (delete file on GitHub/Supabase if possible).

### 3. Cross-Platform Portability
- Export to `.csv` or `.json` compatible with Bitwarden/1Password.
- Import logic for major password manager exports.

### 4. Security Hardening
- Implement a "Privacy Shield": Blur the UI automatically when the tab is inactive or hidden.
- Session timeout customization in Settings.

## Definition of Done
- Failed password attempts are tracked and acted upon.
- Users can switch between a "Work" vault and a "Personal" vault.
- Data can be migrated out of the app into other industry-standard tools.

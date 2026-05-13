---
name: WF - Security Audit
description: Comprehensive security audit for a file or the entire project
---

# Workflow: Security Audit

## Phase 1: Vulnerability Scanning
- Inspect API Route files and Database operations: Are there risks of exposed API Keys or Secret Keys in the source code?
- Audit the Authentication flow: Can data be spoofed or tampered with?
- Inspect React Components: Are there XSS vulnerabilities from rendering content (e.g., misuse of `dangerouslySetInnerHTML`)?

## Phase 2: Remediation Proposals
- Compile a list of security issues found (rated by severity: Critical, Warning).
- Provide specific fix recommendations for each issue.

## Phase 3: Apply Fixes
- Wait for User to confirm the security plan.
- Apply changes to the source code carefully.

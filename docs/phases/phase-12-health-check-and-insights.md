# Phase 12: Health Check & Secret Insights

## Objective
Provide users with actionable intelligence about their secret hygiene and security posture.

## Why This Phase Matters
Storing secrets is only half the battle. Knowing which secrets are weak, reused, or potentially leaked is crucial for proactive security.

## Scope
- Password strength analyzer.
- Duplicate secret detection.
- Expiration tracking and notifications.
- Security Score Dashboard.

## Main Tasks

### 1. Strength & Entropy Analysis
- Implement a library (like zxcvbn) or custom logic to score password strength.
- Visual indicators (meters) in the `ServiceDetail` view.

### 2. Duplicate Detection
- Logic to scan all services and identify identical secret values (without decrypting more than necessary).
- Warning UI in the Dashboard to alert users about reuse.

### 3. Expiration Tracking
- Add an `expiresAt` field to the `Secret` schema.
- Background check (on load) to flag expired secrets.
- Integration with the browser notification API.

### 4. Insights Dashboard
- A new view showing "Security Score" (0-100).
- Recommendations like "You have 3 weak passwords" or "Update AWS keys (90 days old)".

## Definition of Done
- Users get immediate feedback on secret quality during entry.
- A central view provides a summary of all security risks in the workspace.

---
name: WF - Create API
description: Create a safe and standards-compliant API Route in Next.js App Router
---

# Workflow: Create API Route

## Phase 1: API Design
- Determine the appropriate HTTP Method (GET, POST, PUT, DELETE).
- Initialize the `route.ts` file following the correct App Router directory structure (e.g., `src/app/api/...`).

## Phase 2: Implementation
- ALWAYS wrap processing logic in a `try...catch` block to handle errors and prevent server crashes.
- Handle Authentication or Authorization checks at the very first lines of the API (if required).
- Return appropriate RESTful HTTP status codes (200 OK, 400 Bad Request, 401 Unauthorized, 500 Internal Server Error).

## Phase 3: Report
- Report the URL path of the newly created API to the User.
- Provide sample Payload (Body) or Query Params so the User can easily test via Postman or Frontend.

# Phase 13: Collaboration & Encrypted Sharing

## Objective
Enable secure sharing of secrets between users without compromising Zero-Knowledge principles.

## Why This Phase Matters
Teams need to share credentials. Traditional methods (Slack/Email) are insecure. This phase brings secure collaboration to Secret Note.

## Scope
- Public/Private key pair generation for users.
- One-time secret sharing (Burn on read).
- Shared Vaults (experimental).

## Main Tasks

### 1. Identity & Key Management
- Generate RSA/ECDSA key pairs upon Master Password setup.
- Store encrypted private key in the workspace; share public key via a "Profile" link.

### 2. Encrypted Secret Transfer
- "Share" button for a service.
- Encrypt the service data with the recipient's Public Key.
- Recipient can import the shared blob and decrypt it with their Private Key.

### 3. Burn-on-Read Links
- Create a temporary sharing mechanism using a unique URL hash.
- Data is stored in a temporary "transit" storage (e.g. Supabase) and deleted immediately after the first successful decryption.

## Definition of Done
- A user can securely send a secret to another user via a link.
- Only the intended recipient can decrypt the data.

---
name: Rule-No-Hardcode
description: "No Hardcode"
---

# Project Rule: No Hardcoding (Use Constants)

When writing, refactoring, or reviewing code in the **Secret Note** project, the Agent MUST distinguish between values that **require** constants and values that **do not**.

---

## ✅ MUST extract to Constants (`src/core/constants/`)

These are **configuration values, identifiers, and magic values** that affect application behavior or are reused across multiple files:

| Category | Examples |
|----------|----------|
| **API endpoints & URLs** | `"/api/data"`, `"/api/auth"` |
| **Storage / cache keys** | `"secret_note_master_pwd"`, `"vault_unlock_attempts_"` |
| **Algorithm & config values** | `"AES-256-GCM"`, `"fs"`, `"github"` |
| **Enum-like string lists** | `["Development", "Staging", "Production"]` |
| **Magic numbers** | Timeout durations, max retry counts, version numbers |
| **Database / storage keys** | `"vault:workspace_data.json"` |
| **Default values used in logic** | Default salt, default branch name, default paths |

**Why:** If any of these values change, you only need to update one place. They also serve as documentation for what the application depends on.

---

## ❌ DO NOT extract to Constants

These are **display-only strings** that have no impact on logic and are typically used in one place:

| Category | Examples |
|----------|----------|
| **Toast messages** | `"Vault Unlocked"`, `"Secret Saved"` |
| **UI labels & descriptions** | `"Enter your password"`, `"No projects yet"` |
| **Error descriptions for users** | `"Please try again."`, `"Failed to export."` |
| **Placeholder text** | `"Search..."`, `"Enter name..."` |
| **Console logs** | `console.error("Failed to fetch:", error)` |
| **Comments in code** | Self-explanatory |

**Why:** These strings are read-only, used in a single component, and extracting them adds indirection without any reuse benefit. Exception: If the same UI text appears in 3+ places, extract it.

---

## Rule of Thumb

> **Ask: "If I change this string, does the app break or behave differently?"**
> - **Yes** → Extract to Constant.
> - **No, it's just a label/message** → Leave inline.

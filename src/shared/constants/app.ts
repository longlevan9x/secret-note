export const APP_CONFIG = {
  NAME: "Secret Note",
  VERSION: "2.0",
  DRIVERS: {
    FS: "fs",
    JSON: "json",
    GITHUB: "github",
    SQLITE: "sqlite",
    POSTGRES: "postgres",
    MYSQL: "mysql",
    SUPABASE: "supabase",
  },
  API_ENDPOINT: "/api",
  VAULT_KEY: "vault:workspace_data.json",
  ENCRYPTION_METHOD: "AES-256-GCM",
  STORAGE_KEYS: {
    MASTER_PASSWORD: "secret_note_master_pwd",
    WORKSPACE_DATA: "secret_note_workspace_v2",
    STORAGE_CONFIG: "secret_note_storage_config",
    VAULT_ATTEMPTS_PREFIX: "vault_unlock_attempts_",
    APP_SETTINGS: "app_settings",
  },
  DEFAULT_ENVIRONMENTS: ["Development", "Staging", "Production"],
  MODAL_RESET_TIMEOUT: 200,
  SELF_DESTRUCT_MAX_ATTEMPTS: 5,
  SELF_DESTRUCT_DELAY_MS: 2000,
  DEFAULTS: {
    GITHUB_PATH: "workspace.json",
    GITHUB_BRANCH: "main",
    SUPABASE_WORKSPACE_ID: "default",
    STORAGE_DRIVER: "fs",
    STORAGE_MOUNT_POINT: "vault",
    FS_BASE_PATH: "./data",
  },
  BITWARDEN_CSV_HEADERS: [
    "folder", "favorite", "type", "name", "notes", "fields", 
    "login_uri", "login_username", "login_password", "login_totp"
  ],
};

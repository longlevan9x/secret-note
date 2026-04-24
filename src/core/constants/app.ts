export const APP_CONFIG = {
  NAME: "Secret Note",
  VERSION: "2.0",
  STORAGE_KEYS: {
    MASTER_PASSWORD: "secret_note_master_pwd",
    WORKSPACE_DATA: "secret_note_workspace_v2",
  },
  DEFAULT_ENVIRONMENTS: ["Development", "Staging", "Production"],
  MODAL_RESET_TIMEOUT: 200,
};

export const UI_TEXT = {
  LOADING_WORKSPACE: "Loading workspace...",
  UNLOCK_VAULT: "Enter your Master Password to unlock the vault.",
  NO_PROJECTS: "No projects yet. Add one above.",
  SELECT_SERVICE_PROMPT: "Select a service to view details",
  DELETE_SERVICE_CONFIRM: (name: string) => `Are you sure you want to delete ${name}?`,
  DELETE_PROJECT_CONFIRM: "Are you sure you want to delete this project and all its services?",
};

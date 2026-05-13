import { createStorage } from "unstorage";
import fsDriver from "unstorage/drivers/fs";
import githubDriver from "unstorage/drivers/github";
import { APP_CONFIG } from "@/shared/constants/app";

import { serverConfig } from "../config/serverConfig";

// Create shared Storage instance
const storage = createStorage();

const driverType = serverConfig.storageDriver;
console.log(`[Storage] Initializing with driver: ${driverType}`);

if (driverType === APP_CONFIG.DRIVERS.FS || driverType === APP_CONFIG.DRIVERS.JSON) {
  const base = APP_CONFIG.DEFAULTS.FS_BASE_PATH;
  console.log(`[Storage] Mounting FS driver at: ${base}`);
  storage.mount(APP_CONFIG.DEFAULTS.STORAGE_MOUNT_POINT, fsDriver({ base }));
} else if (driverType === APP_CONFIG.DRIVERS.GITHUB) {
  const github = serverConfig.github;
  storage.mount(APP_CONFIG.DEFAULTS.STORAGE_MOUNT_POINT, githubDriver({
    repo: github.repo,
    branch: github.branch,
    token: github.token,
  }));
}

export { storage };


import { afterEach, describe, expect, it } from "vitest";
import { APP_CONFIG } from "@/shared/constants/app";
import { StorageFactory } from "./storageFactory";

describe("StorageFactory", () => {
  afterEach(() => {
    delete process.env.STORAGE_DRIVER;
    StorageFactory.resetForTests();
  });

  it("loads only the configured JSON-compatible storage driver", async () => {
    process.env.STORAGE_DRIVER = APP_CONFIG.DRIVERS.JSON;
    StorageFactory.resetForTests();

    const storage = await StorageFactory.getStorage();

    expect(storage.constructor.name).toBe("JsonStorage");
  });
});

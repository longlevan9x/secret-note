import { JsonStorage } from "../src/server/storage/drivers/jsonStorage";
import { DrizzleStorage } from "../src/server/storage/drivers/drizzleStorage";

async function migrate() {
  console.log("🚀 Starting migration from JSON to Drizzle Database...");

  const jsonStorage = new JsonStorage();
  const drizzleStorage = new DrizzleStorage();

  try {
    const data = await jsonStorage.load();
    if (!data) {
      console.log("❌ No JSON data found to migrate.");
      return;
    }

    console.log(`📦 Found ${data.projects.length} projects. Migrating...`);
    
    // Sử dụng hàm save của DrizzleStorage để nạp toàn bộ data
    await drizzleStorage.save(data);

    console.log("✅ Migration completed successfully!");
    console.log("📝 Your data is now in workspace.db");
  } catch (error) {
    console.error("❌ Migration failed:", error);
  }
}

migrate();

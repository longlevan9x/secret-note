import { drizzle as drizzleSqlite } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
// import { drizzle as drizzlePg } from "drizzle-orm/node-postgres"; // Example for Postgres later
// import { Client } from "pg"; 
import * as schema from "./schema";

import { serverConfig } from "../config/serverConfig";

export function createDbConnection() {
  const driverType = serverConfig.databaseType;

  if (driverType === "sqlite") {
    const sqlite = new Database(serverConfig.databaseUrl);
    sqlite.exec("PRAGMA foreign_keys = ON");
    
    // Automatically initialize tables for SQLite (convenient for development)
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS projects (id TEXT PRIMARY KEY, name TEXT NOT NULL, pos_x REAL, pos_y REAL, width REAL, height REAL);
      CREATE TABLE IF NOT EXISTS services (id TEXT PRIMARY KEY, project_id TEXT NOT NULL, name TEXT NOT NULL, provider TEXT NOT NULL, icon TEXT, env TEXT, description TEXT, pos_x REAL, pos_y REAL, FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE);
      CREATE TABLE IF NOT EXISTS secrets (project_id TEXT NOT NULL, key TEXT NOT NULL, value TEXT NOT NULL, note TEXT, last_rotated TEXT, PRIMARY KEY (project_id, key), FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE);
      CREATE TABLE IF NOT EXISTS service_secrets (service_id TEXT NOT NULL, secret_key TEXT NOT NULL, project_id TEXT NOT NULL, PRIMARY KEY (service_id, secret_key), FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE, FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE);
      CREATE TABLE IF NOT EXISTS service_dependencies (service_id TEXT NOT NULL, dependency_id TEXT NOT NULL, PRIMARY KEY (service_id, dependency_id), FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE, FOREIGN KEY (dependency_id) REFERENCES services(id) ON DELETE CASCADE);
    `);

    return drizzleSqlite(sqlite, { schema });
  }

  // Example for Postgres:
  // if (driverType === "postgres") {
  //   const client = new Client({ connectionString: process.env.DATABASE_URL });
  //   client.connect();
  //   return drizzlePg(client, { schema });
  // }

  throw new Error(`Unsupported database driver: ${driverType}`);
}

export const db = createDbConnection();

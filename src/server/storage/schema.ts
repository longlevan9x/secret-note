import { sqliteTable, text, real, integer, primaryKey } from "drizzle-orm/sqlite-core";

// Table containing Project information
export const projects = sqliteTable("projects", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  posX: real("pos_x").default(0),
  posY: real("pos_y").default(0),
  width: real("width").default(800),
  height: real("height").default(600),
});

// Table containing Services (Nodes) within a Project
export const services = sqliteTable("services", {
  id: text("id").primaryKey(),
  projectId: text("project_id").notNull().references(() => projects.id, { onDelete: 'cascade' }),
  name: text("name").notNull(),
  provider: text("provider").notNull(),
  icon: text("icon"),
  env: text("env").default("Development"),
  description: text("description"),
  posX: real("pos_x").default(50),
  posY: real("pos_y").default(50),
});

// Table containing Project Secrets
export const secrets = sqliteTable("secrets", {
  projectId: text("project_id").notNull().references(() => projects.id, { onDelete: 'cascade' }),
  key: text("key").notNull(),
  value: text("value").notNull(), // Stores encrypted values
  note: text("note"),
  lastRotated: text("last_rotated"),
}, (table) => ({
  pk: primaryKey({ columns: [table.projectId, table.key] }),
}));

// Many-to-Many relationship table between Services and Secrets
export const serviceSecrets = sqliteTable("service_secrets", {
  serviceId: text("service_id").notNull().references(() => services.id, { onDelete: 'cascade' }),
  secretKey: text("secret_key").notNull(),
  projectId: text("project_id").notNull().references(() => projects.id, { onDelete: 'cascade' }),
}, (table) => ({
  pk: primaryKey({ columns: [table.serviceId, table.secretKey] }),
}));

// Dependency relationship table between Services
export const serviceDependencies = sqliteTable("service_dependencies", {
  serviceId: text("service_id").notNull().references(() => services.id, { onDelete: 'cascade' }),
  dependencyId: text("dependency_id").notNull().references(() => services.id, { onDelete: 'cascade' }),
}, (table) => ({
  pk: primaryKey({ columns: [table.serviceId, table.dependencyId] }),
}));

// Table for general settings
export const settings = sqliteTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(), // Stored as JSON string
});

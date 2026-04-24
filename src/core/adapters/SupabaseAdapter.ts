import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { IStorage } from "../interfaces/IStorage";
import { WorkspaceData } from "../schema/types";

export class SupabaseAdapter implements IStorage {
  private client: SupabaseClient;
  private tableName: string = "workspaces";
  private workspaceId: string;

  constructor(url: string, key: string, workspaceId: string = "default") {
    this.client = createClient(url, key);
    this.workspaceId = workspaceId;
  }

  async load(): Promise<WorkspaceData | null> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select("data")
      .eq("id", this.workspaceId)
      .single();

    if (error) {
      if (error.code === "PGRST116") { // Not found
        return null;
      }
      console.error("SupabaseAdapter.load error:", error);
      return null;
    }

    return data?.data as WorkspaceData;
  }

  async save(data: WorkspaceData): Promise<void> {
    const { error } = await this.client
      .from(this.tableName)
      .upsert({ 
        id: this.workspaceId, 
        data: data,
        updated_at: new Date().toISOString() 
      });

    if (error) {
      console.error("SupabaseAdapter.save error:", error);
      throw new Error(`Failed to save to Supabase: ${error.message}`);
    }
  }

  async sync(): Promise<void> {
    // Basic sync is just load/save
  }
}

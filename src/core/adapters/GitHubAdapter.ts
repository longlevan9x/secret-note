import { Octokit } from "octokit";
import { IStorage } from "../interfaces/IStorage";
import { WorkspaceData } from "../schema/types";

export class GitHubAdapter implements IStorage {
  private octokit: Octokit;
  private owner: string;
  private repo: string;
  private path: string;
  private branch: string;
  private lastSha: string | null = null;

  constructor(token: string, repoFull: string, path: string = "workspace.json", branch: string = "main") {
    this.octokit = new Octokit({ auth: token });
    const [owner, repoName] = repoFull.split("/");
    this.owner = owner;
    this.repo = repoName;
    this.path = path;
    this.branch = branch;
  }

  async load(): Promise<WorkspaceData | null> {
    try {
      const response = await this.octokit.rest.repos.getContent({
        owner: this.owner,
        repo: this.repo,
        path: this.path,
        ref: this.branch,
      });

      if (Array.isArray(response.data)) {
        throw new Error("Target path is a directory, not a file.");
      }

      if ("content" in response.data) {
        this.lastSha = response.data.sha;
        // Browser-safe base64 decoding with Unicode support
        const content = decodeURIComponent(
          atob(response.data.content.replace(/\n/g, ""))
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );
        return JSON.parse(content) as WorkspaceData;
      }

      return null;
    } catch (error: unknown) {
      if ((error as { status?: number }).status === 404) {
        return null;
      }
      console.error("GitHubAdapter.load error:", error);
      throw error;
    }
  }

  async save(data: WorkspaceData): Promise<void> {
    // Browser-safe base64 encoding with Unicode support
    const content = btoa(
      encodeURIComponent(JSON.stringify(data, null, 2)).replace(
        /%([0-9A-F]{2})/g,
        (_, p1) => String.fromCharCode(parseInt(p1, 16))
      )
    );
    
    try {
      const response = await this.octokit.rest.repos.createOrUpdateFileContents({
        owner: this.owner,
        repo: this.repo,
        path: this.path,
        branch: this.branch,
        message: `Sync workspace data [${new Date().toISOString()}]`,
        content: content,
        sha: this.lastSha || undefined,
      });

      if (response.data.content?.sha) {
        this.lastSha = response.data.content.sha;
      }
    } catch (error: unknown) {
      console.error("GitHubAdapter.save error:", error);
      const message = (error as Error)?.message || "Unknown error";
      throw new Error(`Failed to save to GitHub: ${message}`);
    }
  }

  async sync(): Promise<void> {
    await this.load();
  }
}

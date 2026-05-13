import { WorkspaceData, Project, ServiceNode, Secret } from "@/shared/schema/types";
import { APP_CONFIG } from "@/shared/constants/app";


/**
 * Exports workspace data to Bitwarden compatible CSV format.
 * Format: folder,favorite,type,name,notes,fields,login_uri,login_username,login_password,login_totp
 */
export const exportToBitwardenCSV = (data: WorkspaceData): string => {
  const headers = APP_CONFIG.BITWARDEN_CSV_HEADERS;
  const rows = [headers.join(",")];

  data.projects.forEach((project: Project) => {
    project.nodes.forEach((service: ServiceNode) => {
      const folder = project.name;
      const name = `${service.name} (${service.env})`;
      const notes = service.description || "";
      
      // Map secrets to Bitwarden custom fields (name:value pairs)
      const fields = (service.secretKeys || [])
        .map((key: string) => {
          const secret = (project.secrets || []).find(s => s.key === key);
          return secret ? `${secret.key}:${secret.value}` : null;
        })
        .filter(Boolean)
        .join("\n");

      // Bitwarden CSV requires escaping quotes; also neutralize formula prefixes
      const escape = (text: string) => {
        const sanitized = /^[=+\-@]/.test(text) ? `'${text}` : text;
        return `"${sanitized.replace(/"/g, '""')}"`;
      };

      const row = [
        escape(folder),
        "0", // favorite
        "note", // type (using secure note for generic services)
        escape(name),
        escape(notes),
        escape(fields),
        "", // uri
        "", // username
        "", // password
        ""  // totp
      ];

      rows.push(row.join(","));
    });
  });

  return rows.join("\n");
};

/**
 * Downloads a string as a file in the browser.
 */
export const downloadFile = (content: string, fileName: string, contentType: string) => {
  const a = document.createElement("a");
  const file = new Blob([content], { type: contentType });
  const objectUrl = URL.createObjectURL(file);
  a.href = objectUrl;
  a.download = fileName;
  a.click();
  setTimeout(() => {
    URL.revokeObjectURL(objectUrl);
  }, 1000);
};

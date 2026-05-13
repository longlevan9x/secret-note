import { NextResponse } from "next/server";
import { projectService } from "@/server/services/projectService";
import { authService } from "@/server/services/authService";

export async function GET(request: Request) {
  const authHeader = request.headers.get("Authorization");
  if (!authService.isAuthorized(authHeader)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await projectService.getAll();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const authHeader = request.headers.get("Authorization");
  if (!authService.isAuthorized(authHeader)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    // If body is an array or has WorkspaceData structure, saveAll (maintain backward compatibility)
    if (body.projects || Array.isArray(body)) {
      await projectService.saveAll(body);
    } else {
      await projectService.add(body);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}

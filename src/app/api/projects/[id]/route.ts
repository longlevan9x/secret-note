import { NextResponse } from "next/server";
import { projectService } from "@/server/services/projectService";
import { authService } from "@/server/services/authService";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authHeader = request.headers.get("Authorization");
  if (!authService.isAuthorized(authHeader)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  try {
    if (body.position) {
      await projectService.setPosition(id, body.position);
    } else {
      await projectService.update(id, body);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authHeader = request.headers.get("Authorization");
  if (!authService.isAuthorized(authHeader)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await projectService.remove(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}

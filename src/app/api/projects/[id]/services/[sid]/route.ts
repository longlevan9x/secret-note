import { NextResponse } from "next/server";
import { serviceService } from "@/server/services/serviceService";
import { authService } from "@/server/services/authService";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string, sid: string }> }) {
  const authHeader = request.headers.get("Authorization");
  if (!authService.isAuthorized(authHeader)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: projectId, sid: serviceId } = await params;
  const body = await request.json();

  try {
    if (body.position) {
      await serviceService.setPosition(projectId, serviceId, body.position);
    } else {
      await serviceService.update(projectId, serviceId, body);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string, sid: string }> }) {
  const authHeader = request.headers.get("Authorization");
  if (!authService.isAuthorized(authHeader)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: projectId, sid: serviceId } = await params;

  try {
    await serviceService.remove(projectId, serviceId);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 });
  }
}

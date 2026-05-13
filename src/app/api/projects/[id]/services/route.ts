import { NextResponse } from "next/server";
import { serviceService } from "@/server/services/serviceService";
import { authService } from "@/server/services/authService";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authHeader = request.headers.get("Authorization");
  if (!authService.isAuthorized(authHeader)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: projectId } = await params;
  const body = await request.json();

  try {
    await serviceService.add(projectId, body.node, body.initialSecrets);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add service" }, { status: 500 });
  }
}

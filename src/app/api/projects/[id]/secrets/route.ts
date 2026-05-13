import { NextResponse } from "next/server";
import { secretService } from "@/server/services/secretService";
import { authService } from "@/server/services/authService";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authHeader = request.headers.get("Authorization");
  if (!authService.isAuthorized(authHeader)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: projectId } = await params;
  const body = await request.json();

  try {
    if (body.secrets && Array.isArray(body.secrets)) {
      await secretService.batchUpsert(projectId, body.secrets, body.serviceId);
    } else {
      await secretService.upsert(projectId, body.secret, body.serviceId);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to process secrets" }, { status: 500 });
  }
}

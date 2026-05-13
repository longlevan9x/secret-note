import { NextResponse } from "next/server";
import { secretService } from "@/server/services/secretService";
import { authService } from "@/server/services/authService";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string, key: string }> }) {
  const authHeader = request.headers.get("Authorization");
  if (!authService.isAuthorized(authHeader)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: projectId, key: secretKey } = await params;

  try {
    await secretService.remove(projectId, secretKey);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete secret" }, { status: 500 });
  }
}

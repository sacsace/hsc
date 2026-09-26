import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getContent, saveContent, type SiteContent } from "@/lib/content";

export async function GET() {
  const content = await getContent();
  return NextResponse.json(content);
}

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as SiteContent;
  if (!body?.ko?.hero?.brand || !body?.en?.hero?.brand) {
    return NextResponse.json({ error: "Invalid content" }, { status: 400 });
  }

  await saveContent(body);
  return NextResponse.json({ ok: true });
}

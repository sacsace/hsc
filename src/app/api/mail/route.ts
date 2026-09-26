import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import {
  readMailSettings,
  sendTestEmail,
  toPublicMailSettings,
  writeMailSettings,
} from "@/lib/mail";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const settings = await readMailSettings();
  return NextResponse.json(toPublicMailSettings(settings));
}

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const settings = await writeMailSettings({
    enabled: Boolean(body.enabled),
    host: typeof body.host === "string" ? body.host : undefined,
    port: typeof body.port === "number" ? body.port : Number(body.port),
    secure: Boolean(body.secure),
    user: typeof body.user === "string" ? body.user : "",
    pass: typeof body.pass === "string" ? body.pass : "",
    fromName: typeof body.fromName === "string" ? body.fromName : undefined,
    fromEmail: typeof body.fromEmail === "string" ? body.fromEmail : "",
    to: typeof body.to === "string" ? body.to : "",
  });

  return NextResponse.json({ ok: true, settings: toPublicMailSettings(settings) });
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  if (body?.action !== "test") {
    return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
  }

  const result = await sendTestEmail();
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}

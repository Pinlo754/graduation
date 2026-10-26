import { NextResponse } from "next/server";
import { siteConfig } from "@/config/site";
import { getInvitation } from "@/lib/invitations";
import { isRsvpConfigured, parseRsvpPayload } from "@/lib/rsvp";

export const runtime = "nodejs";

// Best-effort throttle per server instance; the webhook secret is the real guard.
const recent = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

function throttled(key: string): boolean {
  const now = Date.now();
  const hits = (recent.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  recent.set(key, hits);
  return hits.length > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  if (!siteConfig.rsvp.enabled || !isRsvpConfigured()) {
    return NextResponse.json({ error: "RSVP hiện chưa được bật." }, { status: 503 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Dữ liệu không hợp lệ." }, { status: 400 });
  }
  const parsed = parseRsvpPayload(json);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });

  const invitation = getInvitation(parsed.value.id);
  if (!invitation || !invitation.rsvpEnabled) {
    return NextResponse.json({ error: "Thiệp mời này không nhận phản hồi trực tuyến." }, { status: 404 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (throttled(`${ip}:${invitation.id}`)) {
    return NextResponse.json({ error: "Bạn gửi hơi nhanh, thử lại sau một phút nhé." }, { status: 429 });
  }

  try {
    const response = await fetch(process.env.RSVP_WEBHOOK_URL!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: process.env.RSVP_WEBHOOK_SECRET ?? "",
        id: invitation.id,
        recipientName: invitation.recipientName,
        status: parsed.value.status,
        note: parsed.value.note ?? "",
        submittedAt: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(10_000),
      cache: "no-store",
    });
    const text = await response.text();
    // The Apps Script template answers {"ok":true}; anything else counts as not saved.
    let saved = response.ok;
    let reason = "";
    try {
      const result = JSON.parse(text) as { ok?: boolean; error?: string };
      if (typeof result.ok === "boolean") saved = response.ok && result.ok;
      reason = result.error ?? "";
    } catch {
      /* non-JSON 2xx body: trust the status code */
    }
    // "unauthorized" = RSVP_WEBHOOK_SECRET differs from SECRET in the deployed Apps Script version.
    if (!saved) throw new Error(`Webhook responded ${response.status}${reason ? `: ${reason}` : ""}`);
  } catch (error) {
    console.error("[rsvp] failed to persist", error);
    return NextResponse.json({ error: "Chưa lưu được phản hồi. Bạn thử lại sau, hoặc nhắn trực tiếp cho mình nhé." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}

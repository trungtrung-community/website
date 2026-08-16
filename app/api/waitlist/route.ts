import { subscribe } from "@/lib/waitlist";

/**
 * The waitlist endpoint.
 *
 * Rate limiting is per-instance and in memory: enough to blunt a script, not a
 * substitute for a real limiter at the edge. If this page ever gets serious
 * traffic, move it to the platform's own rate limiting and delete this.
 */

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);

  // Keep the map from growing without bound on a long-lived instance.
  if (hits.size > 5_000) {
    for (const [k, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    }
  }

  return recent.length > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (rateLimited(ip)) {
    return Response.json({ ok: false, reason: "rate" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, reason: "invalid" }, { status: 400 });
  }

  const { email, company } = (body ?? {}) as { email?: string; company?: string };

  // The honeypot. A real reader never sees this field, so anything in it came
  // from something filling the form blind. Answer as though it worked.
  if (company) return Response.json({ ok: true });

  if (typeof email !== "string") {
    return Response.json({ ok: false, reason: "invalid" }, { status: 400 });
  }

  const result = await subscribe(email);
  return Response.json(result, { status: result.ok ? 200 : result.reason === "invalid" ? 400 : 502 });
}

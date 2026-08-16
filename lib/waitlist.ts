/**
 * The waitlist provider.
 *
 * One function, one shape. Swapping Resend for Buttondown, ConvertKit or a
 * Google Sheet means editing `subscribe` and nothing else.
 *
 * Defaults to a no-op that logs, so the form works end to end in development
 * with no account and no keys. In production a missing key is an error rather
 * than a silent success — an address quietly dropped is worse than a visible
 * failure the reader can act on.
 */

export type SubscribeResult =
  | { ok: true }
  | { ok: false; reason: "invalid" | "provider" };

/**
 * Deliberately permissive. The only address worth rejecting here is one that
 * cannot be an address at all; anything stricter turns real people away over
 * a plus sign or a new top-level domain.
 */
export function isPlausibleEmail(value: string): boolean {
  const trimmed = value.trim();
  if (trimmed.length < 6 || trimmed.length > 254) return false;
  if (/\s/.test(trimmed)) return false;
  const at = trimmed.indexOf("@");
  if (at < 1 || at !== trimmed.lastIndexOf("@")) return false;
  const domain = trimmed.slice(at + 1);
  return domain.includes(".") && !domain.startsWith(".") && !domain.endsWith(".");
}

export async function subscribe(email: string): Promise<SubscribeResult> {
  if (!isPlausibleEmail(email)) return { ok: false, reason: "invalid" };

  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;

  if (!apiKey || !audienceId) {
    if (process.env.NODE_ENV === "production") {
      console.error("waitlist: RESEND_API_KEY or RESEND_AUDIENCE_ID is not set");
      return { ok: false, reason: "provider" };
    }
    console.info(`waitlist (dev, not stored): ${email}`);
    return { ok: true };
  }

  try {
    const res = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, unsubscribed: false }),
    });

    if (!res.ok) {
      console.error(`waitlist: provider returned ${res.status} ${await res.text()}`);
      return { ok: false, reason: "provider" };
    }
    return { ok: true };
  } catch (err) {
    console.error("waitlist: provider request failed", err);
    return { ok: false, reason: "provider" };
  }
}

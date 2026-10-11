import process from "node:process";
import { z } from "zod";

// Shared anti-spam fields for every public form.
//   website   — honeypot: hidden input; humans leave it empty, bots fill it.
//   turnstile — Cloudflare Turnstile token; only checked once TURNSTILE_SECRET_KEY is set
//               (Cloudflare dashboard → Settings → Variables and Secrets).
export const spamGuardFields = {
  website: z.string().max(200).optional().default(""),
  turnstile: z.string().max(4000).optional().default(""),
};

export type SpamGuardInput = { website?: string; turnstile?: string };

export async function assertHuman(input: SpamGuardInput, request?: Request): Promise<void> {
  if (input.website && input.website.trim() !== "") {
    // Silently accept nothing: bots see a generic failure.
    throw new Error("Submission rejected");
  }

  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return; // Turnstile not configured yet — honeypot only.

  if (!input.turnstile) throw new Error("Please complete the verification challenge");

  const body = new URLSearchParams({ secret, response: input.turnstile });
  const ip = request?.headers.get("CF-Connecting-IP");
  if (ip) body.set("remoteip", ip);

  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body,
  });
  const json = (await res.json().catch(() => ({}))) as { success?: boolean };
  if (!json.success) throw new Error("Verification failed — please try again");
}

/** Strips the anti-spam fields before a row is written to the database. */
export function withoutSpamGuard<T extends SpamGuardInput>(data: T): Omit<T, "website" | "turnstile"> {
  const { website: _w, turnstile: _t, ...rest } = data;
  return rest;
}

import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { legacyRedirect } from "./lib/legacy-redirects";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!body.includes('"unhandled":true') || !body.includes('"message":"HTTPError"')) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

// Security headers for everything the Worker serves (HTML pages, server functions, API routes).
// Static files under /assets, /media and /forms are served by Cloudflare before the Worker runs;
// their headers live in public/_headers.
const CSP = [
  "default-src 'self'",
  // TanStack Start hydrates through inline scripts; Turnstile + Cloudflare Web Analytics are allowed explicitly.
  "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://static.cloudflareinsights.com",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  "img-src 'self' data: blob: https://*.supabase.co",
  "media-src 'self' blob:",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://challenges.cloudflare.com https://cloudflareinsights.com",
  // *.supabase.co: CV previews in the admin panel (signed, short-lived URLs)
  "frame-src https://challenges.cloudflare.com https://maps.google.com https://www.google.com https://*.supabase.co",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const SECURITY_HEADERS: Record<string, string> = {
  // No includeSubDomains on purpose: internal hosts such as webuic.unitedjo.com may not serve HTTPS.
  "Strict-Transport-Security": "max-age=31536000",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  "Cross-Origin-Opener-Policy": "same-origin",
};

function withSecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) if (!headers.has(k)) headers.set(k, v);
  const type = headers.get("content-type") ?? "";
  // The media route sets its own sandboxing CSP; HTML pages get the site policy.
  if (type.includes("text/html") && !headers.has("Content-Security-Policy")) {
    headers.set("Content-Security-Policy", CSP);
  }
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      // One canonical host: www.unitedjo.com → unitedjo.com (keeps path + query), so search
      // engines and analytics see a single site.
      const url = new URL(request.url);
      if (url.hostname.startsWith("www.")) {
        url.hostname = url.hostname.slice(4);
        return withSecurityHeaders(Response.redirect(url.toString(), 301));
      }
      // Old Joomla URLs (/index.php/en/…) still show up in Google: send them to the new pages.
      const legacy = legacyRedirect(url.pathname);
      if (legacy) {
        return withSecurityHeaders(Response.redirect(new URL(legacy, url.origin).toString(), 301));
      }
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return withSecurityHeaders(await normalizeCatastrophicSsrResponse(response));
    } catch (error) {
      console.error(error);
      return withSecurityHeaders(
        new Response(renderErrorPage(), {
          status: 500,
          headers: { "content-type": "text/html; charset=utf-8" },
        }),
      );
    }
  },
};

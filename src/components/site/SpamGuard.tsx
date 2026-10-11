import { useEffect, useRef } from "react";
import { useLang } from "@/lib/i18n";

// Anti-spam fields for the public forms.
//   1) Honeypot: a visually hidden "website" field. People never see it; bots fill it → rejected server-side.
//   2) Cloudflare Turnstile (free, privacy-friendly captcha). Renders only when VITE_TURNSTILE_SITE_KEY is
//      set at build time; the server verifies the token when TURNSTILE_SECRET_KEY is set.
// Both fields are read by the submit handlers as `website` and `cf-turnstile-response`.

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      remove: (id: string) => void;
    };
  }
}

const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;
const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

let scriptPromise: Promise<void> | null = null;
function loadTurnstile(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.turnstile) return Promise.resolve();
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = SCRIPT_SRC;
      s.async = true;
      s.defer = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error("Turnstile failed to load"));
      document.head.appendChild(s);
    });
  }
  return scriptPromise;
}

export function SpamGuard() {
  const { lang } = useLang();
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!SITE_KEY || !box.current) return;
    let widgetId: string | null = null;
    let cancelled = false;
    loadTurnstile()
      .then(() => {
        if (cancelled || !box.current || !window.turnstile) return;
        widgetId = window.turnstile.render(box.current, {
          sitekey: SITE_KEY,
          language: lang,
          theme: "light",
          size: "flexible",
        });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
    };
  }, [lang]);

  return (
    <>
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>
      {SITE_KEY ? <div ref={box} className="mt-4" /> : null}
    </>
  );
}

// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  nitro: {
    cloudflare: {
      // Merged into the generated .output/server/wrangler.json on every build.
      // Only PUBLIC values live here; secrets (SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY,
      // TURNSTILE_SECRET_KEY) are set as *Secrets* in the Cloudflare dashboard and never committed.
      //
      // IMPORTANT: every deploy replaces the Worker's plain-text variables with this list, so a
      // plain "Variable" added in the dashboard disappears on the next deploy (that is how the
      // NOTIFY_* values were lost once). Add plain-text settings HERE; use the dashboard only for
      // Secrets, which deploys never touch.
      wrangler: {
        name: "united-insurance",
        vars: {
          SUPABASE_URL: "https://rdbbhkvzcpdyctscdhvu.supabase.co",
          SUPABASE_PUBLISHABLE_KEY: "sb_publishable_gyzdwQsKYUtUT7FmWvm53w_QaRCXEAP",
          // Form-submission notifications (sent through Resend; domain verified there).
          NOTIFY_EMAIL: "uic@unitedjo.com",
          NOTIFY_FROM: "United Insurance <website@unitedjo.com>",
        },
      },
    },
  },
});

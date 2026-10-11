// Static fallback shown only when server rendering itself fails. Bilingual, no scripts needed.
export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="utf-8" />
    <title>تعذّر تحميل الصفحة — United Insurance</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex" />
    <style>
      body { font: 15px/1.6 system-ui, -apple-system, "Segoe UI", sans-serif; background: #f6f8fb; color: #0f172a; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 30rem; width: 100%; text-align: center; padding: 2.5rem 2rem; background: #fff; border: 1px solid #e2e8f0; border-radius: 1.5rem; }
      h1 { font-size: 1.35rem; margin: 0 0 0.5rem; }
      p { color: #475569; margin: 0 0 0.5rem; }
      p.en { direction: ltr; font-size: 0.9rem; margin-bottom: 1.5rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.6rem 1.2rem; border-radius: 999px; font: inherit; font-weight: 600; cursor: pointer; text-decoration: none; border: 1px solid transparent; }
      .primary { background: #0b2a5b; color: #fff; }
      .secondary { background: #fff; color: #0b2a5b; border-color: #cbd5e1; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>تعذّر تحميل الصفحة</h1>
      <p>حدث خطأ مؤقت من جهتنا. جرّب تحديث الصفحة أو العودة إلى الرئيسية.</p>
      <p class="en">This page didn't load — a temporary error on our side. Try refreshing or go back home.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">تحديث · Refresh</button>
        <a class="secondary" href="/">الرئيسية · Home</a>
      </div>
    </div>
  </body>
</html>`;
}

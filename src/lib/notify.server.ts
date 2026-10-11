import process from "node:process";

// Email notifications for form submissions, sent through Resend (https://resend.com).
// Active only when both secrets exist in Cloudflare (Settings → Variables and Secrets):
//   RESEND_API_KEY   — API key from the Resend dashboard
//   NOTIFY_EMAIL     — inbox that receives submissions (comma-separated for several)
// Optional:
//   NOTIFY_FROM      — sender, e.g. "United Insurance <website@unitedjo.com>" (domain must be verified in Resend)
// When not configured, submissions are still saved to the database and nothing is sent.

type Notification = {
  subject: string;
  /** Plain-text lines; rendered as a simple HTML list as well. */
  lines: [label: string, value: string][];
  /** Optional reply-to (the person who submitted the form). */
  replyTo?: string;
};

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

export function notificationsConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.NOTIFY_EMAIL);
}

/** Sends the notification; never throws (a failed email must not fail the submission). Returns true when sent. */
export async function sendNotification(n: Notification): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL;
  if (!apiKey || !to) return false;
  const from = process.env.NOTIFY_FROM || "United Insurance Website <onboarding@resend.dev>";

  const text = n.lines.map(([k, v]) => `${k}: ${v}`).join("\n");
  const html = `<div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6">
    <h2 style="margin:0 0 12px">${escapeHtml(n.subject)}</h2>
    <table cellpadding="6" style="border-collapse:collapse">
      ${n.lines
        .map(
          ([k, v]) =>
            `<tr><td style="color:#666;vertical-align:top;white-space:nowrap">${escapeHtml(k)}</td><td style="white-space:pre-wrap">${escapeHtml(v)}</td></tr>`,
        )
        .join("")}
    </table>
    <p style="color:#888;font-size:12px;margin-top:16px">Sent automatically from unitedjo.com — manage submissions in the admin panel.</p>
  </div>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: to.split(",").map((s) => s.trim()).filter(Boolean),
        subject: n.subject,
        text,
        html,
        ...(n.replyTo ? { reply_to: n.replyTo } : {}),
      }),
    });
    if (!res.ok) {
      console.error("[notify] Resend error", res.status, await res.text().catch(() => ""));
      return false;
    }
    return true;
  } catch (err) {
    console.error("[notify] failed", err);
    return false;
  }
}

/** Sends a confirmation to the person who submitted a complaint (their reference number). Never throws. */
export async function sendComplaintReceipt(opts: { to: string; reference: string; lang: "ar" | "en"; name: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;
  const from = process.env.NOTIFY_FROM || "United Insurance <onboarding@resend.dev>";
  const ar = opts.lang === "ar";
  const subject = ar
    ? `استلمنا شكواك — الرقم المرجعي ${opts.reference}`
    : `We received your case — reference ${opts.reference}`;
  const text = ar
    ? `عزيزي/عزيزتي ${opts.name}،\n\nاستلمنا طلبك وتم تسجيله برقم مرجعي: ${opts.reference}\nسيتواصل معك فريق إدارة الشكاوى خلال يومي عمل.\n\nالشركة المتحدة للتأمين\nComplaints@unitedjo.com · +962 6 200 3333`
    : `Dear ${opts.name},\n\nWe received your case and logged it under reference: ${opts.reference}\nOur complaints team will contact you within two business days.\n\nUnited Insurance Company\nComplaints@unitedjo.com · +962 6 200 3333`;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [opts.to], subject, text }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

import { supabase } from "@/integrations/supabase/client";

// Files are served back through the site's own address (see the media route),
// so a stored path never exposes a third-party storage host.

const MAX_EDGE = 1920; // px — plenty for a full-width hero on a 2× display
const WEBP_QUALITY = 0.82;

/**
 * Photos (PNG/JPEG/WebP) are resized to at most 1920px and re-encoded as WebP in the browser
 * before upload, so a 2 MB camera export becomes ~100–200 KB on the site. SVG/GIF and
 * non-images are uploaded as they are.
 */
export async function optimizeImage(file: File): Promise<File> {
  if (!/^image\/(png|jpe?g|webp)$/i.test(file.type)) return file;
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, MAX_EDGE / Math.max(bmp.width, bmp.height));
    const w = Math.round(bmp.width * scale);
    const h = Math.round(bmp.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bmp, 0, 0, w, h);
    bmp.close?.();
    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/webp", WEBP_QUALITY));
    if (!blob) return file;
    // Keep the original if the conversion didn't actually help (tiny logos, already-optimised files).
    if (blob.size >= file.size && scale === 1) return file;
    const base = file.name.replace(/\.[^.]+$/, "");
    return new File([blob], `${base}.webp`, { type: "image/webp" });
  } catch {
    return file;
  }
}

export async function uploadToBucket(
  bucket: "articles" | "team" | "forms" | "insurance" | "logos",
  file: File,
): Promise<string> {
  const prepared = bucket === "forms" ? file : await optimizeImage(file);
  const ext = prepared.name.split(".").pop()?.toLowerCase() ?? "bin";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(path, prepared, {
    cacheControl: "31536000",
    upsert: false,
    contentType: prepared.type || undefined,
  });
  if (error) throw error;
  return `/api/public/media/${bucket}/${path}`;
}

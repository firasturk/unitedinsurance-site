import { supabase } from "@/integrations/supabase/client";

// Files are served back through the site's own address (see the media route),
// so a stored path never exposes a third-party storage host.
export async function uploadToBucket(
  bucket: "articles" | "team" | "forms" | "insurance" | "logos",
  file: File,
): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
    contentType: file.type || undefined,
  });
  if (error) throw error;
  return `/api/public/media/${bucket}/${path}`;
}

-- Articles can carry the original document (a magazine spread, a press release) as a PDF;
-- the article page shows a "Read the full article (PDF)" button when it is set.
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS attachment_url text;

-- The dashboard uploads those PDFs into the "articles" bucket (created from the dashboard, so its
-- MIME allow-list may be images-only). Accept any type; the admin UI restricts what it sends.
UPDATE storage.buckets
SET allowed_mime_types = NULL
WHERE id = 'articles' AND allowed_mime_types IS NOT NULL;

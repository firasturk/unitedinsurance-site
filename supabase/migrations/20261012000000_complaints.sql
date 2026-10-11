-- Suggestions & complaints submitted from /complaints.
-- Admin-only access (same model as contact_messages); inserts happen server-side with the service role.
CREATE TABLE IF NOT EXISTS public.complaints (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reference TEXT NOT NULL UNIQUE,
  kind TEXT NOT NULL DEFAULT 'complaint',
  full_name TEXT NOT NULL,
  national_id TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  policy_number TEXT NOT NULL DEFAULT '',
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  lang TEXT NOT NULL DEFAULT 'ar',
  status TEXT NOT NULL DEFAULT 'new',
  emailed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, UPDATE, DELETE ON public.complaints TO authenticated;
GRANT ALL ON public.complaints TO service_role;

ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view complaints" ON public.complaints
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update complaints" ON public.complaints
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete complaints" ON public.complaints
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS complaints_created_at_idx ON public.complaints (created_at DESC);

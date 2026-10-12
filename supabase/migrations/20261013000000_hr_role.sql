-- HR role: sees and manages job applications (and downloads their CVs) — nothing else.
-- NOTE: a new enum value cannot be used in the same transaction that adds it, so this file is
-- applied in two runs in production: (1) the ALTER TYPE line, (2) the rest.

ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'hr';

-- ---- run separately after the line above ----

CREATE POLICY "HR manage applications" ON public.job_applications
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'hr'))
  WITH CHECK (public.has_role(auth.uid(), 'hr'));

CREATE POLICY "HR read CVs" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'cvs' AND public.has_role(auth.uid(), 'hr'));

-- Grant the role to a user (replace the email):
-- INSERT INTO public.user_roles (user_id, role)
-- SELECT id, 'hr' FROM auth.users WHERE lower(email) = 'hr@unitedjo.com'
-- ON CONFLICT DO NOTHING;

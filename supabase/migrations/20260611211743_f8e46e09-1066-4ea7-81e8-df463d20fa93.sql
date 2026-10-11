
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;

-- Storage policies: anyone can read these public-content buckets;
-- only admins can write/update/delete.
CREATE POLICY "Public read articles bucket" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'articles');
CREATE POLICY "Admins write articles bucket" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'articles' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update articles bucket" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'articles' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete articles bucket" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'articles' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public read team bucket" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'team');
CREATE POLICY "Admins write team bucket" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'team' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update team bucket" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'team' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete team bucket" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'team' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public read forms bucket" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'forms');
CREATE POLICY "Admins write forms bucket" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'forms' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update forms bucket" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'forms' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete forms bucket" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'forms' AND public.has_role(auth.uid(), 'admin'));

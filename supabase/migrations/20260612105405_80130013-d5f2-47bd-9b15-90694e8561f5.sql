
CREATE POLICY "Public read insurance images"
ON storage.objects FOR SELECT
USING (bucket_id = 'insurance');

CREATE POLICY "Admins upload insurance images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'insurance' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update insurance images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'insurance' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete insurance images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'insurance' AND public.has_role(auth.uid(), 'admin'));

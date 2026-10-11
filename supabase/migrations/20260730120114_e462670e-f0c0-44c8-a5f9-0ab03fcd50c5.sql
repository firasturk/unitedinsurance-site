DROP POLICY IF EXISTS "Anyone reads active faqs" ON public.chat_faqs;
CREATE POLICY "Anyone reads active faqs" ON public.chat_faqs FOR SELECT TO anon, authenticated USING (active = true);
CREATE POLICY "Admins read all faqs" ON public.chat_faqs FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
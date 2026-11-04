-- HR can also create, edit, publish and delete job vacancies (not only read applications).
CREATE POLICY "HR manage vacancies" ON public.job_vacancies
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'hr'))
  WITH CHECK (public.has_role(auth.uid(), 'hr'));

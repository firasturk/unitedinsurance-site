CREATE TABLE IF NOT EXISTS public.agent_news (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date TEXT NOT NULL,
  title_en TEXT NOT NULL DEFAULT '',
  title_ar TEXT NOT NULL DEFAULT '',
  body_en TEXT[] NOT NULL DEFAULT '{}',
  body_ar TEXT[] NOT NULL DEFAULT '{}',
  sort_order INT NOT NULL DEFAULT 1,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.agent_news TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.agent_news TO authenticated;
GRANT ALL ON public.agent_news TO service_role;
ALTER TABLE public.agent_news ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read published agent news" ON public.agent_news;
CREATE POLICY "Public can read published agent news" ON public.agent_news FOR SELECT USING (published = true);
DROP POLICY IF EXISTS "Admins manage agent news" ON public.agent_news;
CREATE POLICY "Admins manage agent news" ON public.agent_news FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.agent_news (date, title_en, title_ar, body_en, body_ar, sort_order)
SELECT '2026/03/08',
 'Termination of the agency agreement with Mr. Amin Ibrahim Yaseen Al-Nsour.',
 'إنهاء اتفاقية الوكيل السيد/ أمين إبراهيم ياسين النسور.',
 ARRAY['Dear valued clients,','Please be informed that the agency agreement with Mr. Amin Ibrahim Yaseen Al-Nsour has been terminated as of 08/03/2026. Accordingly, he is no longer authorised to represent United Insurance Company PLC, collect any amounts, or provide any services on its behalf after this date.','For any inquiries or service requests, kindly contact us directly on: +962 6 200 3333','Or by email: UIC@unitedjo.com'],
 ARRAY['عملاؤنا الكرام،','نود إعلامكم بأن اتفاقية الوكيل السيد/ أمين إبراهيم ياسين النسور قد انتهت اعتباراً من تاريخ 2026/03/08، وعليه لم يعد مخولاً بتمثيل الشركة المتحدة للتأمين م.ع.م أو قبض أي مبالغ مالية أو تقديم أي خدمات باسمها بعد هذا التاريخ.','لأي استفسارات أو طلب خدمات، يرجى التكرم بالتواصل معنا مباشرة على رقم الشركة: +962 6 200 3333','أو عبر البريد الإلكتروني: UIC@unitedjo.com'],
 1
WHERE NOT EXISTS (SELECT 1 FROM public.agent_news);
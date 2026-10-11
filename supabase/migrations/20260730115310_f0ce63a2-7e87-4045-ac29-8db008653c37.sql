CREATE TABLE public.chat_faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_ar text NOT NULL,
  question_en text NOT NULL,
  answer_ar text NOT NULL DEFAULT '',
  answer_en text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chat_faqs TO authenticated;
GRANT SELECT ON public.chat_faqs TO anon;
GRANT ALL ON public.chat_faqs TO service_role;
ALTER TABLE public.chat_faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads active faqs" ON public.chat_faqs FOR SELECT TO anon, authenticated USING (active = true OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins insert faqs" ON public.chat_faqs FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins update faqs" ON public.chat_faqs FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins delete faqs" ON public.chat_faqs FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER chat_faqs_updated BEFORE UPDATE ON public.chat_faqs FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.chat_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL UNIQUE,
  page_url text,
  user_agent text,
  started_at timestamptz NOT NULL DEFAULT now(),
  last_message_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, DELETE ON public.chat_conversations TO authenticated;
GRANT ALL ON public.chat_conversations TO service_role;
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read conversations" ON public.chat_conversations FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins delete conversations" ON public.chat_conversations FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TABLE public.chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  role text NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX chat_messages_conversation_idx ON public.chat_messages (conversation_id, created_at);
GRANT SELECT, DELETE ON public.chat_messages TO authenticated;
GRANT ALL ON public.chat_messages TO service_role;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read messages" ON public.chat_messages FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins delete messages" ON public.chat_messages FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

INSERT INTO public.chat_faqs (question_ar, question_en, answer_ar, answer_en, sort_order) VALUES
('ما هي أوقات الدوام؟','What are your working hours?','الأحد – الخميس من 8:00 صباحاً حتى 4:00 مساءً، والسبت (مركز الاتصال) من 8:30 صباحاً حتى 2:00 ظهراً.','Sunday – Thursday 8:00 AM to 4:00 PM, and Saturday (call center) 8:30 AM to 2:00 PM.',10),
('كيف أقدّم مطالبة تأمين؟','How do I file a claim?','حمّل نموذج المطالبة المناسب من صفحة نوع التأمين، عبّئه وأرفق المستندات المطلوبة، ثم أرسله إلى info@unitedjo.com أو سلّمه في أقرب فرع.','Download the relevant claim form from the insurance product page, fill it in with the required documents, then send it to info@unitedjo.com or hand it in at the nearest branch.',20),
('ما أنواع التأمين المتوفرة لديكم؟','What insurance products do you offer?','نوفّر تأمين المركبات، التأمين الطبي، التأمين على الحياة، تأمين السفر، التأمين البحري، وتأمين الحريق والحوادث العامة والهندسي.','We offer motor, medical, life, travel, marine, and fire/general accident & engineering insurance.',30),
('كيف أجدّد وثيقتي؟','How can I renew my policy?','تواصل معنا على 3333 200 6 962+ أو بالبريد info@unitedjo.com قبل انتهاء الوثيقة، وسيتم تزويدك بعرض التجديد.','Contact us at +962 6 200 3333 or info@unitedjo.com before your policy expires and we will send you the renewal offer.',40),
('كيف أتواصل معكم؟','How can I contact you?','هاتف: 3333 200 6 962+ | فاكس: 3334 200 6 962+ | بريد: info@unitedjo.com','Phone: +962 6 200 3333 | Fax: +962 6 200 3334 | Email: info@unitedjo.com',50),
('أين تقع فروعكم؟','Where are your branches?','المقر الرئيسي: عمّان، شارع زهران، بناية رقم 188. فرع إربد: بجانب صالة حياة إربد – مجمع فؤاد الحجي – الطابق الثالث – مكتب رقم 52.','Head Office: Amman, Zahran Street, Building No. 188. Irbid Branch: next to Hayat Irbid Hall – Fouad Al-Hajji Complex – 3rd floor – Office No. 52.',60),
('من أين أحمّل النماذج؟','Where can I download forms?','جميع نماذج الطلبات والمطالبات متاحة للتحميل داخل صفحة كل نوع تأمين، وصفحتي الشكاوى والتقارير.','All application and claim forms are available to download on each insurance product page, as well as the complaints and reports pages.',70),
('هل التأمين الطبي يشمل العائلة؟','Does medical insurance cover my family?','نعم، يمكن إصدار وثائق طبية فردية أو عائلية أو لمجموعات الشركات. تواصل معنا لتفصيل التغطية المناسبة لك.','Yes, medical policies can be issued for individuals, families, or corporate groups. Contact us to tailor the right cover for you.',80);
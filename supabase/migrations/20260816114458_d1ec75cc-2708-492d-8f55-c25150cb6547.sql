CREATE TABLE public.job_vacancies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title_en text NOT NULL,
  title_ar text NOT NULL,
  department_en text NOT NULL DEFAULT '',
  department_ar text NOT NULL DEFAULT '',
  level_en text NOT NULL DEFAULT '',
  level_ar text NOT NULL DEFAULT '',
  type_en text NOT NULL DEFAULT '',
  type_ar text NOT NULL DEFAULT '',
  location_en text NOT NULL DEFAULT '',
  location_ar text NOT NULL DEFAULT '',
  summary_en text NOT NULL DEFAULT '',
  summary_ar text NOT NULL DEFAULT '',
  responsibilities_en text[] NOT NULL DEFAULT '{}',
  responsibilities_ar text[] NOT NULL DEFAULT '{}',
  qualifications_en text[] NOT NULL DEFAULT '{}',
  qualifications_ar text[] NOT NULL DEFAULT '{}',
  skills_en text[] NOT NULL DEFAULT '{}',
  skills_ar text[] NOT NULL DEFAULT '{}',
  closing_date date,
  published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.job_vacancies TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.job_vacancies TO authenticated;
GRANT ALL ON public.job_vacancies TO service_role;
ALTER TABLE public.job_vacancies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published vacancies are public" ON public.job_vacancies
  FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "Admins manage vacancies" ON public.job_vacancies
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vacancy_id uuid REFERENCES public.job_vacancies(id) ON DELETE SET NULL,
  vacancy_title text NOT NULL DEFAULT 'Talent Pool',
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL DEFAULT '',
  cover_note text NOT NULL DEFAULT '',
  cv_path text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, UPDATE, DELETE ON public.job_applications TO authenticated;
GRANT ALL ON public.job_applications TO service_role;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage applications" ON public.job_applications
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins read CVs" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'cvs' AND public.has_role(auth.uid(), 'admin'));

INSERT INTO public.job_vacancies (slug, title_en, title_ar, department_en, department_ar, level_en, level_ar, type_en, type_ar, location_en, location_ar, summary_en, summary_ar, responsibilities_en, responsibilities_ar, qualifications_en, qualifications_ar, skills_en, skills_ar, closing_date, sort_order) VALUES
('senior-underwriter-motor','Senior Underwriter – Motor','مكتتب أول – المركبات','Underwriting','الاكتتاب','Senior','خبرة','Full-time','دوام كامل','Amman, Jordan','عمّان، الأردن','Lead motor risk assessment and pricing for corporate and retail portfolios.','قيادة تقييم وتسعير مخاطر المركبات لمحافظ الأفراد والشركات.',
 ARRAY['Assess and price motor risks in line with underwriting guidelines.','Review renewals and recommend portfolio corrective actions.','Support the sales team with technical guidance on complex cases.'],
 ARRAY['تقييم وتسعير مخاطر المركبات وفق أسس الاكتتاب المعتمدة.','مراجعة التجديدات واقتراح الإجراءات التصحيحية للمحفظة.','دعم فريق المبيعات فنياً في الحالات المعقّدة.'],
 ARRAY['Bachelor degree in Business, Finance, Insurance or related field.','5+ years of motor underwriting experience.'],
 ARRAY['بكالوريوس في إدارة الأعمال أو المالية أو التأمين أو ما يعادلها.','خبرة 5 سنوات فأكثر في اكتتاب المركبات.'],
 ARRAY['Risk analysis','Negotiation','Excel & reporting'],
 ARRAY['تحليل المخاطر','التفاوض','الإكسل والتقارير'],
 '2026-10-31',1),
('claims-officer-medical','Claims Officer – Medical','موظف مطالبات – طبي','Claims','المطالبات','Mid-level','متوسط','Full-time','دوام كامل','Amman, Jordan','عمّان، الأردن','Process medical claims accurately and deliver a smooth member experience.','معالجة المطالبات الطبية بدقة وتقديم تجربة سلسة للمؤمّن لهم.',
 ARRAY['Review, adjudicate and settle medical claims within service levels.','Coordinate with providers and TPAs on approvals.','Detect and escalate potential fraud or abuse.'],
 ARRAY['مراجعة وتسوية المطالبات الطبية ضمن مستويات الخدمة المعتمدة.','التنسيق مع مزودي الخدمة وشركات الإدارة بشأن الموافقات.','رصد وتصعيد حالات الاحتيال أو الاستخدام غير المبرر.'],
 ARRAY['Bachelor degree in Pharmacy, Nursing, Health Management or related field.','2-4 years in medical claims.'],
 ARRAY['بكالوريوس صيدلة أو تمريض أو إدارة صحية أو ما يعادلها.','خبرة 2-4 سنوات في المطالبات الطبية.'],
 ARRAY['Attention to detail','Medical coding','Customer care'],
 ARRAY['الدقة في التفاصيل','الترميز الطبي','خدمة العملاء'],
 '2026-09-30',2),
('digital-marketing-specialist','Digital Marketing Specialist','أخصائي تسويق رقمي','Marketing','التسويق','Mid-level','متوسط','Full-time','دوام كامل','Amman, Jordan','عمّان، الأردن','Grow our digital presence and support lead generation across channels.','تطوير حضورنا الرقمي ودعم توليد العملاء المحتملين عبر القنوات.',
 ARRAY['Plan and run paid and organic campaigns.','Manage website content and SEO performance.','Report on channel performance and conversion.'],
 ARRAY['تخطيط وتنفيذ الحملات المدفوعة والعضوية.','إدارة محتوى الموقع وأداء تحسين محركات البحث.','إعداد تقارير أداء القنوات ومعدلات التحويل.'],
 ARRAY['Bachelor degree in Marketing or related field.','3+ years in digital marketing, preferably in financial services.'],
 ARRAY['بكالوريوس تسويق أو ما يعادله.','خبرة 3 سنوات فأكثر في التسويق الرقمي ويفضل في القطاع المالي.'],
 ARRAY['Meta & Google Ads','Analytics','Content creation'],
 ARRAY['إعلانات ميتا وجوجل','التحليلات','صناعة المحتوى'],
 '2026-09-15',3),
('it-support-engineer','IT Support Engineer','مهندس دعم تكنولوجيا المعلومات','IT & Digital','تكنولوجيا المعلومات','Entry-level','مبتدئ','Full-time','دوام كامل','Amman, Jordan','عمّان، الأردن','Keep our people productive with reliable systems and fast support.','ضمان استمرارية العمل عبر أنظمة موثوقة ودعم فني سريع.',
 ARRAY['Provide first and second line support to all departments.','Maintain endpoints, network devices and user accounts.','Document incidents and improve support procedures.'],
 ARRAY['تقديم الدعم الفني من المستوى الأول والثاني لجميع الأقسام.','صيانة الأجهزة وأجهزة الشبكة وحسابات المستخدمين.','توثيق الحوادث وتحسين إجراءات الدعم.'],
 ARRAY['Bachelor degree in Computer Science / IT.','0-2 years of experience; fresh graduates are welcome.'],
 ARRAY['بكالوريوس علم حاسوب أو تكنولوجيا معلومات.','خبرة 0-2 سنة، والخريجون الجدد مرحّب بهم.'],
 ARRAY['Windows & networking','Troubleshooting','Teamwork'],
 ARRAY['ويندوز والشبكات','حل المشكلات','العمل الجماعي'],
 '2026-09-20',4);
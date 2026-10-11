
CREATE TABLE public.insurance_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  sort_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  icon text NOT NULL DEFAULT 'Shield',
  emoji text DEFAULT '🛡️',
  image_url text,
  tone text NOT NULL DEFAULT 'from-[oklch(0.6_0.18_258)] to-[oklch(0.45_0.18_268)]',
  title_en text NOT NULL,
  title_ar text NOT NULL,
  summary_en text NOT NULL DEFAULT '',
  summary_ar text NOT NULL DEFAULT '',
  overview_en text NOT NULL DEFAULT '',
  overview_ar text NOT NULL DEFAULT '',
  covered_en text[] NOT NULL DEFAULT '{}',
  covered_ar text[] NOT NULL DEFAULT '{}',
  why_en text NOT NULL DEFAULT '',
  why_ar text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.insurance_services TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.insurance_services TO authenticated;
GRANT ALL ON public.insurance_services TO service_role;

ALTER TABLE public.insurance_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active services"
ON public.insurance_services FOR SELECT
USING (active = true);

CREATE POLICY "Admins can read all services"
ON public.insurance_services FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert services"
ON public.insurance_services FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update services"
ON public.insurance_services FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete services"
ON public.insurance_services FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER insurance_services_set_updated_at
BEFORE UPDATE ON public.insurance_services
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.insurance_services
  (slug, sort_order, icon, emoji, tone, title_en, title_ar, summary_en, summary_ar, overview_en, overview_ar, covered_en, covered_ar, why_en, why_ar)
VALUES
('motor', 1, 'Car', '🚗', 'from-[oklch(0.6_0.18_258)] to-[oklch(0.45_0.18_268)]',
 'Motor Insurance', 'تأمين المركبات',
 'Comprehensive and third-party plans with rapid claims service.',
 'تغطية شاملة وضد الغير مع خدمة مطالبات سريعة.',
 'United Insurance offers comprehensive motor insurance covering own damage of the insured vehicle along with compulsory Third Party Insurance as regulated in Jordan. Additional coverages extend protection for drivers, passengers, and vehicles travelling across Jordan and neighbouring countries. Compulsory Third Party Liability (TPL) and Orange Cards for Arab-country travel are also available.',
 'تقدم المتحدة للتأمين تغطية شاملة للمركبات تشمل الأضرار التي تلحق بالمركبة المؤمَّنة إلى جانب التأمين الإلزامي ضد الغير وفقاً للأنظمة المعمول بها في الأردن. كما تمتد التغطيات الإضافية لتشمل السائقين والركاب والمركبات أثناء التنقل في الأردن والدول المجاورة، وتتوفر أيضاً وثيقة المسؤولية الإلزامية تجاه الغير والبطاقة البرتقالية للسفر بين الدول العربية.',
 ARRAY['Own damage of insured vehicle (Comprehensive)','Third Party Compulsory Insurance (TPL) — bodily injury & property damage','Medical expenses and accidental death of owner/driver','Road assistance in Jordan, Lebanon, Turkey, and all GCC countries','Accidents caused by unknown third-party drivers (100% covered, police report required)','Agency repair based on vehicle value and year of manufacture','Orange Card — third-party liability coverage in Arab countries outside Jordan'],
 ARRAY['الأضرار الذاتية للمركبة المؤمَّنة (شامل)','التأمين الإلزامي ضد الغير — إصابات بدنية وأضرار مادية','النفقات الطبية والوفاة العرضية للمالك والسائق','المساعدة على الطريق في الأردن ولبنان وتركيا ودول الخليج','تغطية كاملة للحوادث الناتجة عن سائقين مجهولين (بتقرير شرطة)','الإصلاح لدى الوكالة بحسب قيمة المركبة وسنة الصنع','البطاقة البرتقالية — تغطية المسؤولية ضد الغير في الدول العربية خارج الأردن'],
 'Comprehensive motor coverage with road assistance across the region, fast agency repairs, and 100% cover for accidents with unknown drivers (subject to a police report) for vehicles valued JD 30,000 and above.',
 'تغطية شاملة للمركبات مع مساعدة على الطريق في عدة دول، إصلاح سريع لدى الوكالة، وتغطية 100% لحوادث السائقين المجهولين (بتقرير شرطة) للمركبات بقيمة 30,000 دينار فأكثر.'),

('medical', 2, 'HeartPulse', '🏥', 'from-[oklch(0.65_0.2_15)] to-[oklch(0.5_0.18_350)]',
 'Medical Insurance', 'التأمين الطبي',
 'Direct billing across a network of leading hospitals and clinics.',
 'فوترة مباشرة عبر شبكة من المستشفيات والعيادات الرائدة.',
 'Medical Insurance covers the cost of an insured individual''s medical and surgical expenses. Depending on the type of coverage, either the insurer makes payments directly to the provider, or the insured pays out of pocket and receives reimbursement. United Insurance offers tailor-made coverages for both group and individual policies, designed to meet the specific needs of each customer.',
 'يغطي التأمين الطبي تكاليف النفقات الطبية والجراحية للمؤمَّن عليه. وبحسب نوع التغطية، تتم تسوية المدفوعات إما مباشرة مع مزوّد الخدمة أو من خلال تعويض المؤمَّن لاحقاً. تقدم المتحدة للتأمين تغطيات مصممة خصيصاً للأفراد والمجموعات بما يلبي احتياجات كل عميل.',
 ARRAY['Flexible cover tailored to your needs','Access to a 24-hour helpline for employees','Full distribution of preferred doctors through NatHealth Network','Hospitalization coverage','In-patient coverage','In/Out-patient coverages'],
 ARRAY['تغطية مرنة مصممة وفق احتياجاتك','خط دعم على مدار 24 ساعة للموظفين','شبكة واسعة من الأطباء المعتمدين عبر شبكة نات هيلث','تغطية الاستشفاء داخل المستشفيات','تغطية العلاج الداخلي','تغطيات العلاج الداخلي والخارجي'],
 'A wide range of tailor-made coverages are provided under Medical Insurance for both group and individual policies, designed around the needs of each customer.',
 'نقدم تحت التأمين الطبي مجموعة واسعة من التغطيات المصممة خصيصاً لوثائق الأفراد والمجموعات بحسب احتياجات كل عميل.'),

('life', 3, 'Sparkles', '🛡️', 'from-[oklch(0.7_0.18_160)] to-[oklch(0.5_0.16_190)]',
 'Life Insurance', 'تأمين الحياة',
 'Long-term protection that safeguards the people you love.',
 'حماية طويلة الأمد للأشخاص الذين تحبهم.',
 'Term life insurance provides coverage for the policy holder by insuring them for a sum assured at a fixed premium for a limited period determined by the policy holder. The insured chooses a lump-sum amount to be paid to the beneficiaries specified in the policy in the event of death due to any cause. A Group Life policy is also available, allowing companies to insure all their employees 24 hours a day, worldwide, under a single policy.',
 'تأمين الحياة المؤقت يوفر تغطية لحامل الوثيقة بمبلغ تأمين محدد مقابل أقساط ثابتة لفترة يحددها حامل الوثيقة. يختار المؤمَّن مبلغاً مقطوعاً يُدفع للمستفيدين المحددين في الوثيقة في حال الوفاة لأي سبب. كما تتوفر وثيقة تأمين الحياة الجماعي التي تتيح للشركات تأمين جميع موظفيها على مدار 24 ساعة في جميع أنحاء العالم بوثيقة واحدة.',
 ARRAY['Individual Term Life — lump sum to beneficiaries on death from any cause','Group Life — covers all employees 24/7 worldwide under one policy','Permanent Total Disablement (PTD) — sum assured paid to the insured','Permanent Partial Disablement (PPD) — percentage paid per the Continental Scale','Accidental Death Benefit — double the sum assured if death is accidental','Tailored covers for corporates as an employee loyalty benefit'],
 ARRAY['تأمين الحياة الفردي المؤقت — مبلغ مقطوع للمستفيدين عند الوفاة لأي سبب','تأمين الحياة الجماعي — تغطية الموظفين 24/7 حول العالم بوثيقة واحدة','العجز الكلي الدائم (PTD) — يُدفع مبلغ التأمين للمؤمَّن عليه','العجز الجزئي الدائم (PPD) — نسبة من المبلغ بحسب الجدول القاري','تعويض الوفاة العرضية — ضعف المبلغ المؤمَّن في حال الوفاة بحادث','تغطيات مصممة للشركات كحافز لتعزيز ولاء الموظفين'],
 'United Insurance has protected families and corporates for decades, with flexible individual and group life policies and optional disability and accidental death riders.',
 'تحمي المتحدة للتأمين العائلات والشركات منذ عقود، مع وثائق مرنة للأفراد والمجموعات وميزات إضافية اختيارية للعجز والوفاة العرضية.'),

('travel', 4, 'Plane', '✈️', 'from-[oklch(0.7_0.16_220)] to-[oklch(0.5_0.18_250)]',
 'Travel Insurance', 'تأمين السفر',
 'Worldwide assistance, medical care, and trip protection.',
 'مساعدة عالمية ورعاية طبية وحماية الرحلة.',
 'Travel Insurance covers worldwide emergency medical expenses, hospitalization abroad, and accidental death or permanent disability. It provides immediate material assistance following any unforeseen event occurring during a planned journey outside the insured''s usual country of residence. Certificates can be issued within minutes upon receipt of basic traveller details.',
 'يغطي تأمين السفر النفقات الطبية الطارئة والاستشفاء في الخارج والوفاة العرضية أو العجز الدائم في جميع أنحاء العالم. ويقدم مساعدة مادية فورية إثر أي حدث غير متوقع خلال رحلة مخطط لها خارج بلد الإقامة المعتاد للمؤمَّن. تُصدر الشهادات خلال دقائق عند استلام بيانات المسافر الأساسية.',
 ARRAY['Medical expenses & hospitalization abroad (up to $50,000 / €30,000 Schengen)','Transport or repatriation in case of illness or accident','Emergency dental care','Repatriation of mortal remains','Emergency return home following death of a close family member','Loss of passport, driving licence, or national ID abroad ($300)','Compensation for in-flight loss of checked-in baggage ($500)','Compensation for delayed baggage arrival ($300)'],
 ARRAY['النفقات الطبية والاستشفاء في الخارج (حتى 50,000 دولار / 30,000 يورو لشينغن)','نقل أو إعادة المؤمَّن في حال المرض أو الحادث','علاج الأسنان الطارئ','إعادة رفات المتوفى','العودة الطارئة إلى الوطن بعد وفاة أحد أفراد الأسرة المقربين','فقدان جواز السفر أو رخصة القيادة أو الهوية في الخارج (300 دولار)','تعويض فقدان الأمتعة المسجلة على متن الطائرة (500 دولار)','تعويض تأخر وصول الأمتعة (300 دولار)'],
 'Coverage is compliant with EU/Schengen requirements and accepted by their embassies. Certificates are issued within minutes with just a passport copy, travel details, and a phone number.',
 'التغطية مطابقة لمتطلبات الاتحاد الأوروبي وشينغن ومقبولة من سفاراتها. تُصدر الشهادات خلال دقائق بتزويدنا بصورة جواز السفر وتفاصيل الرحلة ورقم هاتف.'),

('marine', 5, 'Anchor', '⚓', 'from-[oklch(0.55_0.15_230)] to-[oklch(0.35_0.12_260)]',
 'Marine Insurance', 'التأمين البحري',
 'Cargo, hull, and liability cover for maritime trade.',
 'تغطية البضائع والهياكل والمسؤوليات للتجارة البحرية.',
 'United Insurance provides a wide range of marine insurance coverage for marine risks. Our professional team delivers coverage at competitive rates and offers valuable consultancy on risk management. Products span cargo, hull & machinery, marine liabilities, and aviation insurance.',
 'تقدم المتحدة للتأمين مجموعة واسعة من تغطيات التأمين البحري للمخاطر البحرية. يقدم فريقنا المحترف تغطية بأسعار تنافسية واستشارات قيمة في إدارة المخاطر. وتشمل منتجاتنا البضائع، الهياكل والآلات، المسؤوليات البحرية، وتأمين الطيران.',
 ARRAY['Marine Cargo: sea (vessels), air freight, land (trucks/rail), war & strikes','Hull & Machinery: yachts, commercial, passenger and fishing vessels, tugs & barges, oil & gas tankers, bulk carriers','Marine Liabilities: road haulier''s & forwarder''s liability, stevedores, marine operators','Passenger, crew & shipowner''s liabilities, Protection & Indemnity (P&I)','Aviation: airlines & major risks, aerospace insurance','General aviation insurance'],
 ARRAY['البضائع البحرية: بحري (سفن)، شحن جوي، بري (شاحنات/قطارات)، الحرب والإضرابات','الهياكل والآلات: اليخوت والسفن التجارية وسفن الركاب وسفن الصيد والقاطرات وناقلات النفط والغاز وسفن الشحن السائبة','المسؤوليات البحرية: مسؤولية الناقل البري والمخلِّص والمناولة ومشغّلي الموانئ','مسؤوليات الركاب والطاقم ومالكي السفن، الحماية والتعويض (P&I)','تأمين الطيران: شركات الطيران والمخاطر الكبرى وتأمين الفضاء الجوي','تأمين الطيران العام'],
 'Our professional team offers coverage at competitive rates and provides valuable consultancy on risk management for complex maritime and aviation exposures.',
 'يقدم فريقنا المحترف تغطية بأسعار تنافسية واستشارات قيمة في إدارة المخاطر للتعرضات البحرية وتعرضات الطيران المعقدة.'),

('fire', 6, 'Flame', '🔥', 'from-[oklch(0.72_0.18_55)] to-[oklch(0.55_0.2_30)]',
 'Fire & General', 'الحريق والحوادث العامة',
 'Property, fire, and general accident protection for business.',
 'حماية الممتلكات والحريق والحوادث العامة للأعمال.',
 'Fire & General Accidents Insurance covers private and commercial properties including flats, houses, offices, warehouses, and department stores. The policy can be extended to cover lightning, explosions, special perils, and property all-risks. It also encompasses general accident lines, personal insurance, and engineering insurance for a comprehensive property and liability protection package.',
 'يغطي تأمين الحريق والحوادث العامة الممتلكات الخاصة والتجارية، بما فيها الشقق والمنازل والمكاتب والمستودعات والمتاجر الكبرى. ويمكن توسيع الوثيقة لتشمل الصواعق والانفجارات والأخطار الخاصة وتأمين جميع أخطار الممتلكات. كما تشمل خطوط الحوادث العامة والتأمين الشخصي والتأمين الهندسي لتقديم باقة شاملة لحماية الممتلكات والمسؤوليات.',
 ARRAY['Fire — lightning, explosions, fire & special perils, property all risks','Money insurance — cash in safe, cash in transit, fidelity guarantee','Third-party liability — material damage & bodily injury','Plate glass insurance — all types of glass','Bankers Blanket Bond — fraud, computer crimes, directors & officers liability','Personal accidents — death, bodily injury, and medical expenses from accidents','Workmen compensation for workers outside the social security scheme','Engineering — contractors all risks, machinery breakdown, electronic equipment, boilers & pressure vessels'],
 ARRAY['الحريق — الصواعق والانفجارات والأخطار الخاصة وجميع أخطار الممتلكات','تأمين النقود — النقود في الخزينة والنقود أثناء النقل وضمان الأمانة','المسؤولية تجاه الغير — أضرار مادية وإصابات جسدية','تأمين الزجاج — جميع أنواع الزجاج','وثيقة البنوك الشاملة — الاحتيال وجرائم الحاسوب ومسؤولية المدراء والمسؤولين','الحوادث الشخصية — الوفاة والإصابات والنفقات الطبية الناتجة عن الحوادث','تأمين العمال غير المشمولين بالضمان الاجتماعي','التأمين الهندسي — جميع أخطار المقاولين، عطل الآلات، المعدات الإلكترونية، المراجل وأوعية الضغط'],
 'A comprehensive property, liability and engineering package tailored to homes, offices, warehouses and industrial operations across Jordan.',
 'باقة شاملة للممتلكات والمسؤوليات والتأمين الهندسي مصممة للمنازل والمكاتب والمستودعات والعمليات الصناعية في الأردن.');

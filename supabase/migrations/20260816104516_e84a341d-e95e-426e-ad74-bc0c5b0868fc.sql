
-- Merge senior management into executive management and reorder to match the official site
UPDATE public.team_members SET section='executive', sort_order = 100 + sort_order WHERE section='senior';

UPDATE public.team_members SET sort_order = v.ord FROM (VALUES
 ('Mr. Ziad Raouf AbuJaber',1),('Eng. Bassel Mousa Ayoubi',2),('Mr. Marwan Raouf AbuJaber',3),
 ('Mr. Zaid Kamal Asfour',4),('Mr. Zaid Farid Nassif',5),('Mr. Essam Mohammad Fakhereddin',6),
 ('Mr. Ihab Ghazi Saadi',7),('Mr. Abdelnour Nayef Abdelnour',8),('H.E. Eng. Amer Al Hadidi',9),
 ('Mr. Samer Abdalqader Alqadi',10)
) AS v(nm,ord) WHERE public.team_members.section='board' AND public.team_members.name_en = v.nm;

UPDATE public.team_members SET sort_order = v.ord FROM (VALUES
 ('Raed Khalil Haddadin',1),('Kevork Qlanjiyan',2),('Makram Fakhoury',3),('Nu''man Musa',4),
 ('Enad Dababneh',5),('Sawsan Nazha',6),('Issa Al-Safadi',7),('Abeer Al-Dawoud',8),
 ('Abdelhameed Abu Shahout',9),('Ibrahim Dababneh',10),('Mahmoud Nassar',11),('Ahlam Al Azzeh',12)
) AS v(nm,ord) WHERE public.team_members.section='executive' AND public.team_members.name_en = v.nm;

-- Align titles with the official site wording
UPDATE public.team_members SET role_en='Senior Manager - Head of Motor Underwriting Department' WHERE name_en='Sawsan Nazha';
UPDATE public.team_members SET role_en='Senior Manager - Head of Legal Department' WHERE name_en='Issa Al-Safadi';
UPDATE public.team_members SET role_en='Senior Manager - Head of General Insurance & Reinsurance Department' WHERE name_en='Abeer Al-Dawoud';
UPDATE public.team_members SET role_en='Senior Manager - Head of Marine Insurance Department' WHERE name_en='Abdelhameed Abu Shahout';
UPDATE public.team_members SET role_en='Senior Manager - Head of Motor Claims Department' WHERE name_en='Ibrahim Dababneh';
UPDATE public.team_members SET role_en='Manager - Head of Human Resources & Administration Department' WHERE name_en='Ahlam Al Azzeh';
UPDATE public.team_members SET role_en='Manager - Head of Risk Management & Compliance Department' WHERE name_en='Mahmoud Nassar';

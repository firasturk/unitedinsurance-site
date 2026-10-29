import { motion } from "framer-motion";
import { Pic } from "@/components/site/Pic";
import { useQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";

const teamRoute = getRouteApi("/team");
import { useServerFn } from "@tanstack/react-start";
import { SiteLayout } from "@/components/site/Layout";
import { PageHero } from "@/components/site/PageHero";
import { useLang } from "@/lib/i18n";
import { listTeam, type TeamRow } from "@/lib/public.functions";

// Board members are listed by name only (no portraits); executive management keeps photos.
const showPhoto = (m: TeamRow) => m.section !== "board";

function MemberCard({ m, i, lang }: { m: TeamRow; i: number; lang: "en" | "ar" }) {
  const name = lang === "ar" ? m.name_ar : m.name_en;
  const role = lang === "ar" ? m.role_ar : m.role_en;
  const withPhoto = showPhoto(m);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: (i % 6) * 0.06 }}
      className={
        withPhoto
          ? "rounded-3xl bg-card border border-border p-6 shadow-soft hover:shadow-elevated transition h-full flex flex-col"
          : "rounded-3xl bg-card border border-border p-7 shadow-soft hover:shadow-elevated transition h-full flex flex-col items-center justify-center text-center min-h-[9rem]"
      }
    >
      {withPhoto ? (
        <>
          <div className="aspect-square rounded-2xl overflow-hidden mb-5 relative bg-gradient-to-br from-[var(--royal)]/15 to-[var(--royal)]/5 shrink-0">
            {m.photo_url ? (
              <Pic src={m.photo_url} alt={name} loading="lazy" className="absolute inset-0 h-full w-full object-cover object-[center_20%]" />
            ) : (
              <div className="absolute inset-0 grid place-items-center">
                <div className="text-6xl font-bold text-[var(--royal)]/40 select-none">
                  {m.name_en.replace(/^(Mr\.|Eng\.|H\.E\.) ?/, "").trim().charAt(0)}
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <div className="font-semibold text-base leading-snug line-clamp-2 min-h-[2.75rem]">{name}</div>
            <div className="text-sm text-muted-foreground mt-1 leading-snug min-h-[2.4rem]">{role}</div>
          </div>
        </>
      ) : (
        <>
          <div className="font-semibold text-base sm:text-lg leading-snug line-clamp-3 min-h-[3.1rem]">{name}</div>
          <div className="text-sm text-muted-foreground mt-1.5 leading-snug line-clamp-2 min-h-[2.4rem]">{role}</div>
        </>
      )}
    </motion.div>
  );
}

// C-level members (Chief …) form their own centered row above the rest.
const isChief = (m: TeamRow) => /^chief\b/i.test((m.role_en || "").trim());

function Section({ title, members, lang, lead }: { title: string; members: TeamRow[]; lang: "en" | "ar"; lead?: TeamRow }) {
  if (!members.length && !lead) return null;

  const chiefs = members.filter(isChief);
  const rest = members.filter((m) => !isChief(m));

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-6">
        {title.trim() && (
          <div className="flex items-end justify-between mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold">{title}</h2>
          </div>
        )}

        {/* The lead (e.g. the chairman) is the same card as everyone else, centred on its own row just above the grid. */}
        {lead && (
          <div className="flex justify-center mb-5">
            <div className="w-full sm:w-[calc(50%-0.625rem)] md:w-[calc(33.333%-0.8333rem)] lg:w-[calc(25%-0.9375rem)]">
              <MemberCard m={lead} i={0} lang={lang} />
            </div>
          </div>
        )}

        {/* Chiefs (C-level) sit on their own row, each a third of the narrower band wide and centred
            whatever their number — a 3-column grid would leave two of them hugging one side. */}
        {chiefs.length > 0 && (
          <div className="mx-auto mb-5 flex w-full max-w-4xl flex-wrap justify-center gap-5">
            {chiefs.map((m, i) => (
              <div key={m.id} className="w-full sm:w-[calc(33.333%-0.8333rem)]">
                <MemberCard m={m} i={i} lang={lang} />
              </div>
            ))}
          </div>
        )}

        {rest.length > 0 && (
          <div className="flex flex-wrap justify-center gap-5">
            {rest.map((m, i) => (
              <div
                key={m.id}
                className="w-full sm:w-[calc(50%-0.625rem)] md:w-[calc(33.333%-0.8333rem)] lg:w-[calc(25%-0.9375rem)]"
              >
                <MemberCard m={m} i={i + chiefs.length} lang={lang} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function FeaturedMember({ m, lang }: { m: TeamRow; lang: "en" | "ar" }) {
  const name = lang === "ar" ? m.name_ar : m.name_en;
  const role = lang === "ar" ? m.role_ar : m.role_en;
  const withPhoto = showPhoto(m);

  return (
    <section className="pt-16 pb-6">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={
              withPhoto
                ? "w-full max-w-xs rounded-3xl bg-card border border-border p-6 shadow-soft"
                : "w-full max-w-xl rounded-3xl bg-card border border-[var(--royal)]/25 p-8 sm:p-10 shadow-soft text-center"
            }
          >
            {withPhoto ? (
              <>
                <div className="aspect-square rounded-2xl overflow-hidden mb-6 relative bg-gradient-to-br from-[var(--royal)]/15 to-[var(--royal)]/5">
                  {m.photo_url ? (
                    <Pic src={m.photo_url} alt={name} loading="lazy" className="absolute inset-0 h-full w-full object-cover object-top" />
                  ) : (
                    <div className="absolute inset-0 grid place-items-center">
                      <div className="text-7xl font-bold text-[var(--royal)]/40 select-none">
                        {m.name_en.replace(/^(Mr\.|Eng\.|H\.E\.) ?/, "").trim().charAt(0)}
                      </div>
                    </div>
                  )}
                </div>
                <div className="font-semibold text-xl leading-snug text-center">{name}</div>
                <div className="text-base text-muted-foreground mt-2 leading-snug text-center">{role}</div>
              </>
            ) : (
              <>
                {/* Only a step above the other board cards (text-base sm:text-lg), not a headline */}
                <div className="font-bold text-lg sm:text-xl leading-snug text-center">{name}</div>
                <div className="text-sm text-muted-foreground mt-2 leading-snug text-center">{role}</div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function TeamSectionPage({
  eyebrow,
  title,
  subtitle,
  filter,
}: {
  eyebrow?: { en: string; ar: string };
  title?: { en: string; ar: string };
  subtitle: { en: string; ar: string };
  filter: "all" | "board" | "executive";
}) {
  const { lang } = useLang();
  const L = (pair?: { en: string; ar: string }) => (pair ? (lang === "ar" ? pair.ar : pair.en) : undefined);
  const initial = teamRoute.useLoaderData();
  const fetchTeam = useServerFn(listTeam);
  const { data = [], isLoading } = useQuery({
    queryKey: ["pub-team"],
    queryFn: () => fetchTeam(),
    initialData: initial.team,
    staleTime: 300_000,
  });

  const board = data.filter((m) => m.section === "board");
  const executive = data.filter((m) => m.section === "executive" || m.section === "senior");

  const chairman = board.find(
    (m) =>
      m.role_en === "Chairman" ||
      m.role_ar === "رئيس مجلس الإدارة" ||
      /ziad|زياد/i.test(m.name_en + " " + m.name_ar)
  );
  const boardRest = board.filter((m) => m.id !== chairman?.id);

  const ceo = executive.find(
    (m) =>
      m.role_en === "Chief Executive Officer" ||
      m.role_ar === "الرئيس التنفيذي" ||
      /raed|رائد/i.test(m.name_en + " " + m.name_ar)
  );
  const executiveRest = executive.filter((m) => m.id !== ceo?.id);

  return (
    <SiteLayout>
      <PageHero art="team" eyebrow={L(eyebrow)} title={L(title)} subtitle={L(subtitle)} />
      {isLoading ? (
        <div className="py-24 text-center text-muted-foreground">Loading…</div>
      ) : (
        <>
          {(filter === "all" || filter === "board") && (
            <>
              <Section
                title={"\n"}
                lead={filter === "board" ? chairman : undefined}
                members={filter === "board" ? boardRest : board}
                lang={lang}
              />
            </>
          )}
          {(filter === "all" || filter === "executive") && (
            <>
              {filter === "all" && <div className="border-t border-border" />}
              {ceo && filter === "executive" && <FeaturedMember m={ceo} lang={lang} />}
              <Section
                title={"\n"}
                members={filter === "executive" ? executiveRest : executive}
                lang={lang}
              />
            </>
          )}
        </>
      )}
    </SiteLayout>
  );
}

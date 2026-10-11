import { useEffect, useRef, useState } from "react";

export type BannerArtVariant =
  | "reports"
  | "insurance"
  | "about"
  | "news"
  | "careers"
  | "contact"
  | "governance"
  | "complaints"
  | "agents"
  | "team";

/** Each variant is a list of path `d` strings drawn in a 200x200 viewBox. */
const ART: Record<BannerArtVariant, string[]> = {
  reports: [
    "M40 24h78l30 30v110a10 10 0 0 1-10 10H40a10 10 0 0 1-10-10V34a10 10 0 0 1 10-10Z",
    "M118 24v30h30",
    "M56 148v-34",
    "M84 148v-58",
    "M112 148v-22",
    "M140 148v-44",
  ],
  insurance: [
    "M100 18 34 46v50c0 42 28 66 66 82 38-16 66-40 66-82V46L100 18Z",
    "M72 100l20 20 40-42",
  ],
  about: [
    "M20 176V70l52-32 52 32v106",
    "M124 176V96l56 22v58",
    "M44 96h20",
    "M80 96h20",
    "M44 126h20",
    "M80 126h20",
    "M44 156h20",
    "M80 156h20",
    "M146 128h14",
    "M146 152h14",
  ],
  news: [
    "M28 44h116a10 10 0 0 1 10 10v106a14 14 0 0 1-14 14H36a14 14 0 0 1-14-14V44Z",
    "M154 74h24v86a14 14 0 0 1-14 14",
    "M46 68h56v34H46z",
    "M118 68h20",
    "M118 86h20",
    "M118 102h20",
    "M46 124h92",
    "M46 144h64",
  ],
  careers: [
    "M26 62h148a10 10 0 0 1 10 10v88a10 10 0 0 1-10 10H26a10 10 0 0 1-10-10V72a10 10 0 0 1 10-10Z",
    "M76 62V44a12 12 0 0 1 12-12h24a12 12 0 0 1 12 12v18",
    "M16 108c30 14 58 20 84 20s54-6 84-20",
    "M88 112h24v18H88z",
  ],
  contact: [
    "M100 16c-30 0-54 24-54 54 0 40 54 96 54 96s54-56 54-96c0-30-24-54-54-54Z",
    "M100 52a18 18 0 1 0 0 36 18 18 0 0 0 0-36Z",
    "M36 174h128",
  ],
  governance: [
    "M100 12 24 56h152L100 12Z",
    "M46 72v84",
    "M80 72v84",
    "M120 72v84",
    "M154 72v84",
    "M26 168h148",
  ],
  complaints: [
    "M34 34h132a14 14 0 0 1 14 14v76a14 14 0 0 1-14 14H92l-40 32v-32H34a14 14 0 0 1-14-14V48a14 14 0 0 1 14-14Z",
    "M78 74h64",
    "M78 100h40",
  ],
  agents: [
    "M100 22a26 26 0 1 0 0 52 26 26 0 0 0 0-52Z",
    "M32 118a22 22 0 1 0 0 44 22 22 0 0 0 0-44Z",
    "M168 118a22 22 0 1 0 0 44 22 22 0 0 0 0-44Z",
    "M100 74v46",
    "M96 122 50 132",
    "M104 122l46 10",
  ],
  team: [
    "M84 34a28 28 0 1 0 0 56 28 28 0 0 0 0-56Z",
    "M24 168c0-32 26-56 60-56s60 24 60 56",
    "M150 60a20 20 0 1 0 0 40 20 20 0 0 0 0-40Z",
    "M158 168c0-24 12-42 34-48",
  ],
};

export function BannerArt({ variant }: { variant: BannerArtVariant }) {
  const ref = useRef<SVGSVGElement | null>(null);
  const [draw, setDraw] = useState(false);
  const [lengths, setLengths] = useState<number[]>([]);
  const paths = ART[variant];

  // Measure each path so the dash pattern matches its real length (no stray dashes).
  // Keep the SVG invisible until measurement finishes to avoid any initial flicker.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const nodes = Array.from(el.querySelectorAll("path"));
    setLengths(nodes.map((n) => Math.ceil(n.getTotalLength()) + 2));
  }, [variant]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setDraw(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          // Wait for the next paint so the measured dasharray is already applied.
          requestAnimationFrame(() => setDraw(true));
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -5% 0px" },
    );
    io.observe(el);
    const fallback = window.setTimeout(() => setDraw(true), 2600);
    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  const ready = lengths.length === paths.length && lengths.length > 0;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-y-0 end-0 w-[34%] max-w-[420px] hidden sm:block"
    >
      <svg
        ref={ref}
        viewBox="0 0 200 200"
        className="h-full w-full translate-x-[10%] rtl:-translate-x-[10%] scale-[1.25] text-white/85"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.9}
        strokeLinecap="round"
        strokeLinejoin="round"
        preserveAspectRatio="xMidYMid meet"
      >
        {paths.map((d, i) => {
          const len = lengths[i] ?? 1000;
          const visible = ready && draw;
          return (
            <path
              key={i}
              d={d}
              style={{
                strokeDasharray: len,
                strokeDashoffset: visible ? 0 : len,
                transition: `stroke-dashoffset 3.8s cubic-bezier(0.22, 0.61, 0.36, 1)`,
                transitionDelay: `${i * 0.24}s`,
                willChange: "stroke-dashoffset",
              }}
            />
          );
        })}
      </svg>
    </div>
  );
}

import { useEffect, useRef, useState, type ImgHTMLAttributes } from "react";

// Drop-in <img> that serves a WebP version of static images under /media when one exists.
// Every PNG/JPG in public/media has a same-name .webp sibling (generated at build prep time),
// so the <source> never 404s; browsers without WebP support fall back to the original file.
const STATIC_RASTER = /^\/media\/([^/?#]+)\.(png|jpe?g)$/i;

export function webpFor(src: string | null | undefined): string | null {
  if (!src) return null;
  const m = src.match(STATIC_RASTER);
  return m ? `/media/${m[1]}.webp` : null;
}

export function Pic({ src, alt, loading, className, ...rest }: ImgHTMLAttributes<HTMLImageElement> & { src: string; alt: string }) {
  const webp = webpFor(src);
  // Lazy images fade in once their bytes arrive instead of popping into view mid-scroll.
  // (Eager images — the hero — render immediately so they stay the LCP element.)
  const lazy = loading === "lazy";
  const ref = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(!lazy);
  useEffect(() => {
    if (lazy && ref.current?.complete) setLoaded(true);
  }, [lazy]);

  const img = (
    <img
      ref={ref}
      src={src}
      alt={alt}
      loading={loading}
      decoding="async"
      className={`${className ?? ""} ${lazy ? "pic-fade" : ""}`.trim()}
      data-loaded={lazy ? String(loaded) : undefined}
      onLoad={lazy ? () => setLoaded(true) : undefined}
      {...rest}
    />
  );
  if (!webp) return img;
  // display: contents — the <picture> wrapper takes no box of its own, so the <img>'s
  // sizing classes (h-full / w-full / object-cover) keep working against the original parent.
  return (
    <picture className="contents">
      <source type="image/webp" srcSet={webp} />
      {img}
    </picture>
  );
}

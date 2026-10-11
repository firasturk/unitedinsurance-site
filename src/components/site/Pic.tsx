import type { ImgHTMLAttributes } from "react";

// Drop-in <img> that serves a WebP version of static images under /media when one exists.
// Every PNG/JPG in public/media has a same-name .webp sibling (generated at build prep time),
// so the <source> never 404s; browsers without WebP support fall back to the original file.
const STATIC_RASTER = /^\/media\/([^/?#]+)\.(png|jpe?g)$/i;

export function webpFor(src: string | null | undefined): string | null {
  if (!src) return null;
  const m = src.match(STATIC_RASTER);
  return m ? `/media/${m[1]}.webp` : null;
}

export function Pic({ src, alt, ...rest }: ImgHTMLAttributes<HTMLImageElement> & { src: string; alt: string }) {
  const webp = webpFor(src);
  if (!webp) return <img src={src} alt={alt} {...rest} />;
  return (
    <picture>
      <source type="image/webp" srcSet={webp} />
      <img src={src} alt={alt} {...rest} />
    </picture>
  );
}

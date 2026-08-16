import { ImageResponse } from "next/og";

import { hero, site } from "@/content/site";

export const alt = site.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * The share card.
 *
 * Colours are the tokens' literal values because this renders through satori,
 * which resolves no CSS custom properties — there is no cascade here, only an
 * inline style tree. They are listed once, named, and must move with the
 * design system if the palette ever does.
 */
// adherence-allow: raw-hex — satori resolves no CSS variables; see above
const GROUND = "#EDF2F3";
// adherence-allow: raw-hex — satori resolves no CSS variables; see above
const INK = "#12222A";
// adherence-allow: raw-hex — satori resolves no CSS variables; see above
const TEAL = "#1F8A90";
// adherence-allow: raw-hex — satori resolves no CSS variables; see above
const MUTED = "#6B838B";

/**
 * Google serves woff2 to a modern user agent, and satori cannot read woff2.
 * An old UA string gets TTF back. If anything here fails the card still renders
 * on next/og's bundled fallback face — a plainer card beats a broken build.
 */
async function loadFont(family: string, weight: number): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}`,
      { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 6.1)" } },
    ).then((r) => r.text());

    const url = css.match(/src:\s*url\(([^)]+)\)\s*format\('truetype'\)/)?.[1];
    if (!url) return null;
    return await fetch(url).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

export default async function Image() {
  const [display, tibetan] = await Promise.all([
    loadFont("Gabarito", 800),
    loadFont("Noto+Serif+Tibetan", 500),
  ]);

  const fonts = [
    display && { name: "Gabarito", data: display, weight: 800 as const, style: "normal" as const },
    tibetan && {
      name: "Noto Serif Tibetan",
      data: tibetan,
      weight: 500 as const,
      style: "normal" as const,
    },
  ].filter((f) => f !== null);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: GROUND,
          padding: 80,
          fontFamily: "Gabarito",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          {tibetan && (
            <div
              style={{
                fontFamily: "Noto Serif Tibetan",
                fontSize: 96,
                // The 2.1 leading rule holds here too: stacked marks collide without it.
                lineHeight: 2.1,
                color: INK,
              }}
            >
              {site.tibetanName}
            </div>
          )}
          <div style={{ display: "flex", fontSize: 26, color: MUTED, marginTop: -24 }}>
            {site.romanName} · {site.gloss}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 64, color: INK, letterSpacing: -1.5 }}>
            {hero.heading[0]}
          </div>
          <div style={{ display: "flex", fontSize: 64, color: TEAL, letterSpacing: -1.5 }}>
            {hero.heading[1]}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", fontSize: 30, color: INK }}>{site.name}</div>
          <div style={{ display: "flex", fontSize: 24, color: MUTED }}>{site.domain}</div>
        </div>
      </div>
    ),
    { ...size, fonts: fonts.length ? fonts : undefined },
  );
}

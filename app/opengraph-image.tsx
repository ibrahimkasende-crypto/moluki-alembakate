import { ImageResponse } from "next/og"

export const alt = "MOLUKI ALEMBAKATE"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#f3eee6",
          color: "#4c1f2c",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Georgia",
        }}
      >
        <div style={{ fontSize: 104, letterSpacing: 14, lineHeight: 0.9 }}>MOLUKI</div>
        <div style={{ fontSize: 36, letterSpacing: 16, marginTop: 18 }}>ALEMBAKATE</div>
        <div style={{ fontSize: 18, letterSpacing: 6, marginTop: 28, color: "#6f685f" }}>L&apos;élégance en mouvement.</div>
      </div>
    ),
    size,
  )
}

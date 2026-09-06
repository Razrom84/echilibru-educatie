import { ImageResponse } from "next/og";
import { BRAND_MARK_COLORS } from "@/lib/brand-mark";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const { cream, beam, fizic, mental, resurse, social } = BRAND_MARK_COLORS;

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: cream,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: 132,
            height: 132,
          }}
        >
          <div
            style={{
              display: "flex",
              width: "100%",
              height: 18,
              background: beam,
              borderRadius: 9,
            }}
          />
          <div
            style={{
              display: "flex",
              marginTop: 12,
              gap: 10,
              flexGrow: 1,
            }}
          >
            <div
              style={{
                display: "flex",
                flexGrow: 1,
                background: fizic,
                borderRadius: 8,
              }}
            />
            <div
              style={{
                display: "flex",
                flexGrow: 1,
                background: mental,
                borderRadius: 8,
              }}
            />
            <div
              style={{
                display: "flex",
                flexGrow: 1,
                background: resurse,
                borderRadius: 8,
              }}
            />
            <div
              style={{
                display: "flex",
                flexGrow: 1,
                background: social,
                borderRadius: 8,
              }}
            />
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}

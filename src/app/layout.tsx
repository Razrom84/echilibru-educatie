import type { Metadata } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import "./globals.css";

const sourceSans = Source_Sans_3({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
});

const fraunces = Fraunces({
  variable: "--font-heading",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Echilibru educație",
  description:
    "Platformă de educație în familie, în română. Banda 1–2 ani, săptămâna 1.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ro"
      className={`${sourceSans.variable} ${fraunces.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

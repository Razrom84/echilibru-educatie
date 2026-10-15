import type { Metadata } from "next";
import { MostraPage } from "@/components/joc/mostra-page";

export const metadata: Metadata = {
  title: "Jucăria · Joc · Echilibru educație",
};

export default function JocMostraPage() {
  return <MostraPage />;
}

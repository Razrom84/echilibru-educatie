import type { Metadata } from "next";
import { JocView } from "@/components/joc/joc-view";

export const metadata: Metadata = {
  title: "Joc · Echilibru educație",
};

export default function JocPage() {
  return <JocView />;
}

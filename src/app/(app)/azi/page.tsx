import { AziView } from "@/components/azi-view";
import { bucharestToday } from "@/lib/program-week";

export const dynamic = "force-dynamic";

export default function AziPage() {
  return <AziView today={bucharestToday()} />;
}

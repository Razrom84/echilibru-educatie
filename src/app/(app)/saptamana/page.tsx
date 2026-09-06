import { SaptamanaView } from "@/components/saptamana-view";
import { bucharestToday } from "@/lib/program-week";

export const dynamic = "force-dynamic";

export default function SaptamanaPage() {
  return <SaptamanaView today={bucharestToday()} />;
}

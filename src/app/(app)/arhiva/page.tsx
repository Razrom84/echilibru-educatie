import { ArhivaView } from "@/components/arhiva-view";
import { bucharestToday } from "@/lib/program-week";

export const dynamic = "force-dynamic";

export default function ArhivaPage() {
  return <ArhivaView today={bucharestToday()} />;
}

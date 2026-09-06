import { SaptamanaView } from "@/components/saptamana-view";
import { bucharestToday } from "@/lib/program-week";
import { parseWeekDayParam } from "@/lib/saptamana";

export const dynamic = "force-dynamic";

export default async function SaptamanaPage({
  searchParams,
}: {
  searchParams: Promise<{ zi?: string | string[] }>;
}) {
  const params = await searchParams;
  return (
    <SaptamanaView
      today={bucharestToday()}
      focusDay={parseWeekDayParam(params.zi)}
    />
  );
}

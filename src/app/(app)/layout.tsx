import { cookies } from "next/headers";
import { AppShell } from "@/components/app-shell";
import { parsePilotBand } from "@/lib/band-preview";
import { DEMO_COOKIE, PREVIEW_BAND_COOKIE, WEEK_COOKIE } from "@/lib/config";
import { bucharestToday, programWeekNumber } from "@/lib/program-week";
import { isProgramWeek } from "@/lib/week";

export default async function AppGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jar = await cookies();
  const isDemo = jar.get(DEMO_COOKIE)?.value === "1";
  const calendarWeek = programWeekNumber(new Date());
  const cookieWeek = Number(jar.get(WEEK_COOKIE)?.value);
  const initialWeek =
    isDemo && isProgramWeek(cookieWeek) ? cookieWeek : calendarWeek;
  const initialPreviewBand = parsePilotBand(jar.get(PREVIEW_BAND_COOKIE)?.value);

  return (
    <AppShell
      isDemo={isDemo}
      initialWeek={initialWeek}
      initialPreviewBand={initialPreviewBand}
      today={bucharestToday()}
    >
      {children}
    </AppShell>
  );
}

import { cookies } from "next/headers";
import { AppShell } from "@/components/app-shell";
import { DEMO_COOKIE, WEEK_COOKIE } from "@/lib/config";
import { programWeekNumber } from "@/lib/program-week";
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

  return (
    <AppShell isDemo={isDemo} initialWeek={initialWeek}>
      {children}
    </AppShell>
  );
}

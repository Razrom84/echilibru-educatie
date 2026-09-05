import { cookies } from "next/headers";
import { AppShell } from "@/components/app-shell";
import { DEMO_COOKIE, WEEK_COOKIE } from "@/lib/config";
import { parseProgramWeek } from "@/lib/week";

export default async function AppGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jar = await cookies();
  const isDemo = jar.get(DEMO_COOKIE)?.value === "1";
  const initialWeek = parseProgramWeek(jar.get(WEEK_COOKIE)?.value);

  return (
    <AppShell isDemo={isDemo} initialWeek={initialWeek}>
      {children}
    </AppShell>
  );
}

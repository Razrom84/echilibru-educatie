import { cookies } from "next/headers";
import { AppShell } from "@/components/app-shell";
import { DEMO_COOKIE } from "@/lib/config";

export default async function AppGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jar = await cookies();
  const isDemo = jar.get(DEMO_COOKIE)?.value === "1";

  return <AppShell isDemo={isDemo}>{children}</AppShell>;
}

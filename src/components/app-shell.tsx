"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { NavBar, SideNav } from "@/components/nav-bar";
import { ErrorState, LoadingState } from "@/components/status-blocks";
import { FamilyProvider, useFamily } from "@/lib/family-context";

function Gate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { status, error, children: kids, refresh } = useFamily();

  useEffect(() => {
    if (status !== "ready") return;
    if (kids.length === 0 && pathname !== "/onboarding") {
      router.replace("/onboarding");
    }
  }, [kids.length, pathname, router, status]);

  if (status === "loading") {
    return (
      <div className="px-4 py-8">
        <LoadingState label="Deschidem ziua…" />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="px-4 py-8">
        <ErrorState message={error ?? "Eroare necunoscută"} onRetry={() => void refresh()} />
      </div>
    );
  }

  return <>{children}</>;
}

export function AppShell({
  isDemo,
  children,
}: {
  isDemo: boolean;
  children: React.ReactNode;
}) {
  return (
    <FamilyProvider isDemo={isDemo}>
      <div className="mx-auto flex min-h-dvh w-full max-w-5xl gap-8 px-4 pb-28 pt-6 md:pb-10">
        <SideNav />
        <div className="min-w-0 flex-1">
          <AppHeader />
          <Gate>{children}</Gate>
        </div>
      </div>
      <NavBar />
    </FamilyProvider>
  );
}

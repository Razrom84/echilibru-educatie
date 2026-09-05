import { cookies } from "next/headers";
import { FamilyProvider } from "@/lib/family-context";
import { DEMO_COOKIE } from "@/lib/config";
import { OnboardingForm } from "./onboarding-form";

export default async function OnboardingPage() {
  const jar = await cookies();
  const isDemo = jar.get(DEMO_COOKIE)?.value === "1";

  return (
    <FamilyProvider isDemo={isDemo}>
      <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-5 py-10">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Primul copil
        </p>
        <h1 className="mt-2 font-heading text-4xl">Cine crește acum?</h1>
        <p className="mt-3 text-base leading-7 text-muted-foreground">
          Un părinte, câți copii vreți. Începeți cu unul — pe ceilalți îi adăugați
          din ecranul Copii.
        </p>
        <div className="mt-8">
          <OnboardingForm />
        </div>
      </main>
    </FamilyProvider>
  );
}

"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEMO_COOKIE } from "@/lib/config";
import { FamilyProvider, useFamily } from "@/lib/family-context";
import { LoadingState } from "@/components/status-blocks";

function readDemoCookie() {
  if (typeof document === "undefined") return false;
  return document.cookie.split("; ").some((row) => row.startsWith(`${DEMO_COOKIE}=1`));
}

function OnboardingForm() {
  const router = useRouter();
  const { status, children, addChild } = useFamily();
  const [name, setName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "ready" && children.length > 0) {
      router.replace("/azi");
    }
  }, [children.length, router, status]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await addChild({
        name,
        birthdate: birthdate || null,
      });
      router.replace("/azi");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nu am putut salva copilul.");
    } finally {
      setBusy(false);
    }
  }

  if (status === "loading") {
    return <LoadingState label="Pregătim familia…" />;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="child-name">Numele copilului</Label>
        <Input
          id="child-name"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="h-11"
          placeholder="ex. Ana"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="birthdate">Data nașterii (opțional)</Label>
        <Input
          id="birthdate"
          type="date"
          value={birthdate}
          onChange={(event) => setBirthdate(event.target.value)}
          className="h-11"
        />
      </div>
      <p className="text-sm leading-6 text-muted-foreground">
        Banda de vârstă pentru V1 este <strong>2–3 ani</strong>. Restul săptămânilor
        și benzilor vor veni ulterior.
      </p>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button type="submit" className="h-11 w-full text-base" disabled={busy || !name.trim()}>
        {busy ? "Salvez…" : "Începe săptămâna 1"}
      </Button>
    </form>
  );
}

export default function OnboardingPage() {
  const [isDemo] = useState(readDemoCookie);

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

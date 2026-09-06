"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingState } from "@/components/status-blocks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFamily } from "@/lib/family-context";

export function OnboardingForm() {
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
        birthdate,
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
        <Label htmlFor="birthdate">Data nașterii</Label>
        <Input
          id="birthdate"
          type="date"
          required
          value={birthdate}
          onChange={(event) => setBirthdate(event.target.value)}
          className="h-11"
        />
      </div>
      <p className="text-sm leading-6 text-muted-foreground">
        Din data de naștere, V1 pune copilul pe banda <strong>1–2 ani</strong> și
        deschide săptămâna 1 — Casa și curtea. Celelalte benzi vin ulterior.
      </p>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button
        type="submit"
        className="h-11 w-full text-base"
        disabled={busy || !name.trim() || !birthdate}
      >
        {busy ? "Salvez…" : "Începe săptămâna 1"}
      </Button>
    </form>
  );
}

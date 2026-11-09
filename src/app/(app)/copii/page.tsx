"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BirthdateField } from "@/components/birthdate-field";
import { EmptyState } from "@/components/status-blocks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { childBandLine } from "@/lib/child-line";
import { useFamily } from "@/lib/family-context";
import { CHILD_SWITCH_HREF } from "@/lib/view-week";
import { cn } from "@/lib/utils";

export default function CopiiPage() {
  const router = useRouter();
  const { children, selectedChild, selectChild, addChild } = useFamily();
  const [open, setOpen] = useState(children.length === 0);
  const [name, setName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onAdd(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await addChild({ name, birthdate });
      setName("");
      setBirthdate("");
      setOpen(false);
      router.push("/azi");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nu am putut adăuga copilul.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="space-y-5">
      <div>
        <h1 className="font-heading text-3xl">Copii</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Un părinte, mai mulți copii. Azi, săptămâna și progresul urmează copilul
          ales.
        </p>
      </div>

      {children.length === 0 ? (
        <EmptyState
          title="Niciun copil încă"
          body="Adaugă primul copil ca să vezi activitățile din săptămâna 1."
        />
      ) : (
        <ul className="space-y-2">
          {children.map((child) => {
            const active = selectedChild?.id === child.id;
            return (
              <li key={child.id}>
                <Link
                  href={CHILD_SWITCH_HREF}
                  onClick={() => {
                    void selectChild(child.id);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left",
                    active
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:bg-muted",
                  )}
                >
                  <span>
                    <span className="block font-heading text-xl">{child.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {childBandLine(child.age_band, child.birthdate)}
                    </span>
                  </span>
                  <span className="text-sm font-medium text-primary">
                    {active ? "activ" : "alege"}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      {open ? (
        <form onSubmit={onAdd} className="space-y-3 rounded-2xl border border-border bg-card p-4">
          <p className="font-heading text-xl">Copil nou</p>
          <div className="space-y-2">
            <Label htmlFor="new-name">Nume</Label>
            <Input
              id="new-name"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-birth">Data nașterii</Label>
            <BirthdateField
              id="new-birth"
              value={birthdate}
              onChange={setBirthdate}
            />
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <Button type="submit" className="h-11 w-full" disabled={busy || !name.trim() || !birthdate}>
            {busy ? "Salvez…" : "Adaugă copilul"}
          </Button>
        </form>
      ) : (
        <Button variant="outline" className="h-11 w-full" onClick={() => setOpen(true)}>
          Adaugă încă un copil
        </Button>
      )}
    </section>
  );
}

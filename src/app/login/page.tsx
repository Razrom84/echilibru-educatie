"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isSupabaseConfigured } from "@/lib/config";
import { startDemoSession } from "@/lib/demo/store";
import { createBrowserSupabase } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const configured = isSupabaseConfigured();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setInfo(null);
    setBusy(true);
    try {
      const supabase = createBrowserSupabase();
      if (!supabase) {
        throw new Error("Lipesc variabilele NEXT_PUBLIC_SUPABASE_URL și ANON_KEY.");
      }
      if (mode === "login") {
        const { error: signError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signError) throw signError;
        router.replace("/azi");
        router.refresh();
        return;
      }
      const { data, error: signError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { display_name: email.split("@")[0] } },
      });
      if (signError) throw signError;
      if (!data.session) {
        setInfo(
          "Cont creat. Dacă emailul trebuie confirmat, deschide mesajul din inbox, apoi revino aici.",
        );
        setMode("login");
        return;
      }
      router.replace("/onboarding");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nu am putut intra.");
    } finally {
      setBusy(false);
    }
  }

  function enterDemo() {
    startDemoSession();
    router.replace("/onboarding");
    router.refresh();
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-5 py-10">
      <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
        educatie.echilibru-cartea.ro
      </p>
      <h1 className="mt-3 font-heading text-4xl leading-tight">Echilibru educație</h1>
      <p className="mt-3 text-base leading-7 text-muted-foreground">
        Platformă de familie, în română. V1: banda 2–3 ani, o săptămână de activități
        în curte și în casă — fără fișe, fără școală.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-11"
            disabled={!configured}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Parolă</Label>
          <Input
            id="password"
            type="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            required
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-11"
            disabled={!configured}
          />
        </div>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        {info ? <p className="text-sm text-primary">{info}</p> : null}
        <Button type="submit" className="h-11 w-full text-base" disabled={busy || !configured}>
          {busy ? "Se lucrează…" : mode === "login" ? "Intră" : "Creează cont"}
        </Button>
      </form>

      <button
        type="button"
        className="mt-4 text-sm font-medium text-primary underline-offset-4 hover:underline"
        onClick={() => {
          setError(null);
          setInfo(null);
          setMode(mode === "login" ? "signup" : "login");
        }}
      >
        {mode === "login" ? "Nu ai cont? Creează unul" : "Ai deja cont? Intră"}
      </button>

      {!configured ? (
        <p className="mt-4 rounded-xl bg-muted px-3 py-2 text-sm text-muted-foreground">
          Supabase nu e configurat în acest mediu. Folosește demonstrația locală sau
          completează `.env.local`.
        </p>
      ) : null}

      <div className="mt-8 border-t border-border pt-6">
        <p className="text-sm text-muted-foreground">
          Vrei să vezi ecranele fără cont? Datele rămân doar în acest browser.
        </p>
        <Button variant="outline" className="mt-3 h-11 w-full" onClick={enterDemo}>
          Intră în demonstrație
        </Button>
      </div>
    </main>
  );
}

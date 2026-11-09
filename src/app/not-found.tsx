import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-5 py-10">
      <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
        Echilibru educație
      </p>
      <h1 className="mt-3 font-heading text-4xl">Pagina nu există</h1>
      <p className="mt-3 text-base leading-7 text-muted-foreground">
        Adresa nu duce nicăieri. Poți reveni la ziua de azi.
      </p>
      <Link
        href="/azi"
        className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-primary px-4 text-base font-medium text-primary-foreground"
      >
        Înapoi la Azi
      </Link>
    </main>
  );
}

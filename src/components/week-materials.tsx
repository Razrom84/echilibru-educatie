"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ChevronDown, Hammer, Package, PackagePlus, ShoppingCart } from "lucide-react";
import {
  buyCaption,
  formatPrice,
  HOME_KIND_LABEL,
  listedMaterials,
  materialSubtitle,
  materialUseLabel,
  seenOn,
  weekBuyTotal,
  type CatalogMaterial,
  type HomeVariant,
} from "@/lib/gifted";
import {
  categoryForMaterial,
  minAgeForMaterial,
  reuseSummary,
  stockForMaterial,
  type StocItem,
} from "@/lib/stoc";
import { useStoc } from "@/lib/stoc-context";
import { cn } from "@/lib/utils";

export function InStockBadge({ owned }: { owned: readonly StocItem[] }) {
  if (owned.length === 0) return null;
  const loc = owned.find((item) => item.loc)?.loc;
  return (
    <p
      className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-100"
      data-testid="in-stoc"
    >
      <Check className="size-3.5" aria-hidden />
      Ai deja în stoc{loc ? ` · ${loc}` : ""}
    </p>
  );
}

function RichLine({ text }: { text: string }) {
  const chunks = text.split(/(https?:\/\/[^\s)]+)/g);
  return (
    <>
      {chunks.map((chunk, index) => {
        if (chunk.startsWith("http")) {
          return (
            <a
              key={index}
              href={chunk}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              {chunk.replace(/^https?:\/\/(www\.)?/, "")}
            </a>
          );
        }
        return <span key={index}>{chunk}</span>;
      })}
    </>
  );
}

function HomeBlock({ home }: { home: HomeVariant }) {
  const lines = home.linii.length > 0 ? home.linii : home.pasi ? [home.pasi] : [];
  return (
    <div className="rounded-xl bg-background/70 px-3 py-2 text-sm leading-6">
      <p className="text-xs font-medium text-muted-foreground">
        {HOME_KIND_LABEL[home.tip]}
        {home.titlu ? ` · ${home.titlu}` : ""}
      </p>
      {lines.map((line, index) => (
        <p key={`${home.id}-${index}`} className="mt-1">
          <RichLine text={line} />
        </p>
      ))}
    </div>
  );
}

export function MaterialRow({
  material,
  activityIds,
}: {
  material: CatalogMaterial;
  activityIds?: ReadonlySet<string>;
}) {
  const [panel, setPanel] = useState<"acasa" | "cumparati" | null>(null);
  const [moreOpen, setMoreOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const stoc = useStoc();
  const owned = stockForMaterial(stoc.items, material);
  const inStock = owned.length > 0;
  const caption = buyCaption(material);
  const price = formatPrice(material.pret, material.moneda);
  const canBuy = Boolean(material.link);
  const store = materialSubtitle(material.sursa);

  async function addToStock() {
    setAdding(true);
    setAddError(null);
    try {
      const tip = panel === "acasa" || material.doar_acasa ? "facut_acasa" : "cumparat";
      await stoc.addItems([
        {
          nume: material.nume.replace(/^„(.*)”$/, "$1"),
          tip,
          categorie: categoryForMaterial(material),
          produs_cheie: material.produs_cheie ?? null,
          material_id: material.id,
          varsta_min_luni: minAgeForMaterial(material.produs_cheie),
          sursa: "din_activitate",
        },
      ]);
    } catch (error) {
      setAddError(error instanceof Error ? error.message : "Nu am putut salva.");
    } finally {
      setAdding(false);
    }
  }

  const buyButton = (
    <button
      type="button"
      className={cn(
        "inline-flex flex-col items-start rounded-xl border border-border px-3 py-2 text-left text-sm font-medium",
        panel === "cumparati" ? "bg-primary text-primary-foreground" : "bg-card",
        !canBuy && "cursor-not-allowed opacity-60",
      )}
      aria-expanded={panel === "cumparati"}
      disabled={!canBuy}
      onClick={() => setPanel((current) => (current === "cumparati" ? null : "cumparati"))}
    >
      <span className="inline-flex items-center gap-2">
        <ShoppingCart className="size-4" aria-hidden />
        Cumpărați
      </span>
      {caption ? <span className="mt-0.5 text-xs font-normal">{caption}</span> : null}
    </button>
  );

  function hrefFor(activityId: string) {
    if (!activityIds || activityIds.has(activityId)) return `/activitate/${activityId}`;
    const seedId = activityId.replace("-b23-", "-2-3-");
    if (activityIds.has(seedId)) return `/activitate/${seedId}`;
    return `/activitate/${activityId}`;
  }

  return (
    <article id={`mat-${material.id}`} className="rounded-2xl border border-border bg-background px-3 py-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-base font-medium leading-6">{material.nume}</h3>
          <p className="text-sm text-muted-foreground">{store}</p>
        </div>
        {inStock ? null : price ? (
          <p className="shrink-0 text-sm font-medium">{price}</p>
        ) : (
          <p className="shrink-0 text-sm text-muted-foreground">gratuit</p>
        )}
      </div>
      <InStockBadge owned={owned} />
      <div className="mt-2 flex flex-wrap gap-2">
        {material.activitati.map((activityId) => (
          <Link
            key={activityId}
            href={hrefFor(activityId)}
            className="rounded-full bg-muted px-2 py-1 text-xs text-foreground"
          >
            {materialUseLabel(activityId)}
          </Link>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          className={cn(
            "inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm font-medium",
            panel === "acasa" ? "bg-primary text-primary-foreground" : "bg-card",
          )}
          aria-expanded={panel === "acasa"}
          onClick={() => setPanel((current) => (current === "acasa" ? null : "acasa"))}
        >
          <Hammer className="size-4" aria-hidden />
          Faceți acasă
        </button>
        {inStock ? null : buyButton}
        {inStock ? null : (
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm font-medium disabled:opacity-60"
            disabled={adding || stoc.status !== "ready"}
            title={stoc.status === "unavailable" ? "Stocul nu e încă disponibil." : undefined}
            onClick={() => void addToStock()}
          >
            <PackagePlus className="size-4" aria-hidden />
            {adding ? "Se salvează…" : "Adaugă în stoc"}
          </button>
        )}
        {inStock && canBuy ? (
          <button
            type="button"
            className="px-1 py-2 text-sm text-muted-foreground underline"
            aria-expanded={moreOpen}
            onClick={() => setMoreOpen((current) => !current)}
          >
            Alte opțiuni
          </button>
        ) : null}
      </div>
      {inStock && moreOpen ? <div className="mt-2">{buyButton}</div> : null}
      {addError ? <p className="mt-2 text-sm text-destructive">{addError}</p> : null}
      {panel === "acasa" ? (
        <div className="mt-3 space-y-2">
          {material.acasa.map((home) => (
            <HomeBlock key={home.id} home={home} />
          ))}
          {material.nota_siguranta ? (
            <p className="text-sm leading-6">
              <span className="font-medium">Siguranță: </span>
              {material.nota_siguranta}
            </p>
          ) : null}
        </div>
      ) : null}
      {panel === "cumparati" && canBuy ? (
        <div className="mt-3 space-y-2 text-sm leading-6">
          {material.detaliu_pret ? (
            <p>
              <RichLine text={material.detaliu_pret} />
            </p>
          ) : null}
          {material.note.map((note) => (
            <p key={note}>
              <RichLine text={note} />
            </p>
          ))}
          {material.data_verificare && !material.detaliu_pret?.includes("Preț văzut") ? (
            <p className="text-muted-foreground">
              Preț văzut pe {seenOn(material.data_verificare)}.
            </p>
          ) : null}
          {material.link ? (
            <a
              href={material.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex font-medium text-primary underline"
            >
              Deschide produsul
            </a>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

export function WeekMaterialsCard({
  materials,
  gratuit,
  activityIds,
}: {
  materials: CatalogMaterial[];
  gratuit: string | null;
  activityIds?: ReadonlySet<string>;
}) {
  return <WeekMaterialsInner materials={materials} gratuit={gratuit} activityIds={activityIds} />;
}

function WeekMaterialsInner({
  materials,
  gratuit,
  activityIds,
}: {
  materials: CatalogMaterial[];
  gratuit: string | null;
  activityIds?: ReadonlySet<string>;
}) {
  const stoc = useStoc();
  if (materials.length === 0) return null;
  const missing = materials.filter((material) => stockForMaterial(stoc.items, material).length === 0);
  const total = Math.round(weekBuyTotal(missing));
  const reuse = stoc.status === "ready" ? reuseSummary(stoc.items, materials, total) : null;
  // Stock first, then home-made, then to buy.
  const ordered = [...materials].sort(
    (a, b) =>
      Number(stockForMaterial(stoc.items, b).length > 0) -
        Number(stockForMaterial(stoc.items, a).length > 0) ||
      Number(b.doar_acasa) - Number(a.doar_acasa) ||
      a.ordine - b.ordine,
  );
  return (
    <details
      className="group rounded-2xl border border-border bg-card p-4"
      data-testid="materiale-saptamana"
    >
      <summary className="flex cursor-pointer list-none items-start gap-3 [&::-webkit-details-marker]:hidden">
        <Package className="mt-1 size-5 shrink-0 text-primary" aria-hidden />
        <span className="min-w-0 flex-1">
          <span className="block font-heading text-xl">Materiale pentru săptămâna asta</span>
          <span className="mt-1 block text-sm text-muted-foreground">
            {reuse ?? (
              <>
                {materials.length} materiale · întâi varianta de făcut acasă
                {total > 0 ? ` · de cumpărat ~${total} lei în total` : ""}
              </>
            )}
          </span>
        </span>
        <ChevronDown className="mt-1 size-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
      </summary>
      <div className="mt-4 space-y-3">
        {ordered.map((material) => (
          <MaterialRow key={material.id} material={material} activityIds={activityIds} />
        ))}
        {gratuit ? (
          <p className="text-sm leading-6">
            <span className="font-medium">Gratuit, din casă: </span>
            {gratuit}
          </p>
        ) : null}
      </div>
    </details>
  );
}

export function ActivityMaterialsLine({
  materiale,
  linked,
  activityIds,
}: {
  materiale: string[];
  linked: CatalogMaterial[];
  activityIds?: ReadonlySet<string>;
}) {
  const [open, setOpen] = useState(false);
  const items = listedMaterials(materiale);
  if (linked.length === 0) {
    return items.length > 0 ? (
      <p className="mt-4 text-sm">
        <span className="font-medium">Materiale: </span>
        {items.join(", ")}
      </p>
    ) : (
      <p className="mt-4 text-sm text-muted-foreground">Fără materiale extra.</p>
    );
  }

  return (
    <div className="mt-4">
      <p className="text-sm">
        {items.length > 0 ? (
          <>
            <span className="font-medium">Materiale: </span>
            {items.join(", ")}
          </>
        ) : (
          <span className="text-muted-foreground">Fără materiale extra.</span>
        )}
        <button
          type="button"
          className="ml-2 inline-flex size-7 items-center justify-center rounded-full align-middle text-primary hover:bg-muted"
          aria-expanded={open}
          aria-label="Deschide materialele săptămânii"
          onClick={() => setOpen((current) => !current)}
        >
          <Package className="size-4" aria-hidden />
        </button>
      </p>
      {open ? (
        <div className="mt-3 space-y-3">
          {linked.map((material) => (
            <MaterialRow key={material.id} material={material} activityIds={activityIds} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

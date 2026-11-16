"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Hammer, Package, ShoppingCart } from "lucide-react";
import {
  buyCaption,
  HOME_KIND_LABEL,
  materialSubtitle,
  materialUseLabel,
  seenOn,
  weekBuyTotal,
  type CatalogMaterial,
  type HomeVariant,
} from "@/lib/gifted";
import { cn } from "@/lib/utils";

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
  const caption = buyCaption(material);
  const canBuy = Boolean(material.link);
  const store = materialSubtitle(material.sursa);

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
        {material.pret ? (
          <p className="shrink-0 text-sm font-medium">{material.pret}</p>
        ) : (
          <p className="shrink-0 text-sm text-muted-foreground">gratuit</p>
        )}
      </div>
      {material.folosita ? (
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{material.folosita}</p>
      ) : null}
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
          {caption ? (
            <span className="mt-0.5 text-xs font-normal">{caption}</span>
          ) : null}
        </button>
      </div>
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
          {material.data_verificare ? (
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
  if (materials.length === 0) return null;
  const total = Math.round(weekBuyTotal(materials));
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
            {materials.length} materiale · întâi varianta de făcut acasă
            {total > 0 ? ` · de cumpărat ~${total} lei în total` : ""}
          </span>
        </span>
        <ChevronDown className="mt-1 size-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
      </summary>
      <div className="mt-4 space-y-3">
        {materials.map((material) => (
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
  if (linked.length === 0) {
    return materiale.length > 0 ? (
      <p className="mt-4 text-sm">
        <span className="font-medium">Materiale: </span>
        {materiale.join(", ")}
      </p>
    ) : (
      <p className="mt-4 text-sm text-muted-foreground">Fără materiale extra.</p>
    );
  }

  return (
    <div className="mt-4">
      <p className="text-sm">
        {materiale.length > 0 ? (
          <>
            <span className="font-medium">Materiale: </span>
            {materiale.join(", ")}
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

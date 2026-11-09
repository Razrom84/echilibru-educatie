"use client";

import { LOCAL_CATALOG_LABEL, LOCAL_CATALOG_NOTE } from "@/lib/catalog-source";
import { useFamily } from "@/lib/family-context";

export function LocalCatalogBanner() {
  const { usingLocalCatalog } = useFamily();
  if (!usingLocalCatalog) return null;

  return (
    <p
      role="status"
      className="mb-4 rounded-xl border border-border bg-muted/60 px-3 py-2 text-xs leading-5 text-muted-foreground"
    >
      <span className="font-medium text-foreground">{LOCAL_CATALOG_LABEL}.</span>{" "}
      {LOCAL_CATALOG_NOTE}
    </p>
  );
}

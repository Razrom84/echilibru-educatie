"use client";

import { useSyncExternalStore } from "react";
import { Switch } from "@/components/ui/switch";
import {
  CHIME_TOGGLE_HELP,
  CHIME_TOGGLE_LABEL,
  getChimeEnabledServerSnapshot,
  getChimeEnabledSnapshot,
  subscribeChimeEnabled,
  writeChimeEnabled,
} from "@/lib/playful-chime";

export function PlayfulChimeSettings() {
  const enabled = useSyncExternalStore(
    subscribeChimeEnabled,
    getChimeEnabledSnapshot,
    getChimeEnabledServerSnapshot,
  );

  return (
    <div className="flex items-start justify-between gap-4 rounded-xl bg-muted/60 px-3 py-3">
      <div>
        <p className="text-sm font-medium">{CHIME_TOGGLE_LABEL}</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {CHIME_TOGGLE_HELP}
        </p>
      </div>
      <Switch
        checked={enabled}
        onCheckedChange={(checked) => writeChimeEnabled(Boolean(checked))}
        aria-label={CHIME_TOGGLE_LABEL}
      />
    </div>
  );
}

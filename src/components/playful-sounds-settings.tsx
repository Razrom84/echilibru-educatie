"use client";

import { useSyncExternalStore } from "react";
import { Switch } from "@/components/ui/switch";
import {
  SOUNDS_TOGGLE_HELP,
  SOUNDS_TOGGLE_LABEL,
  getPlayfulSoundsEnabledServerSnapshot,
  getPlayfulSoundsEnabledSnapshot,
  isPlayfulSoundsPreviewEnabled,
  subscribePlayfulSoundsEnabled,
  writePlayfulSoundsEnabled,
} from "@/lib/playful-sounds";

export function PlayfulSoundsSettings() {
  const enabled = useSyncExternalStore(
    subscribePlayfulSoundsEnabled,
    getPlayfulSoundsEnabledSnapshot,
    getPlayfulSoundsEnabledServerSnapshot,
  );

  if (!isPlayfulSoundsPreviewEnabled()) return null;

  return (
    <div className="flex items-start justify-between gap-4 rounded-xl bg-muted/60 px-3 py-3">
      <div>
        <p className="text-sm font-medium">{SOUNDS_TOGGLE_LABEL}</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {SOUNDS_TOGGLE_HELP}
        </p>
      </div>
      <Switch
        id="playful-sounds-preview"
        checked={enabled}
        onCheckedChange={(checked) =>
          writePlayfulSoundsEnabled(Boolean(checked))
        }
        aria-label={SOUNDS_TOGGLE_LABEL}
      />
    </div>
  );
}

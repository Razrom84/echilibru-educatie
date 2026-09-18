"use client";

import { useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import {
  SOUNDS_PLAY_DISABLED_HINT,
  SOUNDS_PLAY_LABEL,
  getPlayfulSoundsEnabledServerSnapshot,
  getPlayfulSoundsEnabledSnapshot,
  isPlayfulSoundsPreviewEnabled,
  playPlayfulClip,
  playfulSoundPlayable,
  subscribePlayfulSoundsEnabled,
} from "@/lib/playful-sounds";

export function PlayfulSoundPlay({
  activityId,
  compact,
}: {
  activityId: string;
  compact?: boolean;
}) {
  const settingsOn = useSyncExternalStore(
    subscribePlayfulSoundsEnabled,
    getPlayfulSoundsEnabledSnapshot,
    getPlayfulSoundsEnabledServerSnapshot,
  );

  if (!isPlayfulSoundsPreviewEnabled()) return null;
  const clip = playfulSoundPlayable(activityId);
  if (!clip?.src) return null;

  const label = `${SOUNDS_PLAY_LABEL}: ${clip.label}`;
  const src = clip.src;

  return (
    <Button
      type="button"
      variant="outline"
      size={compact ? "xs" : "sm"}
      className={compact ? "shrink-0" : "mt-3"}
      disabled={!settingsOn}
      aria-label={label}
      title={settingsOn ? label : SOUNDS_PLAY_DISABLED_HINT}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        if (!settingsOn) return;
        playPlayfulClip(src);
      }}
    >
      {SOUNDS_PLAY_LABEL}
    </Button>
  );
}

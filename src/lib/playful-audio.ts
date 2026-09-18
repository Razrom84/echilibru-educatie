/**
 * One HTMLAudioElement for the gata chime.
 * No overlap, adult-gesture play() only, iOS silent-switch via default routing.
 */

let sharedEl: HTMLAudioElement | null = null;

function getSharedAudio(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  if (!sharedEl) {
    sharedEl = new Audio();
    sharedEl.preload = "none";
  }
  return sharedEl;
}

/** Adult-triggered only. Never call from page load / useEffect. */
export function playSharedAudio(src: string): void {
  const el = getSharedAudio();
  if (!el) return;
  try {
    el.pause();
    try {
      el.currentTime = 0;
    } catch {
      // Some browsers throw if no src yet.
    }
    el.src = src;
    void el.play().catch(() => {
      // Autoplay policies / missing file / silent switch — stay quiet.
    });
  } catch {
    // Ignore.
  }
}

export function stopSharedAudio(): void {
  if (!sharedEl) return;
  try {
    sharedEl.pause();
    sharedEl.currentTime = 0;
  } catch {
    // Ignore.
  }
}

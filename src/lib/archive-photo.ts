/** Browser-side photo pick + light JPEG compression. No video. */

import {
  PHOTO_READ_FAILED,
  PHOTO_TYPE_REJECTED,
  PHOTO_VIDEO_REJECTED,
} from "@/lib/archive";

/** Max edge so the photo still looks normal on a page, not a postage stamp. */
export const PHOTO_MAX_EDGE = 1600;
export const PHOTO_JPEG_QUALITY = 0.72;
export const PHOTO_MAX_BYTES = 900_000;
export const PHOTO_ACCEPT =
  "image/jpeg,image/jpg,image/png,image/webp,image/gif,image/*";

const VIDEO_EXT = /\.(mp4|mov|webm|m4v|avi|mkv|mpeg|mpg|3gp)$/i;

export function isLikelyVideoFile(file: {
  type: string;
  name: string;
}): boolean {
  if (file.type.startsWith("video/")) return true;
  return VIDEO_EXT.test(file.name);
}

export function rejectIfNotPhoto(file: {
  type: string;
  name: string;
}): string | null {
  if (isLikelyVideoFile(file)) return PHOTO_VIDEO_REJECTED;
  if (file.type && !file.type.startsWith("image/") && file.type !== "") {
    return PHOTO_TYPE_REJECTED;
  }
  return null;
}

function loadImage(file: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(PHOTO_READ_FAILED));
    };
    image.src = url;
  });
}

function drawJpeg(
  source: CanvasImageSource,
  width: number,
  height: number,
  quality: number,
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return Promise.reject(new Error(PHOTO_READ_FAILED));
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(source, 0, 0, width, height);
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error(PHOTO_READ_FAILED));
          return;
        }
        resolve(blob);
      },
      "image/jpeg",
      quality,
    );
  });
}

function scaledSize(
  width: number,
  height: number,
  maxEdge: number,
): { width: number; height: number } {
  const edge = Math.max(width, height);
  if (edge <= maxEdge) return { width, height };
  const scale = maxEdge / edge;
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

/**
 * Light in-browser JPEG. Looks fine on a page; not the camera original.
 * Original file never leaves the device.
 */
export async function compressDayPhoto(file: File): Promise<Blob> {
  const rejected = rejectIfNotPhoto(file);
  if (rejected) throw new Error(rejected);

  const image = await loadImage(file);
  const attempts: { edge: number; quality: number }[] = [
    { edge: PHOTO_MAX_EDGE, quality: PHOTO_JPEG_QUALITY },
    { edge: 1280, quality: 0.64 },
    { edge: 1024, quality: 0.58 },
  ];

  let last: Blob | null = null;
  for (const attempt of attempts) {
    const size = scaledSize(image.naturalWidth, image.naturalHeight, attempt.edge);
    last = await drawJpeg(image, size.width, size.height, attempt.quality);
    if (last.size <= PHOTO_MAX_BYTES) return last;
  }
  if (!last) throw new Error(PHOTO_READ_FAILED);
  return last;
}

export function jpegFileFromBlob(blob: Blob, civilDate: string): File {
  return new File([blob], `${civilDate}.jpg`, { type: "image/jpeg" });
}

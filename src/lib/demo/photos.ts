import {
  childForUnscopedRows,
  childScopeNotice,
  type ScopeChild,
} from "@/lib/child-scope";

const DB_NAME = "echilibru-archive-photos";
const STORE = "photos";

function photoKey(childId: string, civilDate: string) {
  return `${childId}:${civilDate}`;
}

/** Cheia nouă e copil + zi. Cheia veche era doar data. */
export function isScopedDemoPhotoKey(key: string): boolean {
  return /^[^:]+:\d{4}-\d{2}-\d{2}$/.test(key);
}

export function planUnscopedPhotoMoves(
  keys: readonly string[],
  ownerChildId: string | null,
): { from: string; to: string }[] {
  if (!ownerChildId) return [];
  const taken = new Set(keys);
  const moves: { from: string; to: string }[] = [];
  for (const key of keys) {
    if (isScopedDemoPhotoKey(key)) continue;
    const match = /^(\d{4}-\d{2}-\d{2})(?:\.jpe?g)?$/.exec(key);
    if (!match) continue;
    const to = photoKey(ownerChildId, match[1]);
    if (taken.has(to)) continue;
    moves.push({ from: key, to });
    taken.add(to);
  }
  return moves;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(request.error ?? new Error("Nu am putut deschide stocarea locală."));
  });
}

export async function saveDemoPhoto(
  childId: string,
  civilDate: string,
  blob: Blob,
): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(blob, photoKey(childId, civilDate));
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("Nu am putut salva fotografia."));
  });
  db.close();
}

export async function readDemoPhoto(
  childId: string,
  civilDate: string,
): Promise<Blob | null> {
  const db = await openDb();
  const blob = await new Promise<Blob | null>((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const request = tx.objectStore(STORE).get(photoKey(childId, civilDate));
    request.onsuccess = () => resolve((request.result as Blob | undefined) ?? null);
    request.onerror = () => reject(request.error ?? new Error("Nu am putut citi fotografia."));
  });
  db.close();
  return blob;
}

export async function deleteDemoPhoto(childId: string, civilDate: string): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(photoKey(childId, civilDate));
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("Nu am putut șterge fotografia."));
  });
  db.close();
}

export async function demoPhotoObjectUrl(
  childId: string,
  civilDate: string,
): Promise<string | null> {
  const blob = await readDemoPhoto(childId, civilDate);
  if (!blob) return null;
  return URL.createObjectURL(blob);
}

async function listDemoPhotoKeys(): Promise<string[]> {
  const db = await openDb();
  const keys = await new Promise<IDBValidKey[]>((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const request = tx.objectStore(STORE).getAllKeys();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Nu am putut citi fotografiile."));
  });
  db.close();
  return keys.map((key) => String(key));
}

async function moveDemoPhotoKey(from: string, to: string): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    const store = tx.objectStore(STORE);
    const read = store.get(from);
    read.onsuccess = () => {
      const blob = read.result as Blob | undefined;
      if (!blob) return;
      store.put(blob, to);
      store.delete(from);
    };
    read.onerror = () => reject(read.error ?? new Error("Nu am putut muta fotografia."));
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("Nu am putut muta fotografia."));
  });
  db.close();
}

/** Fotografiile salvate doar pe zi trec la copilul activ sau la primul copil. */
export async function migrateUnscopedDemoPhotos(
  children: readonly ScopeChild[],
): Promise<string[]> {
  if (typeof indexedDB === "undefined") return [];
  const { child, several } = childForUnscopedRows(children);
  if (!child) return [];
  const keys = await listDemoPhotoKeys();
  const moves = planUnscopedPhotoMoves(keys, child.id);
  for (const move of moves) {
    await moveDemoPhotoKey(move.from, move.to);
  }
  const notice = childScopeNotice({
    kind: "fotografii",
    childName: child.name?.trim() || "copilul din familie",
    severalChildren: several,
    count: moves.length,
  });
  return notice ? [notice] : [];
}

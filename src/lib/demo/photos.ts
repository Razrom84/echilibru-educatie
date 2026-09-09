const DB_NAME = "echilibru-archive-photos";
const STORE = "photos";

function photoKey(childId: string, civilDate: string) {
  return `${childId}:${civilDate}`;
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

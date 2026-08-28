/**
 * IndexedDB Service for storing uploaded video files and offline cached media
 */

const DB_NAME = 'AndroidEducationalApp_DB';
const DB_VERSION = 1;
const VIDEO_STORE = 'videos';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(VIDEO_STORE)) {
        db.createObjectStore(VIDEO_STORE, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export interface StoredVideoItem {
  id: string;
  blob: Blob;
  name: string;
  size: number;
  mimeType: string;
  createdAt: number;
}

export async function saveVideoFileToDB(id: string, file: File | Blob, name: string): Promise<string> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(VIDEO_STORE, 'readwrite');
    const store = transaction.objectStore(VIDEO_STORE);

    const item: StoredVideoItem = {
      id,
      blob: file,
      name,
      size: file.size,
      mimeType: file.type || 'video/mp4',
      createdAt: Date.now(),
    };

    const request = store.put(item);
    request.onsuccess = () => resolve(id);
    request.onerror = () => reject(request.error);
  });
}

export async function getVideoBlobFromDB(id: string): Promise<Blob | null> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(VIDEO_STORE, 'readonly');
      const store = transaction.objectStore(VIDEO_STORE);
      const request = store.get(id);

      request.onsuccess = () => {
        const result = request.result as StoredVideoItem | undefined;
        resolve(result ? result.blob : null);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error fetching video from IndexedDB:', error);
    return null;
  }
}

export async function deleteVideoFromDB(id: string): Promise<boolean> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(VIDEO_STORE, 'readwrite');
      const store = transaction.objectStore(VIDEO_STORE);
      const request = store.delete(id);

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error deleting video from IndexedDB:', error);
    return false;
  }
}

export async function getAllStoredVideosList(): Promise<{ id: string; name: string; size: number; createdAt: number }[]> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(VIDEO_STORE, 'readonly');
      const store = transaction.objectStore(VIDEO_STORE);
      const request = store.getAll();

      request.onsuccess = () => {
        const results = (request.result as StoredVideoItem[]) || [];
        resolve(
          results.map((item) => ({
            id: item.id,
            name: item.name,
            size: item.size,
            createdAt: item.createdAt,
          }))
        );
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error retrieving video list from IndexedDB:', error);
    return [];
  }
}

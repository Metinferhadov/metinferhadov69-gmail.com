import { db } from '../lib/firebase';
import { doc, getDoc, setDoc, Bytes } from 'firebase/firestore';

// IndexedDB Media Storage & Media Optimization Utility for Real Images and Videos

const DB_NAME = 'mmz_media_database';
const DB_VERSION = 1;
const STORE_NAME = 'product_media';

interface StoredMediaItem {
  id: string;
  productId?: string;
  name: string;
  type: 'image' | 'video';
  mimeType: string;
  size: number;
  data: Blob | string; // Blob or DataURL
  createdAt: number;
}

let dbPromise: Promise<IDBDatabase> | null = null;

export function openMediaDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB dəstəklənmir'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('productId', 'productId', { unique: false });
        store.createIndex('type', 'type', { unique: false });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error || new Error('IndexedDB açıla bilmədi'));
    };
  });

  return dbPromise;
}

// Format file size nicely
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

// Supported file formats
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];

export const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

export const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/quicktime', // .mov
  'video/webm'
];

export const ALLOWED_VIDEO_EXTENSIONS = ['.mp4', '.mov', '.webm'];

export const MAX_IMAGE_SIZE = 15 * 1024 * 1024; // 15MB
export const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

/**
 * Optimizes and compresses image to high-fidelity WebP/JPEG using Canvas
 */
export async function optimizeImageFile(
  file: File,
  onProgress?: (progress: number, status: string) => void
): Promise<{ dataUrl: string; sizeStr: string; originalName: string }> {
  // Validate type
  const isTypeValid =
    ALLOWED_IMAGE_TYPES.includes(file.type.toLowerCase()) ||
    ALLOWED_IMAGE_EXTENSIONS.some((ext) => file.name.toLowerCase().endsWith(ext));

  if (!isTypeValid) {
    throw new Error('Yalnız JPG, JPEG, PNG və WEBP formatlı şəkillər qəbul olunur.');
  }

  // Validate size
  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error(`Şəkil ölçüsü 15MB-dan çox ola bilməz (Mövcud: ${formatFileSize(file.size)}).`);
  }

  onProgress?.(15, 'Şəkil oxunur...');

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onprogress = (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 40) + 15;
        onProgress?.(percent, 'Fayl emal edilir...');
      }
    };

    reader.onload = () => {
      const rawDataUrl = reader.result as string;
      onProgress?.(60, 'Şəkil web üçün optimallaşdırılır...');

      const img = new Image();
      img.onload = () => {
        try {
          const maxDim = 1024; // Optimal for sharp product views while keeping Firestore doc size well within 1MB
          let { width, height } = img;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            onProgress?.(100, 'Uğurla yükləndi');
            resolve({
              dataUrl: rawDataUrl,
              sizeStr: formatFileSize(file.size),
              originalName: file.name
            });
            return;
          }

          // Crisp rendering
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          // Export as WebP or JPEG with quality 0.80 for high crispness and compact payload
          let optimizedDataUrl: string;
          try {
            optimizedDataUrl = canvas.toDataURL('image/webp', 0.80);
            if (!optimizedDataUrl.startsWith('data:image/webp')) {
              optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.80);
            }
          } catch {
            optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.80);
          }

          onProgress?.(100, 'Uğurla yükləndi');
          resolve({
            dataUrl: optimizedDataUrl,
            sizeStr: formatFileSize(Math.round(optimizedDataUrl.length * 0.75)),
            originalName: file.name
          });
        } catch (err) {
          onProgress?.(100, 'Uğurla yükləndi');
          resolve({
            dataUrl: rawDataUrl,
            sizeStr: formatFileSize(file.size),
            originalName: file.name
          });
        }
      };

      img.onerror = () => {
        reject(new Error('Şəkil formatı zədəlidir və ya açıla bilmədi.'));
      };

      img.src = rawDataUrl;
    };

    reader.onerror = () => {
      reject(new Error('Fayl oxunarkən xəta baş verdi.'));
    };

    reader.readAsDataURL(file);
  });
}

// In-memory cache for resolved blob URLs
const memoryBlobMap = new Map<string, string>();

export function registerVideoBlobUrl(id: string, blobUrl: string) {
  memoryBlobMap.set(id, blobUrl);
  // Also register with clean filename if applicable
  if (id.includes('/')) {
    const filename = id.split('/').pop()?.split('?')[0];
    if (filename) memoryBlobMap.set(filename, blobUrl);
  }
}

export function getCachedVideoUrl(id: string): string | undefined {
  if (!id) return undefined;
  if (memoryBlobMap.has(id)) return memoryBlobMap.get(id);
  if (id.includes('/')) {
    const filename = id.split('/').pop()?.split('?')[0];
    if (filename && memoryBlobMap.has(filename)) return memoryBlobMap.get(filename);
  }
  return undefined;
}

/**
 * Reconstructs a full video Blob from chunked documents stored in Firestore.
 * This guarantees reliable playback on any hosting platform (Netlify, Cloud Run, GitHub, etc.)
 * across all customer and admin devices.
 */
function extractBytesFromChunk(data: any): Uint8Array | null {
  if (!data) return null;
  if (data.bytes) {
    const b = data.bytes;
    if (typeof b.toUint8Array === 'function') {
      return b.toUint8Array();
    }
    if (b instanceof Uint8Array) {
      return b;
    }
    if (b.buffer instanceof ArrayBuffer) {
      return new Uint8Array(b.buffer, b.byteOffset || 0, b.byteLength || b.length);
    }
    if (typeof b.toBase64 === 'function') {
      try {
        const bin = atob(b.toBase64());
        const arr = new Uint8Array(bin.length);
        for (let j = 0; j < bin.length; j++) arr[j] = bin.charCodeAt(j);
        return arr;
      } catch (_) {}
    }
    if (b._byteString) {
      try {
        const b64 = typeof b._byteString.toBase64 === 'function' ? b._byteString.toBase64() : String(b._byteString);
        const bin = atob(b64);
        const arr = new Uint8Array(bin.length);
        for (let j = 0; j < bin.length; j++) arr[j] = bin.charCodeAt(j);
        return arr;
      } catch (_) {}
    }
  }
  if (typeof data.data === 'string' && data.data.startsWith('data:')) {
    try {
      const base64 = data.data.split(',')[1];
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let b = 0; b < binary.length; b++) bytes[b] = binary.charCodeAt(b);
      return bytes;
    } catch (_) {}
  }
  return null;
}

export async function fetchVideoFromFirestore(videoId: string): Promise<Blob | null> {
  if (!videoId || !db) return null;

  const raw = videoId.replace(/^firestore-video:\/\//, '').replace(/^idb-video:\/\//, '').trim();
  const cleanId = raw.split('/').pop()?.split('?')[0] || raw;

  const candidateIds = [
    cleanId,
    cleanId.endsWith('.mp4') ? cleanId.replace(/\.mp4$/, '') : `${cleanId}.mp4`,
    raw,
  ];

  for (const id of candidateIds) {
    if (!id) continue;
    try {
      const metaRef = doc(db, 'product_videos', id);
      const metaSnap = await getDoc(metaRef);
      if (!metaSnap.exists()) continue;

      const meta = metaSnap.data();
      const chunkCount = Number(meta.chunkCount) || 0;
      if (chunkCount <= 0) continue;

      // Fetch all chunks in parallel with automatic retries for resilient mobile networks
      const chunkPromises: Promise<{ index: number; bytes: Uint8Array } | null>[] = [];
      for (let i = 0; i < chunkCount; i++) {
        chunkPromises.push(
          (async () => {
            const chunkRef = doc(db, 'product_videos', id, 'chunks', String(i));
            for (let attempt = 0; attempt < 3; attempt++) {
              try {
                const snap = await getDoc(chunkRef);
                if (!snap.exists()) continue;
                const bytes = extractBytesFromChunk(snap.data());
                if (bytes) {
                  return { index: i, bytes };
                }
              } catch (e) {
                if (attempt === 2) console.warn(`Chunk ${i} attempt error:`, e);
              }
            }
            return null;
          })()
        );
      }

      const results = await Promise.all(chunkPromises);
      const sortedChunks: Uint8Array[] = [];
      for (let i = 0; i < chunkCount; i++) {
        const found = results.find((r) => r?.index === i);
        if (found) {
          sortedChunks.push(found.bytes);
        } else {
          break;
        }
      }

      if (sortedChunks.length === chunkCount) {
        const mimeType = meta.mimeType || 'video/mp4';
        return new Blob(sortedChunks, { type: mimeType });
      }
    } catch (err) {
      console.warn(`Firestore video fetch attempt note for ${id}:`, err);
    }
  }

  return null;
}

/**
 * Saves a video file into Firestore chunks (500KB each) under product_videos
 * so that any client across any domain/device (including Netlify static deployments) can stream it.
 */
export async function saveVideoToFirestore(
  videoId: string,
  file: File | Blob,
  originalName?: string,
  onProgress?: (percent: number, status: string) => void
): Promise<string> {
  if (!db) throw new Error('Firestore bazası əlçatan deyil');

  const cleanId = videoId.replace(/^firestore-video:\/\//, '').replace(/^\/uploads\/videos\//, '').trim();
  const mimeType = file.type || 'video/mp4';
  const totalSize = file.size;
  const CHUNK_SIZE = 500 * 1024; // 500KB per chunk
  const chunkCount = Math.ceil(totalSize / CHUNK_SIZE);

  onProgress?.(30, 'Video bulud bazasına hazırlanır...');

  const buffer = await file.arrayBuffer();

  // Save metadata
  await setDoc(doc(db, 'product_videos', cleanId), {
    id: cleanId,
    name: originalName || (file as File).name || cleanId,
    mimeType,
    totalSize,
    chunkSize: CHUNK_SIZE,
    chunkCount,
    createdAt: Date.now(),
  });

  // Save chunks in small batches to respect rate limits
  const BATCH_SIZE = 4;
  for (let batchStart = 0; batchStart < chunkCount; batchStart += BATCH_SIZE) {
    const batchEnd = Math.min(batchStart + BATCH_SIZE, chunkCount);
    const promises: Promise<any>[] = [];

    for (let i = batchStart; i < batchEnd; i++) {
      const start = i * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, totalSize);
      const chunkBytes = new Uint8Array(buffer.slice(start, end));

      promises.push(
        setDoc(doc(db, 'product_videos', cleanId, 'chunks', String(i)), {
          index: i,
          bytes: Bytes.fromUint8Array(chunkBytes),
          size: chunkBytes.length,
        })
      );
    }

    await Promise.all(promises);
    const percent = Math.round(30 + ((batchEnd / chunkCount) * 55));
    onProgress?.(percent, `Bulud saxlanclığına yazılır (${batchEnd}/${chunkCount})...`);
  }

  return `firestore-video://${cleanId}`;
}

/**
 * Resolves any video URL (server path, blob, idb-video://, firestore-video://) to a playable browser URL.
 * Automatically fails over to Firestore cloud storage when hosted statically (e.g. Netlify).
 */
export async function resolveVideoUrl(urlOrId: any, options?: { forceCloud?: boolean }): Promise<string> {
  if (!urlOrId) return '';
  const str = typeof urlOrId === 'string'
    ? urlOrId.trim()
    : (urlOrId?.url ? String(urlOrId.url).trim() : String(urlOrId || '').trim());
  if (!str) return '';

  // Direct playable formats
  if (str.startsWith('blob:') || str.startsWith('data:')) {
    return str;
  }

  // 1. Check in-memory map
  if (!options?.forceCloud && memoryBlobMap.has(str)) {
    return memoryBlobMap.get(str)!;
  }
  const filename = str.split('/').pop()?.split('?')[0] || '';
  if (!options?.forceCloud && filename && memoryBlobMap.has(filename)) {
    return memoryBlobMap.get(filename)!;
  }

  // 2. Check local IndexedDB cache
  if (!options?.forceCloud) {
    try {
      const dbInstance = await openMediaDB();
      const localBlobUrl = await new Promise<string | null>((resolve) => {
        const tx = dbInstance.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);

        // Try exact str key
        const req = store.get(str);
        req.onsuccess = () => {
          const item = req.result as StoredMediaItem | undefined;
          if (item && item.data) {
            let blob: Blob;
            if (item.data instanceof Blob) {
              blob = item.data;
            } else if (typeof item.data === 'string' && item.data.startsWith('data:')) {
              try {
                const parts = item.data.split(',');
                const byteString = atob(parts[1]);
                const mimeMatch = parts[0].match(/:(.*?);/);
                const mimeType = mimeMatch ? mimeMatch[1] : item.mimeType || 'video/mp4';
                const ab = new ArrayBuffer(byteString.length);
                const ia = new Uint8Array(ab);
                for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
                blob = new Blob([ab], { type: mimeType });
              } catch {
                resolve(null);
                return;
              }
            } else {
              resolve(null);
              return;
            }
            const bUrl = URL.createObjectURL(blob);
            memoryBlobMap.set(str, bUrl);
            if (filename) memoryBlobMap.set(filename, bUrl);
            resolve(bUrl);
          } else if (filename && filename !== str) {
            // Try lookup by filename
            const req2 = store.get(filename);
            req2.onsuccess = () => {
              const item2 = req2.result as StoredMediaItem | undefined;
              if (item2 && item2.data instanceof Blob) {
                const bUrl2 = URL.createObjectURL(item2.data);
                memoryBlobMap.set(str, bUrl2);
                memoryBlobMap.set(filename, bUrl2);
                resolve(bUrl2);
              } else {
                resolve(null);
              }
            };
            req2.onerror = () => resolve(null);
          } else {
            resolve(null);
          }
        };
        req.onerror = () => resolve(null);
      });

      if (localBlobUrl) {
        return localBlobUrl;
      }
    } catch (_) {}
  }

  // 3. Check if server URL actually returns playable video vs HTML error page (like on Netlify)
  const isStaticHost = typeof window !== 'undefined' &&
    (window.location.hostname === 'mmzonline.cc.cd' || window.location.hostname.endsWith('netlify.app'));

  if (!isStaticHost && (str.startsWith('/') || str.startsWith('http://') || str.startsWith('https://'))) {
    if (!options?.forceCloud) {
      try {
        const head = await fetch(str, { method: 'HEAD' });
        const ct = (head.headers.get('content-type') || '').toLowerCase();
        // If 200/206 and not HTML
        if (head.ok && !ct.includes('text/html') && (ct.includes('video/') || ct.includes('octet-stream') || ct.length === 0)) {
          return str;
        }
      } catch (_) {
        // Fetch failed or blocked by CORS / host
      }
    }
  }

  // Host cannot serve video directly (e.g. Netlify static 404), fall back to Firestore
  if (filename) {
    const cloudBlob = await fetchVideoFromFirestore(filename);
    if (cloudBlob) {
      const bUrl = URL.createObjectURL(cloudBlob);
      memoryBlobMap.set(str, bUrl);
      memoryBlobMap.set(filename, bUrl);
      try {
        await saveVideoBlobToIDB(str, cloudBlob, filename);
      } catch (_) {}
      return bUrl;
    }
  }

  // 4. Firestore video or IDB video
  const videoId = str.replace(/^firestore-video:\/\//, '').replace(/^idb-video:\/\//, '').trim();
  if (videoId) {
    const cloudBlob = await fetchVideoFromFirestore(videoId);
    if (cloudBlob) {
      const bUrl = URL.createObjectURL(cloudBlob);
      memoryBlobMap.set(str, bUrl);
      memoryBlobMap.set(videoId, bUrl);
      try {
        await saveVideoBlobToIDB(str, cloudBlob, videoId);
      } catch (_) {}
      return bUrl;
    }
  }

  return str;
}

/**
 * Saves a video file / Blob to IndexedDB with a persistent key
 */
export async function saveVideoBlobToIDB(id: string, file: File | Blob, originalName?: string): Promise<string> {
  const db = await openMediaDB();
  return new Promise<string>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const item: StoredMediaItem = {
      id,
      name: originalName || (file as File).name || 'video.mp4',
      type: 'video',
      mimeType: file.type || 'video/mp4',
      size: file.size,
      data: file,
      createdAt: Date.now()
    };
    const req = store.put(item);
    req.onsuccess = () => resolve(id);
    req.onerror = () => reject(req.error || new Error('IDB save error'));
  });
}

/**
 * Processes video file:
 * 1. Generates consistent URL identifier
 * 2. Caches in IndexedDB for immediate zero-lag local playback
 * 3. Uploads chunks to Cloud Firestore so it plays anywhere (Netlify, Mobile, Web)
 * 4. Also uploads to Express server if backend is reachable
 */
export async function processVideoFile(
  file: File,
  onProgress?: (progress: number, status: string) => void
): Promise<{ videoUrl: string; sizeStr: string; originalName: string }> {
  if (!file) {
    throw new Error('Video faylı seçilməyib.');
  }

  const nameLower = (file.name || '').toLowerCase();
  const typeLower = (file.type || '').toLowerCase();

  // Validate type: robust check for MP4, MOV, WEBM
  const isTypeValid =
    ALLOWED_VIDEO_TYPES.includes(typeLower) ||
    ALLOWED_VIDEO_EXTENSIONS.some((ext) => nameLower.endsWith(ext)) ||
    typeLower.startsWith('video/') ||
    nameLower.endsWith('.mp4') ||
    nameLower.endsWith('.mov') ||
    nameLower.endsWith('.webm');

  if (!isTypeValid) {
    throw new Error('Yalnız MP4, MOV və WEBM formatlı videolar qəbul olunur.');
  }

  // Validate size
  if (file.size > MAX_VIDEO_SIZE) {
    throw new Error(`Video ölçüsü 100MB-dan çox ola bilməz (Mövcud: ${formatFileSize(file.size)}).`);
  }

  onProgress?.(15, 'Video qəbul edilir...');

  const ext = file.name.split('.').pop()?.toLowerCase() || 'mp4';
  const cleanExt = ['mp4', 'mov', 'webm'].includes(ext) ? ext : 'mp4';
  const videoFilename = `video_${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${cleanExt}`;
  const relativeUrl = `/uploads/videos/${videoFilename}`;

  // Immediate live blob URL for current browser session
  try {
    const liveBlobUrl = URL.createObjectURL(file);
    registerVideoBlobUrl(relativeUrl, liveBlobUrl);
    registerVideoBlobUrl(videoFilename, liveBlobUrl);
  } catch (e) {
    console.warn('Could not create ObjectURL:', e);
  }

  // Store in local IndexedDB for immediate zero-latency access
  try {
    await saveVideoBlobToIDB(relativeUrl, file, file.name);
    await saveVideoBlobToIDB(videoFilename, file, file.name);
  } catch (idbErr) {
    console.warn('IDB save error:', idbErr);
  }

  // Upload to Firestore in parallel so it works on Netlify and all client devices
  try {
    await saveVideoToFirestore(videoFilename, file, file.name, onProgress);
  } catch (cloudErr) {
    console.warn('Firestore video cloud save error, falling back to local/server:', cloudErr);
  }

  // Also upload to Express server if reachable
  if (file.size <= 28 * 1024 * 1024) {
    try {
      const formData = new FormData();
      formData.append('video', file, videoFilename);
      fetch('/api/upload-video', {
        method: 'POST',
        body: formData,
      }).catch(() => {});
    } catch (_) {}
  }

  onProgress?.(100, 'Uğurla yükləndi');
  return {
    videoUrl: relativeUrl,
    sizeStr: formatFileSize(file.size),
    originalName: file.name,
  };
}


/**
 * Cleans up all associated media for a deleted product from IndexedDB
 */
export async function deleteMediaForProduct(productId: string): Promise<void> {
  try {
    const db = await openMediaDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const index = store.index('productId');
    const request = index.getAllKeys(productId);

    request.onsuccess = () => {
      const keys = request.result;
      keys.forEach((key) => store.delete(key));
    };
  } catch (err) {
    console.warn('IndexedDB product media cleanup note:', err);
  }
}

import { createWorker, Worker } from 'tesseract.js';

let worker: Worker | null = null;

export async function initializeOcr(
  onProgress?: (progress: number) => void
): Promise<void> {
  worker = await createWorker('eng+kor', 1, {
    logger: (m) => {
      if (m.status === 'recognizing text' && onProgress) {
        onProgress(Math.round(m.progress * 100));
      }
    },
  });
}

export async function recognizeText(
  image: File | Blob,
  onProgress?: (progress: number) => void
): Promise<string> {
  if (!worker) {
    await initializeOcr(onProgress);
  }

  const result = await worker!.recognize(image);
  return result.data.text;
}

export async function terminateOcr(): Promise<void> {
  if (worker) {
    await worker.terminate();
    worker = null;
  }
}

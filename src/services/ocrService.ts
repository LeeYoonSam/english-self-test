import { createWorker, Worker } from 'tesseract.js';
import heic2any from 'heic2any';
import { preprocessImage } from './imagePreprocessor';

let worker: Worker | null = null;

function isHeicFile(file: File): boolean {
  return (
    file.type === 'image/heic' ||
    file.type === 'image/heif' ||
    file.name.toLowerCase().endsWith('.heic') ||
    file.name.toLowerCase().endsWith('.heif')
  );
}

async function convertHeicToJpeg(file: File): Promise<Blob> {
  const result = await heic2any({
    blob: file,
    toType: 'image/jpeg',
    quality: 0.9,
  });
  return result as Blob;
}

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

  // HEIC 파일인 경우 JPEG로 변환
  let processableImage: File | Blob = image;
  if (image instanceof File && isHeicFile(image)) {
    processableImage = await convertHeicToJpeg(image);
  }

  // 이미지 전처리 (OCR 인식률 향상)
  const preprocessedImage = await preprocessImage(processableImage);

  const result = await worker!.recognize(preprocessedImage);
  return result.data.text;
}

export async function terminateOcr(): Promise<void> {
  if (worker) {
    await worker.terminate();
    worker = null;
  }
}

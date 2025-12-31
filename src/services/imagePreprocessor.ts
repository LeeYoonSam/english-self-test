/**
 * 이미지 전처리 서비스
 * OCR 인식률 향상을 위한 이미지 전처리 기능 제공
 */

export interface PreprocessOptions {
  grayscale?: boolean;
  contrast?: number; // 1.0 = 기본, 1.5 = 50% 증가
  brightness?: number; // 1.0 = 기본
  sharpen?: boolean;
  threshold?: number; // 0-255, 설정 시 이진화 적용
}

const DEFAULT_OPTIONS: PreprocessOptions = {
  grayscale: true,
  contrast: 1.5,
  brightness: 1.1,
  sharpen: true,
};

/**
 * 이미지 파일을 전처리하여 OCR에 최적화된 Blob 반환
 */
export async function preprocessImage(
  file: File | Blob,
  options: PreprocessOptions = DEFAULT_OPTIONS
): Promise<Blob> {
  const imageBitmap = await createImageBitmap(file);

  const canvas = document.createElement('canvas');
  canvas.width = imageBitmap.width;
  canvas.height = imageBitmap.height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas context not available');
  }

  // 원본 이미지 그리기
  ctx.drawImage(imageBitmap, 0, 0);

  // 이미지 데이터 가져오기
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // 그레이스케일 변환
  if (options.grayscale) {
    for (let i = 0; i < data.length; i += 4) {
      const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      data[i] = gray;
      data[i + 1] = gray;
      data[i + 2] = gray;
    }
  }

  // 밝기 조정
  if (options.brightness && options.brightness !== 1) {
    for (let i = 0; i < data.length; i += 4) {
      data[i] = clamp(data[i] * options.brightness);
      data[i + 1] = clamp(data[i + 1] * options.brightness);
      data[i + 2] = clamp(data[i + 2] * options.brightness);
    }
  }

  // 대비 조정
  if (options.contrast && options.contrast !== 1) {
    const factor = (259 * (options.contrast * 255 + 255)) / (255 * (259 - options.contrast * 255));
    for (let i = 0; i < data.length; i += 4) {
      data[i] = clamp(factor * (data[i] - 128) + 128);
      data[i + 1] = clamp(factor * (data[i + 1] - 128) + 128);
      data[i + 2] = clamp(factor * (data[i + 2] - 128) + 128);
    }
  }

  // 이진화 (threshold 설정 시)
  if (options.threshold !== undefined) {
    for (let i = 0; i < data.length; i += 4) {
      const value = data[i] > options.threshold ? 255 : 0;
      data[i] = value;
      data[i + 1] = value;
      data[i + 2] = value;
    }
  }

  // 처리된 이미지 데이터 적용
  ctx.putImageData(imageData, 0, 0);

  // 샤프닝 (convolution filter)
  if (options.sharpen) {
    const sharpenedData = applySharpen(ctx, canvas.width, canvas.height);
    ctx.putImageData(sharpenedData, 0, 0);
  }

  // Blob으로 변환
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to convert canvas to blob'));
        }
      },
      'image/png',
      1.0
    );
  });
}

/**
 * 값을 0-255 범위로 제한
 */
function clamp(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)));
}

/**
 * 샤프닝 필터 적용
 */
function applySharpen(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): ImageData {
  const srcData = ctx.getImageData(0, 0, width, height);
  const src = srcData.data;
  const dst = new Uint8ClampedArray(src.length);

  // 샤프닝 커널
  const kernel = [
    0, -1, 0,
    -1, 5, -1,
    0, -1, 0
  ];

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      for (let c = 0; c < 3; c++) {
        let sum = 0;
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const idx = ((y + ky) * width + (x + kx)) * 4 + c;
            sum += src[idx] * kernel[(ky + 1) * 3 + (kx + 1)];
          }
        }
        dst[(y * width + x) * 4 + c] = clamp(sum);
      }
      dst[(y * width + x) * 4 + 3] = 255; // Alpha
    }
  }

  // 테두리 복사
  for (let x = 0; x < width; x++) {
    for (let c = 0; c < 4; c++) {
      dst[x * 4 + c] = src[x * 4 + c];
      dst[((height - 1) * width + x) * 4 + c] = src[((height - 1) * width + x) * 4 + c];
    }
  }
  for (let y = 0; y < height; y++) {
    for (let c = 0; c < 4; c++) {
      dst[y * width * 4 + c] = src[y * width * 4 + c];
      dst[(y * width + width - 1) * 4 + c] = src[(y * width + width - 1) * 4 + c];
    }
  }

  return new ImageData(dst, width, height);
}

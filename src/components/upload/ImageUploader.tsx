import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Button } from '../common/Button';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  isProcessing: boolean;
}

export function ImageUploader({ onImageSelect, isProcessing }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFile(file);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    // 미리보기 생성
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    onImageSelect(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${isProcessing ? 'pointer-events-none opacity-50' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={isProcessing}
        />

        {preview ? (
          <div className="space-y-4">
            <img
              src={preview}
              alt="업로드된 이미지"
              className="max-h-64 mx-auto rounded-lg shadow"
            />
            <p className="text-sm text-gray-500">
              다른 이미지를 업로드하려면 클릭하거나 드래그하세요
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-6xl">📷</div>
            <div>
              <p className="text-lg font-medium text-gray-700">
                이미지를 드래그하거나 클릭하여 업로드
              </p>
              <p className="text-sm text-gray-500 mt-1">
                영어 단어책 사진을 업로드하세요
              </p>
            </div>
            <Button variant="secondary" disabled={isProcessing}>
              파일 선택
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

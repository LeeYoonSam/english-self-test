import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WordItem, WordList } from '../types';
import { useOcr } from '../hooks/useOcr';
import { useApp } from '../contexts/AppContext';
import { generateId } from '../utils/shuffle';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { ProgressBar } from '../components/common/ProgressBar';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ImageUploader } from '../components/upload/ImageUploader';
import { WordListEditor } from '../components/upload/WordListEditor';

type Step = 'upload' | 'processing' | 'edit';

export function UploadPage() {
  const navigate = useNavigate();
  const { addWordList } = useApp();
  const { status, progress, extractedText, processImage, reset } = useOcr();
  const [step, setStep] = useState<Step>('upload');
  const [words, setWords] = useState<WordItem[]>([]);

  const handleImageSelect = async (file: File) => {
    setStep('processing');
    const parsedWords = await processImage(file);
    setWords(parsedWords);
    setStep('edit');
  };

  const handleSave = (name: string) => {
    const wordList: WordList = {
      id: generateId(),
      name,
      words,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    addWordList(wordList);
    navigate('/');
  };

  const handleReset = () => {
    reset();
    setWords([]);
    setStep('upload');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">새 단어장 만들기</h1>
          <Button variant="secondary" onClick={() => navigate('/')}>
            취소
          </Button>
        </div>

        <Card>
          {step === 'upload' && (
            <div className="space-y-6">
              <p className="text-gray-600">
                영어 단어책 사진을 업로드하면 자동으로 단어와 뜻을 추출합니다.
              </p>
              <ImageUploader
                onImageSelect={handleImageSelect}
                isProcessing={status === 'processing'}
              />
            </div>
          )}

          {step === 'processing' && (
            <div className="py-12 text-center space-y-6">
              <LoadingSpinner size="lg" />
              <div>
                <p className="text-lg font-medium text-gray-700">
                  이미지를 분석하고 있습니다...
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  잠시만 기다려주세요
                </p>
              </div>
              <ProgressBar progress={progress} className="max-w-xs mx-auto" />
            </div>
          )}

          {step === 'edit' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">단어 목록 편집</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    인식된 단어를 확인하고 수정하세요
                  </p>
                </div>
                <Button variant="secondary" onClick={handleReset}>
                  다시 업로드
                </Button>
              </div>

              {extractedText && (
                <details className="text-sm">
                  <summary className="cursor-pointer text-gray-500 hover:text-gray-700">
                    원본 텍스트 보기
                  </summary>
                  <pre className="mt-2 p-4 bg-gray-50 rounded-lg overflow-auto max-h-48 text-xs">
                    {extractedText}
                  </pre>
                </details>
              )}

              <WordListEditor
                words={words}
                onUpdate={setWords}
                onSave={handleSave}
              />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

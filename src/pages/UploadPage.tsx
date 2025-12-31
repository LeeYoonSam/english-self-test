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
import { RawTextEditor } from '../components/upload/RawTextEditor';

type Step = 'select' | 'upload' | 'processing' | 'edit';
type EditMode = 'list' | 'raw';
type InputMethod = 'image' | 'manual';

export function UploadPage() {
  const navigate = useNavigate();
  const { addWordList } = useApp();
  const { status, progress, extractedText, processImage, reset } = useOcr();
  const [step, setStep] = useState<Step>('select');
  const [inputMethod, setInputMethod] = useState<InputMethod | null>(null);
  const [words, setWords] = useState<WordItem[]>([]);
  const [editMode, setEditMode] = useState<EditMode>('raw');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageSelect = async (file: File) => {
    // 이미지 미리보기 저장
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

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
    setImagePreview(null);
    setEditMode('raw');
    setInputMethod(null);
    setStep('select');
  };

  const handleRawParse = (parsedWords: WordItem[]) => {
    setWords(parsedWords);
    setEditMode('list');
  };

  const handleSelectMethod = (method: InputMethod) => {
    setInputMethod(method);
    if (method === 'image') {
      setStep('upload');
    } else {
      setStep('edit');
    }
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
          {step === 'select' && (
            <div className="space-y-6">
              <p className="text-gray-600 text-center">
                단어장을 만들 방법을 선택하세요
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => handleSelectMethod('image')}
                  className="p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                >
                  <div className="text-4xl mb-3">📷</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">사진으로 추가</h3>
                  <p className="text-sm text-gray-500">
                    단어책 사진을 업로드하면 OCR로 자동 추출합니다
                  </p>
                </button>
                <button
                  onClick={() => handleSelectMethod('manual')}
                  className="p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                >
                  <div className="text-4xl mb-3">✏️</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">직접 입력</h3>
                  <p className="text-sm text-gray-500">
                    단어와 뜻을 직접 입력하여 단어장을 만듭니다
                  </p>
                </button>
              </div>
            </div>
          )}

          {step === 'upload' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-gray-600">
                  영어 단어책 사진을 업로드하면 자동으로 단어와 뜻을 추출합니다.
                </p>
                <Button variant="secondary" onClick={handleReset}>
                  뒤로
                </Button>
              </div>
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
                    {editMode === 'raw'
                      ? (inputMethod === 'manual' ? '단어와 뜻을 입력하세요' : 'OCR 결과를 확인하고 텍스트를 수정하세요')
                      : '단어를 확인하고 수정하세요'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={editMode === 'raw' ? 'primary' : 'secondary'}
                    onClick={() => setEditMode('raw')}
                  >
                    텍스트 편집
                  </Button>
                  <Button
                    variant={editMode === 'list' ? 'primary' : 'secondary'}
                    onClick={() => setEditMode('list')}
                  >
                    목록 편집
                  </Button>
                  <Button variant="secondary" onClick={handleReset}>
                    처음으로
                  </Button>
                </div>
              </div>

              {inputMethod === 'image' && imagePreview && (
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <p className="text-sm text-gray-600 mb-2">원본 이미지 (참고용)</p>
                  <img
                    src={imagePreview}
                    alt="업로드된 이미지"
                    className="max-h-48 rounded-lg shadow mx-auto"
                  />
                </div>
              )}

              {editMode === 'raw' ? (
                <RawTextEditor
                  initialText={extractedText || ''}
                  onParse={handleRawParse}
                />
              ) : (
                <WordListEditor
                  words={words}
                  onUpdate={setWords}
                  onSave={handleSave}
                />
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TestMode } from '../types';
import { useApp } from '../contexts/AppContext';
import { useTest } from '../hooks/useTest';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { TestModeSelector } from '../components/test/TestModeSelector';
import { QuestionCard } from '../components/test/QuestionCard';
import { ProgressIndicator } from '../components/test/ProgressIndicator';

type PageStep = 'mode-select' | 'testing';

export function TestPage() {
  const { listId } = useParams<{ listId: string }>();
  const navigate = useNavigate();
  const { getWordListById } = useApp();
  const [step, setStep] = useState<PageStep>('mode-select');
  const [mode, setMode] = useState<TestMode>('word-to-meaning');

  const wordList = listId ? getWordListById(listId) : undefined;

  const {
    currentQuestion,
    progress,
    isCompleted,
    result,
    startTest,
    submitAnswer,
    resetTest,
  } = useTest(wordList || null, mode);

  // 테스트 완료 시 결과 페이지로 이동
  useEffect(() => {
    if (isCompleted && result && listId) {
      // 결과를 sessionStorage에 저장 (페이지 이동 시 전달)
      sessionStorage.setItem('testResult', JSON.stringify(result));
      navigate(`/result/${listId}`);
    }
  }, [isCompleted, result, listId, navigate]);

  if (!wordList) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="text-center py-12">
            <p className="text-gray-500">단어장을 찾을 수 없습니다.</p>
            <Button className="mt-4" onClick={() => navigate('/')}>
              홈으로 돌아가기
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const handleModeSelect = (selectedMode: TestMode) => {
    setMode(selectedMode);
    setStep('testing');
  };

  // step이 변경되고 testing 모드로 전환될 때 테스트 시작
  useEffect(() => {
    if (step === 'testing' && !currentQuestion) {
      startTest();
    }
  }, [step, currentQuestion, startTest]);

  const handleReset = () => {
    resetTest();
    setStep('mode-select');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{wordList.name}</h1>
            <p className="text-gray-500">{wordList.words.length}개 단어</p>
          </div>
          <Button variant="secondary" onClick={() => navigate('/')}>
            나가기
          </Button>
        </div>

        <Card>
          {step === 'mode-select' && (
            <TestModeSelector onSelect={handleModeSelect} />
          )}

          {step === 'testing' && currentQuestion && (
            <div className="space-y-8">
              <ProgressIndicator
                current={progress.current}
                total={progress.total}
              />

              <QuestionCard
                question={currentQuestion}
                onAnswer={submitAnswer}
              />

              <div className="text-center">
                <button
                  onClick={handleReset}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  테스트 중단
                </button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

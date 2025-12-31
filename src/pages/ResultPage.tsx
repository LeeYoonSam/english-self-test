import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TestResult } from '../types';
import { useApp } from '../contexts/AppContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { ScoreBoard } from '../components/result/ScoreBoard';
import { WrongAnswerList } from '../components/result/WrongAnswerList';

export function ResultPage() {
  const { listId } = useParams<{ listId: string }>();
  const navigate = useNavigate();
  const { getWordListById } = useApp();
  const [result, setResult] = useState<TestResult | null>(null);

  const wordList = listId ? getWordListById(listId) : undefined;

  // sessionStorage에서 결과 로드
  useEffect(() => {
    const storedResult = sessionStorage.getItem('testResult');
    if (storedResult) {
      setResult(JSON.parse(storedResult));
    }
  }, []);

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

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="text-center py-12">
            <p className="text-gray-500">테스트 결과가 없습니다.</p>
            <Button className="mt-4" onClick={() => navigate(`/test/${listId}`)}>
              테스트 시작하기
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const handleRetry = () => {
    sessionStorage.removeItem('testResult');
    navigate(`/test/${listId}`);
  };

  const handleHome = () => {
    sessionStorage.removeItem('testResult');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">테스트 결과</h1>
            <p className="text-gray-500">{wordList.name}</p>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <ScoreBoard result={result} />
          </Card>

          <Card>
            <WrongAnswerList wrongAnswers={result.wrongAnswers} />
          </Card>

          <div className="flex gap-4 justify-center">
            <Button onClick={handleRetry} size="lg">
              다시 테스트
            </Button>
            <Button variant="secondary" onClick={handleHome} size="lg">
              처음으로
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

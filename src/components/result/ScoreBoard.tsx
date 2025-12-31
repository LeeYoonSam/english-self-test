import { TestResult } from '../../types';

interface ScoreBoardProps {
  result: TestResult;
}

export function ScoreBoard({ result }: ScoreBoardProps) {
  const { totalCount, correctCount, wrongCount, score } = result;

  // 점수에 따른 색상
  const getScoreColor = () => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  // 점수에 따른 메시지
  const getMessage = () => {
    if (score === 100) return '완벽해요! 모든 단어를 맞췄습니다!';
    if (score >= 90) return '훌륭해요! 거의 다 맞췄습니다!';
    if (score >= 70) return '잘했어요! 조금만 더 연습하면 완벽해질 거예요!';
    if (score >= 50) return '괜찮아요! 틀린 단어를 복습해보세요.';
    return '더 많은 연습이 필요해요. 다시 도전해보세요!';
  };

  return (
    <div className="text-center space-y-6">
      <div>
        <div className={`text-7xl font-bold ${getScoreColor()}`}>
          {score}점
        </div>
        <p className="text-gray-500 mt-2">{getMessage()}</p>
      </div>

      <div className="flex justify-center gap-8">
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600">{correctCount}</div>
          <div className="text-sm text-gray-500">정답</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-red-600">{wrongCount}</div>
          <div className="text-sm text-gray-500">오답</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-600">{totalCount}</div>
          <div className="text-sm text-gray-500">총 문제</div>
        </div>
      </div>

      {/* 시각적 표현 */}
      <div className="max-w-xs mx-auto">
        <div className="h-4 bg-gray-200 rounded-full overflow-hidden flex">
          <div
            className="bg-green-500 transition-all duration-500"
            style={{ width: `${(correctCount / totalCount) * 100}%` }}
          />
          <div
            className="bg-red-500 transition-all duration-500"
            style={{ width: `${(wrongCount / totalCount) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

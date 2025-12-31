import { Answer } from '../../types';

interface WrongAnswerListProps {
  wrongAnswers: Answer[];
}

export function WrongAnswerList({ wrongAnswers }: WrongAnswerListProps) {
  if (wrongAnswers.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-5xl mb-4">🎉</div>
        <p className="text-gray-600">틀린 단어가 없습니다!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-900">
        틀린 단어 ({wrongAnswers.length}개)
      </h3>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">단어</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">정답</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">내 답안</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {wrongAnswers.map((answer) => (
              <tr key={answer.questionId} className="hover:bg-red-50">
                <td className="px-4 py-3 font-medium text-gray-900">
                  {answer.wordItem.word}
                </td>
                <td className="px-4 py-3 text-green-600">
                  {answer.correctAnswer}
                </td>
                <td className="px-4 py-3 text-red-600">
                  {answer.userAnswer || '(미입력)'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

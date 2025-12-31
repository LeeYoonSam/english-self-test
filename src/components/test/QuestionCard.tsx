import { useState, useEffect, FormEvent, KeyboardEvent } from 'react';
import { Question } from '../../types';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

interface QuestionCardProps {
  question: Question;
  onAnswer: (answer: string) => void;
}

export function QuestionCard({ question, onAnswer }: QuestionCardProps) {
  const [answer, setAnswer] = useState('');

  // 문제가 바뀔 때 입력 초기화
  useEffect(() => {
    setAnswer('');
  }, [question.id]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (answer.trim()) {
      onAnswer(answer);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && answer.trim()) {
      onAnswer(answer);
    }
  };

  // 문제 표시 (모드에 따라 다름)
  const questionText = question.mode === 'word-to-meaning'
    ? question.wordItem.word
    : question.wordItem.meaning;

  const placeholder = question.mode === 'word-to-meaning'
    ? '뜻을 입력하세요'
    : '영어 단어를 입력하세요';

  return (
    <Card className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="text-center py-8">
          <p className="text-sm text-gray-500 mb-4">
            {question.mode === 'word-to-meaning' ? '이 단어의 뜻은?' : '이 뜻의 영어 단어는?'}
          </p>
          <p className="text-4xl font-bold text-gray-900">
            {questionText}
          </p>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center"
            autoFocus
            autoComplete="off"
          />

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={!answer.trim()}
          >
            제출
          </Button>
        </div>
      </form>
    </Card>
  );
}

import { TestMode } from '../../types';
import { Card } from '../common/Card';

interface TestModeSelectorProps {
  onSelect: (mode: TestMode) => void;
}

export function TestModeSelector({ onSelect }: TestModeSelectorProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 text-center">
        테스트 모드를 선택하세요
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        <Card
          className="hover:border-blue-500 border-2 border-transparent cursor-pointer"
          onClick={() => onSelect('word-to-meaning')}
        >
          <div className="text-center space-y-4">
            <div className="text-5xl">📝</div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">단어 → 뜻</h3>
              <p className="text-gray-500 mt-2">
                영어 단어를 보고 한글 뜻을 맞추세요
              </p>
            </div>
          </div>
        </Card>

        <Card
          className="hover:border-blue-500 border-2 border-transparent cursor-pointer"
          onClick={() => onSelect('meaning-to-word')}
        >
          <div className="text-center space-y-4">
            <div className="text-5xl">🔤</div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">뜻 → 단어</h3>
              <p className="text-gray-500 mt-2">
                한글 뜻을 보고 영어 단어를 맞추세요
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

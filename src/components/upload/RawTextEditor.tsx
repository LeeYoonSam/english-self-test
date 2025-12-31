import { useState, useEffect } from 'react';
import { WordItem } from '../../types';
import { parseWordList } from '../../services/parserService';
import { Button } from '../common/Button';

interface RawTextEditorProps {
  initialText: string;
  onParse: (words: WordItem[]) => void;
}

export function RawTextEditor({ initialText, onParse }: RawTextEditorProps) {
  const [text, setText] = useState(initialText);
  const [preview, setPreview] = useState<WordItem[]>([]);

  useEffect(() => {
    const parsed = parseWordList(text);
    setPreview(parsed);
  }, [text]);

  const handleApply = () => {
    onParse(preview);
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800 font-medium mb-2">입력 형식 안내</p>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>한 줄에 하나씩: <code className="bg-blue-100 px-1 rounded">영어단어 - 한글뜻</code></li>
          <li>구분자: <code className="bg-blue-100 px-1 rounded">-</code>, <code className="bg-blue-100 px-1 rounded">:</code>, <code className="bg-blue-100 px-1 rounded">탭</code>, <code className="bg-blue-100 px-1 rounded">공백 2개 이상</code></li>
          <li>예시: <code className="bg-blue-100 px-1 rounded">apple - 사과</code> 또는 <code className="bg-blue-100 px-1 rounded">banana : 바나나</code></li>
        </ul>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            텍스트 입력/수정
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-64 p-3 border border-gray-300 rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="영어단어 - 한글뜻&#10;apple - 사과&#10;banana - 바나나"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            파싱 미리보기 ({preview.length}개 인식됨)
          </label>
          <div className="h-64 p-3 border border-gray-300 rounded-lg bg-gray-50 overflow-auto">
            {preview.length === 0 ? (
              <p className="text-gray-400 text-sm">인식된 단어가 없습니다</p>
            ) : (
              <ul className="space-y-1">
                {preview.map((item, index) => (
                  <li key={item.id} className="text-sm">
                    <span className="font-medium text-gray-900">{index + 1}. {item.word}</span>
                    <span className="text-gray-500"> - {item.meaning}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleApply} disabled={preview.length === 0}>
          {preview.length}개 단어 적용하기
        </Button>
      </div>
    </div>
  );
}

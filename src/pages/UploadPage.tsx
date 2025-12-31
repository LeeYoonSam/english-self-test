import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WordItem, WordList } from '../types';
import { useApp } from '../contexts/AppContext';
import { generateId } from '../utils/shuffle';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { WordListEditor } from '../components/upload/WordListEditor';
import { RawTextEditor } from '../components/upload/RawTextEditor';

type EditMode = 'list' | 'raw';

export function UploadPage() {
  const navigate = useNavigate();
  const { addWordList } = useApp();
  const [words, setWords] = useState<WordItem[]>([]);
  const [editMode, setEditMode] = useState<EditMode>('raw');

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

  const handleRawParse = (parsedWords: WordItem[]) => {
    setWords(parsedWords);
    setEditMode('list');
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
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium text-gray-900">단어 목록 편집</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {editMode === 'raw' ? '단어와 뜻을 입력하세요' : '단어를 확인하고 수정하세요'}
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
              </div>
            </div>

            {editMode === 'raw' ? (
              <RawTextEditor
                initialText=""
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
        </Card>
      </div>
    </div>
  );
}

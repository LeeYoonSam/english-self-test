import { useState } from 'react';
import { WordItem } from '../../types';
import { Button } from '../common/Button';
import { generateId } from '../../utils/shuffle';

interface WordListEditorProps {
  words: WordItem[];
  onUpdate: (words: WordItem[]) => void;
  onSave: (name: string) => void;
}

export function WordListEditor({ words, onUpdate, onSave }: WordListEditorProps) {
  const [listName, setListName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editWord, setEditWord] = useState('');
  const [editMeaning, setEditMeaning] = useState('');

  const handleEdit = (item: WordItem) => {
    setEditingId(item.id);
    setEditWord(item.word);
    setEditMeaning(item.meaning);
  };

  const handleSaveEdit = () => {
    if (!editingId) return;

    const updated = words.map(w =>
      w.id === editingId
        ? { ...w, word: editWord.trim(), meaning: editMeaning.trim() }
        : w
    );
    onUpdate(updated);
    setEditingId(null);
    setEditWord('');
    setEditMeaning('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditWord('');
    setEditMeaning('');
  };

  const handleDelete = (id: string) => {
    onUpdate(words.filter(w => w.id !== id));
  };

  const handleAddNew = () => {
    const newWord: WordItem = {
      id: generateId(),
      word: '',
      meaning: '',
      createdAt: Date.now(),
    };
    onUpdate([...words, newWord]);
    handleEdit(newWord);
  };

  const handleSubmit = () => {
    if (!listName.trim()) {
      alert('단어장 이름을 입력해주세요.');
      return;
    }
    if (words.length === 0) {
      alert('최소 1개 이상의 단어가 필요합니다.');
      return;
    }
    // 빈 단어 제거
    const validWords = words.filter(w => w.word.trim() && w.meaning.trim());
    if (validWords.length === 0) {
      alert('유효한 단어가 없습니다. 단어와 뜻을 모두 입력해주세요.');
      return;
    }
    onUpdate(validWords);
    onSave(listName.trim());
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          단어장 이름
        </label>
        <input
          type="text"
          value={listName}
          onChange={(e) => setListName(e.target.value)}
          placeholder="예: 토익 필수 단어 Day 1"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">영어 단어</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">뜻</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-600 w-24">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {words.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                {editingId === item.id ? (
                  <>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={editWord}
                        onChange={(e) => setEditWord(e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        placeholder="영어 단어"
                        autoFocus
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={editMeaning}
                        onChange={(e) => setEditMeaning(e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        placeholder="뜻"
                      />
                    </td>
                    <td className="px-4 py-2 text-right space-x-1">
                      <button
                        onClick={handleSaveEdit}
                        className="text-green-600 hover:text-green-800 text-sm"
                      >
                        저장
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="text-gray-600 hover:text-gray-800 text-sm"
                      >
                        취소
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-3 text-gray-900">{item.word || '-'}</td>
                    <td className="px-4 py-3 text-gray-700">{item.meaning || '-'}</td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        삭제
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center">
        <Button variant="secondary" onClick={handleAddNew}>
          + 단어 추가
        </Button>
        <div className="text-sm text-gray-500">
          총 {words.filter(w => w.word.trim() && w.meaning.trim()).length}개 단어
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4 border-t">
        <Button onClick={handleSubmit} size="lg">
          단어장 저장
        </Button>
      </div>
    </div>
  );
}

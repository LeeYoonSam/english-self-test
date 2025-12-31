import { useState, useEffect, useCallback } from 'react';
import { WordList } from '../types';
import { loadWordLists, saveWordLists, addWordList as addToStorage, deleteWordList as deleteFromStorage } from '../services/storageService';

export function useLocalStorage() {
  const [wordLists, setWordLists] = useState<WordList[]>([]);

  // 초기 로드
  useEffect(() => {
    const lists = loadWordLists();
    setWordLists(lists);
  }, []);

  // 단어 목록 추가
  const addWordList = useCallback((wordList: WordList) => {
    addToStorage(wordList);
    setWordLists(prev => [...prev, wordList]);
  }, []);

  // 단어 목록 삭제
  const deleteWordList = useCallback((id: string) => {
    deleteFromStorage(id);
    setWordLists(prev => prev.filter(wl => wl.id !== id));
  }, []);

  // 단어 목록 업데이트
  const updateWordList = useCallback((updatedList: WordList) => {
    const lists = loadWordLists();
    const index = lists.findIndex(wl => wl.id === updatedList.id);
    if (index !== -1) {
      lists[index] = updatedList;
      saveWordLists(lists);
      setWordLists(lists);
    }
  }, []);

  // ID로 단어 목록 찾기
  const getWordListById = useCallback((id: string): WordList | undefined => {
    return wordLists.find(wl => wl.id === id);
  }, [wordLists]);

  return {
    wordLists,
    addWordList,
    deleteWordList,
    updateWordList,
    getWordListById,
  };
}

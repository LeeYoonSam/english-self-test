import { WordList } from '../types';

const STORAGE_KEY = 'english-self-test-word-lists';

export function saveWordLists(wordLists: WordList[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(wordLists));
}

export function loadWordLists(): WordList[] {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];

  try {
    return JSON.parse(data) as WordList[];
  } catch {
    return [];
  }
}

export function addWordList(wordList: WordList): void {
  const wordLists = loadWordLists();
  wordLists.push(wordList);
  saveWordLists(wordLists);
}

export function deleteWordList(id: string): void {
  const wordLists = loadWordLists();
  saveWordLists(wordLists.filter(wl => wl.id !== id));
}

export function getWordListById(id: string): WordList | undefined {
  const wordLists = loadWordLists();
  return wordLists.find(wl => wl.id === id);
}

export function updateWordList(updatedList: WordList): void {
  const wordLists = loadWordLists();
  const index = wordLists.findIndex(wl => wl.id === updatedList.id);
  if (index !== -1) {
    wordLists[index] = updatedList;
    saveWordLists(wordLists);
  }
}

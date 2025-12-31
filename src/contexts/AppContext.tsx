import { createContext, useContext, ReactNode } from 'react';
import { WordList } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface AppContextType {
  wordLists: WordList[];
  addWordList: (wordList: WordList) => void;
  deleteWordList: (id: string) => void;
  updateWordList: (wordList: WordList) => void;
  getWordListById: (id: string) => WordList | undefined;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const {
    wordLists,
    addWordList,
    deleteWordList,
    updateWordList,
    getWordListById,
  } = useLocalStorage();

  return (
    <AppContext.Provider
      value={{
        wordLists,
        addWordList,
        deleteWordList,
        updateWordList,
        getWordListById,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

// 단어 항목
export interface WordItem {
  id: string;
  word: string;        // 영어 단어
  meaning: string;     // 한글 뜻
  createdAt: number;
}

// 단어 목록 (저장 단위)
export interface WordList {
  id: string;
  name: string;
  words: WordItem[];
  createdAt: number;
  updatedAt: number;
}

// 테스트 모드
export type TestMode = 'word-to-meaning' | 'meaning-to-word';

// 테스트 문제
export interface Question {
  id: string;
  wordItem: WordItem;
  mode: TestMode;
}

// 테스트 답안
export interface Answer {
  questionId: string;
  wordItem: WordItem;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

// 테스트 세션
export interface TestSession {
  id: string;
  wordListId: string;
  mode: TestMode;
  questions: Question[];
  answers: Answer[];
  currentIndex: number;
  startedAt: number;
  completedAt?: number;
}

// 테스트 결과
export interface TestResult {
  sessionId: string;
  totalCount: number;
  correctCount: number;
  wrongCount: number;
  score: number;          // 백분율
  wrongAnswers: Answer[];
  completedAt: number;
}

// OCR 처리 상태
export interface OcrState {
  status: 'idle' | 'loading' | 'processing' | 'completed' | 'error';
  progress: number;       // 0-100
  extractedText: string;
  error?: string;
}

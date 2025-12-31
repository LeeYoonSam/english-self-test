import { WordItem } from '../types';
import { generateId } from '../utils/shuffle';

// 지원하는 구분자 패턴
const DELIMITERS = [
  /\s*[-–—:]\s*/,      // 하이픈, 대시, 콜론
  /\s{2,}/,            // 2개 이상의 공백
  /\t+/,               // 탭
];

// 영어 단어 패턴 (공백, 하이픈, 어포스트로피 포함)
const ENGLISH_WORD_PATTERN = /^[a-zA-Z][a-zA-Z\s\-']*$/;

// 한글 포함 패턴
const KOREAN_PATTERN = /[가-힣]/;

export function parseWordList(text: string): WordItem[] {
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  const wordItems: WordItem[] = [];

  for (const line of lines) {
    const parsed = parseLine(line.trim());
    if (parsed) {
      wordItems.push({
        id: generateId(),
        word: parsed.word,
        meaning: parsed.meaning,
        createdAt: Date.now(),
      });
    }
  }

  return wordItems;
}

function parseLine(line: string): { word: string; meaning: string } | null {
  // 각 구분자로 시도
  for (const delimiter of DELIMITERS) {
    const parts = line.split(delimiter).filter(p => p.trim().length > 0);

    if (parts.length >= 2) {
      const firstPart = parts[0].trim();
      const secondPart = parts.slice(1).join(' ').trim();

      // 첫 번째 부분이 영어이고 두 번째가 한글을 포함하면
      if (ENGLISH_WORD_PATTERN.test(firstPart) && KOREAN_PATTERN.test(secondPart)) {
        return { word: firstPart, meaning: secondPart };
      }

      // 반대 순서도 체크 (한글 먼저, 영어 나중)
      if (KOREAN_PATTERN.test(firstPart) && ENGLISH_WORD_PATTERN.test(secondPart)) {
        return { word: secondPart, meaning: firstPart };
      }
    }
  }

  return null;
}

// 수동 편집을 위한 raw 텍스트 반환
export function getRawLines(text: string): string[] {
  return text.split('\n').filter(line => line.trim().length > 0);
}

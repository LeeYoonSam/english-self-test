import { useState, useCallback, useMemo } from 'react';
import { WordList, TestMode, Question, Answer, TestSession, TestResult } from '../types';
import { shuffleArray, generateId } from '../utils/shuffle';

export function useTest(wordList: WordList | null, mode: TestMode) {
  const [session, setSession] = useState<TestSession | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);

  // 테스트 시작: 문제 랜덤 섞기
  const startTest = useCallback(() => {
    if (!wordList) return;

    const shuffledWords = shuffleArray([...wordList.words]);
    const questions: Question[] = shuffledWords.map(word => ({
      id: generateId(),
      wordItem: word,
      mode,
    }));

    const newSession: TestSession = {
      id: generateId(),
      wordListId: wordList.id,
      mode,
      questions,
      answers: [],
      currentIndex: 0,
      startedAt: Date.now(),
    };

    setSession(newSession);
    setAnswers([]);
  }, [wordList, mode]);

  // 현재 문제
  const currentQuestion = useMemo(() => {
    if (!session) return null;
    return session.questions[session.currentIndex] || null;
  }, [session]);

  // 진행 상황
  const progress = useMemo(() => {
    if (!session) return { current: 0, total: 0 };
    return {
      current: session.currentIndex + 1,
      total: session.questions.length,
    };
  }, [session]);

  // 답안 제출
  const submitAnswer = useCallback((userAnswer: string) => {
    if (!session || !currentQuestion) return;

    const correctAnswer = mode === 'word-to-meaning'
      ? currentQuestion.wordItem.meaning
      : currentQuestion.wordItem.word;

    // 정답 비교: 소문자로 변환 후 공백 제거하여 비교
    const normalizedUserAnswer = userAnswer.trim().toLowerCase().replace(/\s+/g, '');
    const normalizedCorrectAnswer = correctAnswer.trim().toLowerCase().replace(/\s+/g, '');
    const isCorrect = normalizedUserAnswer === normalizedCorrectAnswer;

    const answer: Answer = {
      questionId: currentQuestion.id,
      wordItem: currentQuestion.wordItem,
      userAnswer: userAnswer.trim(),
      correctAnswer,
      isCorrect,
    };

    setAnswers(prev => [...prev, answer]);

    // 다음 문제로 이동
    setSession(prev => prev ? {
      ...prev,
      currentIndex: prev.currentIndex + 1,
    } : null);
  }, [session, currentQuestion, mode]);

  // 테스트 완료 여부
  const isCompleted = useMemo(() => {
    if (!session) return false;
    return session.currentIndex >= session.questions.length;
  }, [session]);

  // 결과 계산
  const result = useMemo((): TestResult | null => {
    if (!isCompleted || !session || answers.length === 0) return null;

    const correctCount = answers.filter(a => a.isCorrect).length;
    const wrongAnswers = answers.filter(a => !a.isCorrect);

    return {
      sessionId: session.id,
      totalCount: answers.length,
      correctCount,
      wrongCount: wrongAnswers.length,
      score: Math.round((correctCount / answers.length) * 100),
      wrongAnswers,
      completedAt: Date.now(),
    };
  }, [isCompleted, session, answers]);

  // 테스트 리셋
  const resetTest = useCallback(() => {
    setSession(null);
    setAnswers([]);
  }, []);

  return {
    session,
    currentQuestion,
    progress,
    isCompleted,
    result,
    startTest,
    submitAnswer,
    resetTest,
  };
}

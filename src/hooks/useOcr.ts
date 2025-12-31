import { useState, useCallback } from 'react';
import { recognizeText, terminateOcr } from '../services/ocrService';
import { parseWordList } from '../services/parserService';
import { WordItem, OcrState } from '../types';

export function useOcr() {
  const [state, setState] = useState<OcrState>({
    status: 'idle',
    progress: 0,
    extractedText: '',
  });

  const processImage = useCallback(async (file: File): Promise<WordItem[]> => {
    setState({ status: 'loading', progress: 0, extractedText: '' });

    try {
      setState(prev => ({ ...prev, status: 'processing' }));

      const text = await recognizeText(file, (progress) => {
        setState(prev => ({ ...prev, progress }));
      });

      setState({
        status: 'completed',
        progress: 100,
        extractedText: text,
      });

      return parseWordList(text);
    } catch (error) {
      setState({
        status: 'error',
        progress: 0,
        extractedText: '',
        error: error instanceof Error ? error.message : 'OCR 처리 실패',
      });
      return [];
    }
  }, []);

  const reset = useCallback(() => {
    setState({ status: 'idle', progress: 0, extractedText: '' });
  }, []);

  const cleanup = useCallback(async () => {
    await terminateOcr();
    reset();
  }, [reset]);

  return { ...state, processImage, reset, cleanup };
}

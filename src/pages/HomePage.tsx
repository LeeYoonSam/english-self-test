import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';

export function HomePage() {
  const navigate = useNavigate();
  const { wordLists, deleteWordList } = useApp();

  const handleDelete = (id: string, name: string) => {
    if (confirm(`"${name}" 단어장을 삭제하시겠습니까?`)) {
      deleteWordList(id);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">영어 단어 테스트</h1>
            <p className="text-gray-500 mt-1">단어장을 만들고 테스트하세요</p>
          </div>
          <Button onClick={() => navigate('/upload')} size="lg">
            + 새 단어장
          </Button>
        </div>

        {wordLists.length === 0 ? (
          <Card className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-xl font-medium text-gray-700 mb-2">
              저장된 단어장이 없습니다
            </h2>
            <p className="text-gray-500 mb-6">
              단어와 뜻을 입력하여 첫 단어장을 만들어보세요
            </p>
            <Button onClick={() => navigate('/upload')}>
              단어장 만들기
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4">
            {wordLists.map((wordList) => (
              <Card
                key={wordList.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/wordlist/${wordList.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">
                      {wordList.name}
                    </h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                      <span>{wordList.words.length}개 단어</span>
                      <span>생성: {formatDate(wordList.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <Button
                      onClick={() => navigate(`/test/${wordList.id}`)}
                    >
                      테스트 시작
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(wordList.id, wordList.name)}
                    >
                      삭제
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

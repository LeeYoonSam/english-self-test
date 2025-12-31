import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';

export function WordListDetailPage() {
  const { listId } = useParams<{ listId: string }>();
  const navigate = useNavigate();
  const { wordLists, deleteWordList } = useApp();

  const wordList = wordLists.find((wl) => wl.id === listId);

  if (!wordList) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="text-center py-16">
            <div className="text-6xl mb-4">404</div>
            <h2 className="text-xl font-medium text-gray-700 mb-4">
              단어장을 찾을 수 없습니다
            </h2>
            <Button onClick={() => navigate('/')}>홈으로 돌아가기</Button>
          </Card>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    if (confirm(`"${wordList.name}" 단어장을 삭제하시겠습니까?`)) {
      deleteWordList(wordList.id);
      navigate('/');
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => navigate('/')}
              className="text-gray-500 hover:text-gray-700 mb-2 flex items-center gap-1"
            >
              ← 목록으로
            </button>
            <h1 className="text-2xl font-bold text-gray-900">{wordList.name}</h1>
            <p className="text-gray-500 mt-1">
              {wordList.words.length}개 단어 · 생성: {formatDate(wordList.createdAt)}
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate(`/test/${wordList.id}`)}>
              테스트 시작
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              삭제
            </Button>
          </div>
        </div>

        <Card>
          <div className="divide-y divide-gray-100">
            {wordList.words.map((word, index) => (
              <div
                key={word.id}
                className="py-3 flex items-center gap-4"
              >
                <span className="text-gray-400 w-8 text-right text-sm">
                  {index + 1}
                </span>
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <span className="font-medium text-gray-900">{word.word}</span>
                  <span className="text-gray-600">{word.meaning}</span>
                </div>
              </div>
            ))}
          </div>

          {wordList.words.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              등록된 단어가 없습니다
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

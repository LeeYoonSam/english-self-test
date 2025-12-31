import { Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { HomePage } from './pages/HomePage';
import { UploadPage } from './pages/UploadPage';
import { TestPage } from './pages/TestPage';
import { ResultPage } from './pages/ResultPage';

function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/test/:listId" element={<TestPage />} />
        <Route path="/result/:listId" element={<ResultPage />} />
      </Routes>
    </AppProvider>
  );
}

export default App;

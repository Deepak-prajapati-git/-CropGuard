import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { WelcomePage } from './pages/Welcome';
import { HomePage } from './pages/Home';
import { AnalyzePage } from './pages/Analyze';
import { ResultPage } from './pages/Result';
import { HistoryPage } from './pages/History';
import { FieldsPage } from './pages/Fields';
import { FieldDetailPage } from './pages/FieldDetail';
import { Shell, PageHeader } from './components/layout/Shell';
import { ToastProvider } from './components/ui/Toast';

// Simple placeholder for Library
const LibraryPage = () => (
  <Shell title="Library">
    <PageHeader title="Crop Library" subtitle="Knowledge base for crop diseases" />
    <div className="p-8 text-center text-[#66736A]">
      <p>Crop disease knowledge base coming soon.</p>
    </div>
  </Shell>
);

// Simple placeholder for Settings
const SettingsPage = () => (
  <Shell title="Settings">
    <PageHeader title="Settings" subtitle="Manage your account and preferences" />
    <div className="p-8 text-center text-[#66736A]">
      <p>Settings coming soon.</p>
    </div>
  </Shell>
);

function App() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/analyze" element={<AnalyzePage />} />
          <Route path="/result/:id" element={<ResultPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/fields" element={<FieldsPage />} />
          <Route path="/fields/:id" element={<FieldDetailPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;

import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Pets from './pages/Pets';
import CalendarPage from './pages/CalendarPage';
import Assistant from './pages/Assistant';
import { PetProvider } from './context/PetContext';
import { ThemeProvider } from './context/ThemeContext';

const App: React.FC = () => {
  return (
    <PetProvider>
      <ThemeProvider>
        <HashRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/pets" element={<Pets />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/assistant" element={<Assistant />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </HashRouter>
      </ThemeProvider>
    </PetProvider>
  );
};

export default App;
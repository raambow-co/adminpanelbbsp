import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SplashScreen } from './components/SplashScreen';
import { Login } from './pages/Login';
import { AdminLayout } from './layouts/AdminLayout';
import { Dashboard } from './pages/Dashboard';
import { Applications } from './pages/Applications';
import { Members } from './pages/Members';
import { ManualMembers } from './pages/ManualMembers';
import { AccountsBook } from './pages/AccountsBook';
import { Settings } from './pages/Settings';
import { AnimatePresence } from 'framer-motion';

function AppContent() {
  const { isAuthenticated, showSplash, finishSplash } = useAuth();

  return (
    <>
      <AnimatePresence>
        {showSplash && <SplashScreen onComplete={finishSplash} />}
      </AnimatePresence>

      {!showSplash && (
        <>
          {!isAuthenticated ? (
            <Login />
          ) : (
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<AdminLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="applications" element={<Applications />} />
                  <Route path="members" element={<Members />} />
                  <Route path="manual-members" element={<ManualMembers />} />
                  <Route path="accounts" element={<AccountsBook />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
              </Routes>
            </BrowserRouter>
          )}
        </>
      )}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

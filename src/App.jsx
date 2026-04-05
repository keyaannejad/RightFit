import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Welcome from './screens/Welcome';
import Onboarding from './screens/Onboarding';
import Discover from './screens/Discover';
import Matches from './screens/Matches';
import Profile from './screens/Profile';

function AppRoutes() {
  const { state } = useApp();
  const hasUser = !!state.user;

  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/discover" element={hasUser ? <Discover /> : <Navigate to="/" replace />} />
      <Route path="/matches" element={hasUser ? <Matches /> : <Navigate to="/" replace />} />
      <Route path="/profile" element={hasUser ? <Profile /> : <Navigate to="/" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="max-w-md mx-auto min-h-screen relative">
          <AppRoutes />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}

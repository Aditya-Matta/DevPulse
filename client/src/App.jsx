import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute, PublicOnlyRoute } from './router/index.jsx';
import { Toaster } from './components/ui/Toaster.jsx';

// Pages
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import InterviewLog from './pages/InterviewLog.jsx';
import NewInterview from './pages/NewInterview.jsx';
import AIAnalysis from './pages/AIAnalysis.jsx';
import MockRoom from './pages/MockRoom.jsx';
import Leaderboard from './pages/Leaderboard.jsx';
import PrepCard from './pages/PrepCard.jsx';
import PageWrapper from './components/layout/PageWrapper.jsx';

export default function App() {
  return (
    <>
      <Routes>
        {/* Public only */}
        <Route element={<PublicOnlyRoute />}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Fully public */}
        <Route path="/u/:username" element={<PrepCard />} />

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route element={<PageWrapper />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/interviews" element={<InterviewLog />} />
            <Route path="/interviews/new" element={<NewInterview />} />
            <Route path="/ai-analysis" element={<AIAnalysis />} />
            <Route path="/mock-room" element={<MockRoom />} />
            <Route path="/mock-room/:code" element={<MockRoom />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Route>
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}

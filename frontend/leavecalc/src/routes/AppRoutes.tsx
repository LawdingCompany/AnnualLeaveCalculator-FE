import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from '@pages/LandingPage/LandingPage';
import StatsPage from '@pages/AdminPage/StatsPage/StatsPage';
import FeedbackPage from '@pages/AdminPage/FeedbackPage/feedbackPage';
import NotFoundPage from '@pages/ErrorPage/ErrorPage';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin/stats" element={<StatsPage />} />
        <Route path="/admin/feedback" element={<FeedbackPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

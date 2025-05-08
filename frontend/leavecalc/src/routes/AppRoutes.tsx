import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NotificationsPage from '@pages/NotificationsPage';
import CalculationPage from '@pages/CalculationPage';
import FeedbackPage from '@pages/FeedbackPage';
import LandingPage from '@pages/LandingPage/LandingPage';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/calculation" element={<CalculationPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
      </Routes>
    </BrowserRouter>
  );
}

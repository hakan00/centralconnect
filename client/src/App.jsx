import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import TransfersPage from './pages/TransfersPage.jsx';
import LegalPage from './pages/LegalPage.jsx';
import ApplicationsPage from './pages/ApplicationsPage.jsx';
import ToursPage from './pages/ToursPage.jsx';
import CommunityPage from './pages/CommunityPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/transfers" element={<TransfersPage />} />
          <Route path="/legal" element={<LegalPage />} />
          <Route path="/applications" element={<ApplicationsPage />} />
          <Route path="/community" element={<CommunityPage />} />
        </Route>
        <Route path="/tours" element={<ToursPage />} />
      </Route>
    </Routes>
  );
}

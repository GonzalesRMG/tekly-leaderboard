import React from 'react';
import { Routes, Route } from 'react-router-dom';
// Public
import PublicLayout from './components/PublicLayout';
import SeasonsListPage from './pages/SeasonsListPage';
import SeasonResultsPage from './pages/SeasonResultsPage';
// Auth
import SignInPage from './pages/SignInPage';
// Admin
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminSeasonsPage from './pages/admin/AdminSeasonsPage';
import AdminRaceResultsPage from './pages/admin/AdminRaceResultsPage';
import AdminRacersPage from './pages/admin/AdminRacersPage';
import AdminCarsPage from './pages/admin/AdminCarsPage';
import AdminClassesPage from './pages/admin/AdminClassesPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

import './App.css';

function App() {
  return (
    <Routes>
      {/* Public area */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<SeasonsListPage />} />
        <Route path="/seasons/:seasonId" element={<SeasonResultsPage />} />
      </Route>

      {/* Auth */}
      <Route path="/signin" element={<SignInPage />} />

      {/* Admin area */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="seasons" element={<AdminSeasonsPage />} />
        <Route path="race-results" element={<AdminRaceResultsPage />} />
        <Route path="racers" element={<AdminRacersPage />} />
        <Route path="cars" element={<AdminCarsPage />} />
        <Route path="classes" element={<AdminClassesPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>
    </Routes>
  );
}

export default App;

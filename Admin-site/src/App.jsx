import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import TradeDashboard from './pages/TradeDashboard';
import UploadContent from './pages/UploadContent';
import ManagePlayers from './pages/ManagePlayers';
import PaymentMethods from './pages/PaymentMethods';
import Orders from './pages/Orders';
import Admins from './pages/Admins';
import Matches from './pages/Matches';
import Statistics from './pages/Statistics';
import './index.css';

function ProtectedRoute({ children }) {
  const { currentUser, adminProfile } = useAuth();
  if (!currentUser) return <Navigate to="/login" />;
  if (adminProfile && !adminProfile.approved) {
    return <div className="auth-layout"><div className="auth-card"><h2>Awaiting Approval</h2><p>Your account is pending approval by an existing admin.</p></div></div>;
  }
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        {children}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename="/admin">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/trade" element={<ProtectedRoute><TradeDashboard /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/upload" element={<ProtectedRoute><UploadContent /></ProtectedRoute>} />
          <Route path="/players" element={<ProtectedRoute><ManagePlayers /></ProtectedRoute>} />
          <Route path="/statistics" element={<ProtectedRoute><Statistics /></ProtectedRoute>} />
          <Route path="/matches" element={<ProtectedRoute><Matches /></ProtectedRoute>} />
          <Route path="/payment" element={<ProtectedRoute><PaymentMethods /></ProtectedRoute>} />
          <Route path="/admins" element={<ProtectedRoute><Admins /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

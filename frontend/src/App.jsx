import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Home from './pages/home';
import Report from './pages/report';
import Header from './components/Header';
import Signin from './pages/signin';
import Dashboard from './pages/admin/dashboard';
import Track from './pages/track';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { authState } = useAuth();

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/report" element={<Report />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/track" element={<Track />} />
        <Route
          path="/admin/dashboard"
          element={
            authState.isAuthenticated ? (
              <Dashboard />
            ) : (
              <Navigate to="/signin" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

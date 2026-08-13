import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import './index.css'; // Global styling

const PlaceholderDashboard = () => (
  <div className="auth-container">
    <div className="auth-card" style={{textAlign: 'center'}}>
      <h1 className="auth-title">Dashboard</h1>
      <p className="auth-subtitle" style={{marginBottom: 0}}>Congratulations, you are securely logged in!</p>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<PlaceholderDashboard />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

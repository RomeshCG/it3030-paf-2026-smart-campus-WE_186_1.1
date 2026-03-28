import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Inter, sans-serif',
      color: '#fff'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
        Welcome, {user?.name}! 🎓
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '0.25rem' }}>{user?.email}</p>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginBottom: '2rem' }}>
        Role: {user?.role}
      </p>
      <button
        onClick={handleLogout}
        style={{
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          color: '#fff',
          border: 'none',
          borderRadius: '10px',
          padding: '0.75rem 2rem',
          fontSize: '0.95rem',
          fontWeight: '600',
          cursor: 'pointer'
        }}
      >
        Sign out
      </button>
    </div>
  );
}

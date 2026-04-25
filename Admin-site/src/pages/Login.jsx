import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to login');
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-card">
        <h2 className="auth-title">UGB Admin Login</h2>
        {error && <p style={{ color: 'var(--loss)', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" required className="form-input" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="password-wrap">
              <input type={showPwd ? 'text' : 'password'} required className="form-input" value={password} onChange={e => setPassword(e.target.value)} />
              <div className="password-eye" onClick={() => setShowPwd(!showPwd)}>
                {showPwd ? 'Hide' : 'Show'}
              </div>
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Log In</button>
        </form>
        <Link to="/signup" className="auth-link">No account? Sign up</Link>
      </div>
    </div>
  );
}

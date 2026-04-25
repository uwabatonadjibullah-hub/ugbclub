import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup() {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', role: 'Admin', email: '', tel: '', gender: 'Male', password: '', confirmPassword: ''
  });
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return setError('Passwords do not match');
    try {
      const { password, confirmPassword, ...profileData } = formData;
      await signup(formData.email, password, profileData);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to sign up');
    }
  };

  return (
    <div className="auth-layout" style={{ padding: '2rem 0' }}>
      <div className="auth-card" style={{ maxWidth: '600px' }}>
        <h2 className="auth-title">Admin Sign Up</h2>
        {error && <p style={{ color: 'var(--loss)', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input type="text" required name="firstName" className="form-input" onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input type="text" required name="lastName" className="form-input" onChange={handleChange} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Role</label>
              <select name="role" className="form-input" onChange={handleChange}>
                <option value="Admin">Admin</option>
                <option value="Super Admin">Super Admin</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" required name="email" className="form-input" onChange={handleChange} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Tel Number</label>
              <input type="text" required name="tel" className="form-input" onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Gender</label>
              <select name="gender" className="form-input" onChange={handleChange}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="password-wrap">
                <input type={showPwd ? 'text' : 'password'} required name="password" className="form-input" onChange={handleChange} />
                <div className="password-eye" onClick={() => setShowPwd(!showPwd)}>{showPwd ? 'Hide' : 'Show'}</div>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="password-wrap">
                <input type={showConfirm ? 'text' : 'password'} required name="confirmPassword" className="form-input" onChange={handleChange} />
                <div className="password-eye" onClick={() => setShowConfirm(!showConfirm)}>{showConfirm ? 'Hide' : 'Show'}</div>
              </div>
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Sign Up</button>
        </form>
        <Link to="/login" className="auth-link">Already have an account? Log in</Link>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { loginUser, registerUser } from '../api/employeeApi';
import styles from './AuthPage.module.css';

export default function AuthPage() {
  const { login } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({ username: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');

    // Validate
    if (!form.username.trim() || !form.password.trim()) {
      setError('Username and password are required'); return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters'); return;
    }
    if (mode === 'register' && form.password !== form.confirm) {
      setError('Passwords do not match'); return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        const res = await loginUser({ username: form.username, password: form.password });
        login(res.data.token, res.data.username);
      } else {
        const res = await registerUser({ username: form.username, password: form.password });
        login(res.data.token, res.data.username);
      }
    } catch (err) {
      const msg = err.response?.data;
      if (typeof msg === 'string') setError(msg);
      else if (err.response?.status === 401) setError('Invalid username or password');
      else if (err.response?.status === 409) setError('Username already exists');
      else setError('Something went wrong. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(m => m === 'login' ? 'register' : 'login');
    setForm({ username: '', password: '', confirm: '' });
    setError(''); setSuccess('');
  };

  return (
    <div className={styles.page}>
      {/* Left panel */}
      <div className={styles.leftPanel}>
        <div className={styles.brand}>
          <div className={styles.brandLogo}>HR</div>
          <div>
            <div className={styles.brandName}>WorkForce</div>
            <div className={styles.brandSub}>HR Management Platform</div>
          </div>
        </div>

        <div className={styles.heroText}>
          <h1 className={styles.heroTitle}>
            Manage your<br />
            <span className={styles.heroAccent}>team smarter</span>
          </h1>
          <p className={styles.heroDesc}>
            A full stack employee management system built with Spring Boot, React, and MySQL.
          </p>
        </div>

        <div className={styles.featureList}>
          {['Full CRUD operations', 'JWT Authentication', 'Real-time data', 'Role-based access'].map(f => (
            <div key={f} className={styles.featureItem}>
              <span className={styles.featureDot}></span>
              {f}
            </div>
          ))}
        </div>

        <div className={styles.techRow}>
          {['Spring Boot', 'React', 'MySQL', 'JWT'].map(t => (
            <span key={t} className={styles.techBadge}>{t}</span>
          ))}
        </div>
      </div>

      {/* Right panel - form */}
      <div className={styles.rightPanel}>
        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>
              {mode === 'login' ? 'Welcome back' : 'Create account'}
            </h2>
            <p className={styles.formSub}>
              {mode === 'login'
                ? 'Sign in to your WorkForce account'
                : 'Start managing your team today'}
            </p>
          </div>

          {/* Mode tabs */}
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${mode === 'login' ? styles.tabActive : ''}`}
              onClick={() => mode !== 'login' && switchMode()}>
              Sign in
            </button>
            <button
              className={`${styles.tab} ${mode === 'register' ? styles.tabActive : ''}`}
              onClick={() => mode !== 'register' && switchMode()}>
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} noValidate className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>Username</label>
              <div className={styles.inputWrap}>
                <span className={styles.inputIcon}>◈</span>
                <input
                  className={styles.input}
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  autoComplete="username"
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Password</label>
              <div className={styles.inputWrap}>
                <span className={styles.inputIcon}>⊙</span>
                <input
                  className={styles.input}
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                />
              </div>
            </div>

            {mode === 'register' && (
              <div className={styles.field}>
                <label className={styles.label}>Confirm password</label>
                <div className={styles.inputWrap}>
                  <span className={styles.inputIcon}>⊙</span>
                  <input
                    className={styles.input}
                    name="confirm"
                    type="password"
                    value={form.confirm}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                  />
                </div>
              </div>
            )}

            {error && (
              <div className={styles.errorBox}>
                <span>✕</span> {error}
              </div>
            )}

            {success && (
              <div className={styles.successBox}>
                <span>✓</span> {success}
              </div>
            )}

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading
                ? 'Please wait...'
                : mode === 'login' ? 'Sign in →' : 'Create account →'}
            </button>
          </form>

          <p className={styles.switchText}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button className={styles.switchLink} onClick={switchMode}>
              {mode === 'login' ? 'Register here' : 'Sign in here'}
            </button>
          </p>

          {mode === 'login' && (
            <div className={styles.demoBox}>
              <p className={styles.demoTitle}>Demo credentials</p>
              <p className={styles.demoText}>Register first, then use those credentials to login.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

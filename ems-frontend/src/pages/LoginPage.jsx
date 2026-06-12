import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { login, register } from '../api/authApi';
import styles from './AuthPage.module.css';

export default function LoginPage() {
  const { loginUser } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ username: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(err => ({ ...err, [e.target.name]: '' }));
    setServerError('');
  };

  const validate = () => {
    const e = {};
    if (!form.username.trim()) e.username = 'Username is required';
    else if (form.username.length < 3) e.username = 'Min 3 characters';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Min 6 characters';
    if (mode === 'register' && form.password !== form.confirm)
      e.confirm = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setServerError('');
    try {
      const payload = { username: form.username, password: form.password };
      const res = mode === 'login'
        ? await login(payload)
        : await register(payload);
   loginUser(res.data.token, res.data.username, res.data.role);
    } catch (err) {
      const msg = typeof err.response?.data === 'string'
        ? err.response.data
        : err.response?.data?.message || 'Something went wrong';
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (m) => {
    setMode(m);
    setForm({ username: '', password: '', confirm: '' });
    setErrors({});
    setServerError('');
  };

  return (
    <div className={styles.page}>
      <div className={styles.left}>
        <div className={styles.brand}>
          <div className={styles.brandLogo}>HR</div>
          <div>
            <div className={styles.brandName}>WorkForce</div>
            <div className={styles.brandTag}>HR Management Platform</div>
          </div>
        </div>
        <div className={styles.heroText}>
          <h1 className={styles.heroTitle}>Manage your team<br />with confidence</h1>
          <p className={styles.heroSub}>A complete employee management system built with Spring Boot, React, and MySQL.</p>
        </div>
        <div className={styles.features}>
          {[
            'Full CRUD employee management',
            'Project and client tracking',
            'JWT secured REST APIs',
            'Real-time dashboard stats'
          ].map((f, i) => (
            <div key={i} className={styles.featureItem}>
              <span className={styles.featureDot}></span>
              <span>{f}</span>
            </div>
          ))}
        </div>
        <div className={styles.techStack}>
          {['Spring Boot', 'React', 'MySQL', 'JWT'].map(t => (
            <span key={t} className={styles.techBadge}>{t}</span>
          ))}
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.card}>
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${mode === 'login' ? styles.tabActive : ''}`}
              onClick={() => switchMode('login')}>
              Sign in
            </button>
            <button
              className={`${styles.tab} ${mode === 'register' ? styles.tabActive : ''}`}
              onClick={() => switchMode('register')}>
              Create account
            </button>
          </div>

          <div className={styles.cardBody}>
            <h2 className={styles.formTitle}>
              {mode === 'login' ? 'Welcome back' : 'Get started'}
            </h2>
            <p className={styles.formSub}>
              {mode === 'login'
                ? 'Sign in to your WorkForce account'
                : 'Create your WorkForce account'}
            </p>

            {serverError && (
              <div className={styles.serverError}>
                <span>⊘</span> {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className={styles.field}>
                <label className={styles.label}>Username</label>
                <input
                  className={`${styles.input} ${errors.username ? styles.inputErr : ''}`}
                  name="username" value={form.username}
                  onChange={handleChange} placeholder="e.g. nithya123"
                  autoComplete="username"
                />
                {errors.username && <span className={styles.errMsg}>{errors.username}</span>}
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Password</label>
                <input
                  className={`${styles.input} ${errors.password ? styles.inputErr : ''}`}
                  name="password" type="password" value={form.password}
                  onChange={handleChange} placeholder="Min 6 characters"
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                />
                {errors.password && <span className={styles.errMsg}>{errors.password}</span>}
              </div>

              {mode === 'register' && (
                <div className={styles.field}>
                  <label className={styles.label}>Confirm password</label>
                  <input
                    className={`${styles.input} ${errors.confirm ? styles.inputErr : ''}`}
                    name="confirm" type="password" value={form.confirm}
                    onChange={handleChange} placeholder="Re-enter password"
                    autoComplete="new-password"
                  />
                  {errors.confirm && <span className={styles.errMsg}>{errors.confirm}</span>}
                </div>
              )}

              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading && <span className={styles.btnSpinner}></span>}
                {loading ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
              </button>
            </form>

            <p className={styles.switchText}>
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button
                className={styles.switchLink}
                onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}>
                {mode === 'login' ? 'Create one' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
        <p className={styles.footer}>
          Built with Spring Boot + React + MySQL · JWT Authentication
        </p>
      </div>
    </div>
  );
}
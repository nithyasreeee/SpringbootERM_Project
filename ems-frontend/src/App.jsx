import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import EmployeeForm from './components/EmployeeForm';
import EmployeeTable from './components/EmployeeTable';
import Toast from './components/Toast';
import LoginPage from './pages/LoginPage';
import UserManagement from './pages/UserManagement';
import Dashboard from './pages/Dashboard';
import { getAllEmployees, saveEmployee, updateEmployee, deleteEmployee } from './api/employeeApi';
import styles from './App.module.css';
import './index.css';

export default function App() {
  const { user, loading: authLoading, isAdmin, isSuperAdmin } = useAuth();
  const [theme, setTheme] = useState('dark');
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState(null);
  const [page, setPage] = useState('dashboard');
  const [toast, setToast] = useState(null);
  const [stats, setStats] = useState({
    total: 0, active: 0, depts: 0, avgSalary: 0
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const showToast = (message, type = 'success') =>
    setToast({ message, type });

  const computeStats = (data) => {
    const depts = new Set(data.map(e => e.department)).size;
    const active = data.filter(e => e.p?.status === 'Active').length;
    const avgSalary = data.length
      ? Math.round(data.reduce((s, e) => s + Number(e.salary), 0) / data.length)
      : 0;
    setStats({ total: data.length, active, depts, avgSalary });
  };

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAllEmployees();
      setEmployees(res.data);
      computeStats(res.data);
    } catch (err) {
      if (err.response?.status === 403 || err.response?.status === 401) {
        showToast('Session expired. Please login again.', 'error');
      } else {
        showToast('Cannot reach backend. Is Spring Boot running?', 'error');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) fetchEmployees();
  }, [user, fetchEmployees]);

  const handleSubmit = async (formData) => {
    try {
      if (editData) {
        await updateEmployee(editData.id, formData);
        showToast(`${formData.name} updated`);
        setEditData(null);
      } else {
        await saveEmployee(formData);
        showToast(`${formData.name} added`);
      }
      fetchEmployees();
    } catch (err) {
      showToast(
        err.response?.data?.message || 'Something went wrong', 'error'
      );
      throw err;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this employee?')) return;
    try {
      await deleteEmployee(id);
      showToast('Employee deleted');
      fetchEmployees();
    } catch {
      showToast('Delete failed', 'error');
    }
  };

  const getPageTitle = () => {
    switch (page) {
      case 'dashboard': return 'Dashboard';
      case 'users': return 'User Management';
      case 'employees': return 'Employees';
      default: return 'Employees';
    }
  };

  const getPageSub = () => {
    switch (page) {
      case 'dashboard': return 'Overview of your workforce';
      case 'users': return 'Manage roles and access';
      case 'employees': return 'Manage your workforce';
      default: return 'Manage your workforce';
    }
  };

  if (authLoading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', height: '100vh',
        background: '#0a0c12'
      }}>
        <div style={{
          width: 28, height: 28,
          border: '2px solid #1e2130',
          borderTopColor: '#5b5ef4',
          borderRadius: '50%',
          animation: 'spin 0.7s linear infinite'
        }}></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div data-theme={theme}>
        <LoginPage />
      </div>
    );
  }

  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return <Dashboard />;

      case 'employees':
        return (
          <>
            <div className={styles.statsRow}>
              <div className={styles.statCard}>
                <div className={styles.statVal}>{stats.total}</div>
                <div className={styles.statLabel}>Total employees</div>
              </div>
              <div className={styles.statCard}>
                <div className={`${styles.statVal} ${styles.green}`}>
                  {stats.active}
                </div>
                <div className={styles.statLabel}>Active projects</div>
              </div>
              <div className={styles.statCard}>
                <div className={`${styles.statVal} ${styles.accent}`}>
                  {stats.depts}
                </div>
                <div className={styles.statLabel}>Departments</div>
              </div>
              <div className={styles.statCard}>
                <div className={`${styles.statVal} ${styles.amber}`}>
                  {stats.avgSalary
                    ? `₹${(stats.avgSalary / 1000).toFixed(1)}K`
                    : '—'}
                </div>
                <div className={styles.statLabel}>Avg. salary</div>
              </div>
            </div>
            <EmployeeForm
              onSubmit={handleSubmit}
              editData={editData}
              onCancel={() => setEditData(null)}
              isAdmin={isAdmin}
            />
            <EmployeeTable
              employees={employees}
              loading={loading}
              onEdit={setEditData}
              onDelete={handleDelete}
              isAdmin={isAdmin}
            />
          </>
        );

      case 'users':
        return isSuperAdmin
          ? <UserManagement />
          : (
            <div style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              height: '60vh', color: 'var(--text3)', gap: 12
            }}>
              <div style={{ fontSize: 40 }}>⊘</div>
              <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--text2)' }}>
                Access Denied
              </p>
              <p style={{ fontSize: 13 }}>
                You don't have permission to view this page.
              </p>
            </div>
          );

      default:
        return (
          <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            height: '60vh', color: 'var(--text3)', gap: 12
          }}>
            <div style={{ fontSize: 40 }}>🚧</div>
            <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--text2)' }}>
              Coming Soon
            </p>
            <p style={{ fontSize: 13 }}>
              This page is under construction.
            </p>
          </div>
        );
    }
  };

  return (
    <div className={styles.app}>
      <Sidebar
        theme={theme}
        onThemeToggle={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
        onNavigate={setPage}
        currentPage={page}
      />

      <div className={styles.main}>
        <div className={styles.topbar}>
          <div>
            <h1 className={styles.pageTitle}>{getPageTitle()}</h1>
            <p className={styles.pageSub}>{getPageSub()}</p>
          </div>
          <div className={styles.topbarRight}>
            <div className={styles.statusDot}></div>
            <span className={styles.statusText}>API connected</span>
          </div>
        </div>

        <div className={styles.content}>
          {renderPage()}
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
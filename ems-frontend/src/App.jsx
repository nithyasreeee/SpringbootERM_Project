import { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import EmployeeForm from './components/EmployeeForm';
import EmployeeTable from './components/EmployeeTable';
import Toast from './components/Toast';
import { getAllEmployees, saveEmployee, updateEmployee, deleteEmployee } from './api/employeeApi';
import styles from './App.module.css';
import './index.css';

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState(null);
  const [toast, setToast] = useState(null);
  const [stats, setStats] = useState({ total: 0, active: 0, depts: 0, avgSalary: 0 });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const showToast = (message, type = 'success') => setToast({ message, type });

  const computeStats = (data) => {
    const depts = new Set(data.map(e => e.department)).size;
    const active = data.filter(e => e.p?.status === 'Active').length;
    const avgSalary = data.length ? Math.round(data.reduce((s, e) => s + Number(e.salary), 0) / data.length) : 0;
    setStats({ total: data.length, active, depts, avgSalary });
  };

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAllEmployees();
      setEmployees(res.data);
      computeStats(res.data);
    } catch {
      showToast('Cannot reach backend. Is Spring Boot running?', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchEmployees(); }, [fetchEmployees]);

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
      showToast(err.response?.data?.message || 'Something went wrong', 'error');
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

  return (
    <div className={styles.app}>
      <Sidebar theme={theme} onThemeToggle={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} />

      <div className={styles.main}>
        <div className={styles.topbar}>
          <div>
            <h1 className={styles.pageTitle}>Employees</h1>
            <p className={styles.pageSub}>Manage your workforce</p>
          </div>
          <div className={styles.topbarRight}>
            <div className={styles.statusDot}></div>
            <span className={styles.statusText}>API connected</span>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.statsRow}>
            <div className={styles.statCard}>
              <div className={styles.statVal}>{stats.total}</div>
              <div className={styles.statLabel}>Total employees</div>
            </div>
            <div className={styles.statCard}>
              <div className={`${styles.statVal} ${styles.green}`}>{stats.active}</div>
              <div className={styles.statLabel}>Active projects</div>
            </div>
            <div className={styles.statCard}>
              <div className={`${styles.statVal} ${styles.accent}`}>{stats.depts}</div>
              <div className={styles.statLabel}>Departments</div>
            </div>
            <div className={styles.statCard}>
              <div className={`${styles.statVal} ${styles.amber}`}>
                {stats.avgSalary ? `₹${(stats.avgSalary / 1000).toFixed(1)}K` : '—'}
              </div>
              <div className={styles.statLabel}>Avg. salary</div>
            </div>
          </div>

          <EmployeeForm onSubmit={handleSubmit} editData={editData} onCancel={() => setEditData(null)} />
          <EmployeeTable employees={employees} loading={loading} onEdit={setEditData} onDelete={handleDelete} />
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

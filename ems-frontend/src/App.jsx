import { useState, useEffect, useCallback } from 'react';
import EmployeeForm from './components/EmployeeForm';
import EmployeeTable from './components/EmployeeTable';
import Toast from './components/Toast';
import { getAllEmployees, saveEmployee, updateEmployee, deleteEmployee } from './api/employeeApi';
import './index.css';
import styles from './App.module.css';

export default function App() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState(null);
  const [toast, setToast] = useState(null);
  const [stats, setStats] = useState({ total: 0, active: 0, depts: 0 });

  const showToast = (message, type = 'success') => setToast({ message, type });

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAllEmployees();
      const data = res.data;
      setEmployees(data);
      const depts = new Set(data.map(e => e.department)).size;
      const active = data.filter(e => e.p?.status === 'Active').length;
      setStats({ total: data.length, active, depts });
    } catch {
      showToast('Failed to load employees. Is the backend running?', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchEmployees(); }, [fetchEmployees]);

  const handleSubmit = async (formData) => {
    try {
      if (editData) {
        await updateEmployee(editData.id, formData);
        showToast(`${formData.name} updated successfully`);
        setEditData(null);
      } else {
        await saveEmployee(formData);
        showToast(`${formData.name} added successfully`);
      }
      fetchEmployees();
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong';
      showToast(msg, 'error');
      throw err;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this employee?')) return;
    try {
      await deleteEmployee(id);
      showToast('Employee deleted successfully');
      fetchEmployees();
    } catch {
      showToast('Failed to delete employee', 'error');
    }
  };

  return (
    <div className={styles.app}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.headerLeft}>
            <div className={styles.logo}>EMS</div>
            <div>
              <h1 className={styles.appTitle}>Employee Management System</h1>
              <p className={styles.appSub}>Spring Boot + React + MySQL</p>
            </div>
          </div>
          <div className={styles.techStack}>
            <span className={styles.badge}>Spring Boot</span>
            <span className={styles.badge}>REST API</span>
            <span className={styles.badge}>MySQL</span>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        {/* Stats */}
        <div className={styles.statsRow}>
          <div className={styles.stat}>
            <span className={styles.statNum}>{stats.total}</span>
            <span className={styles.statLabel}>Total Employees</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNum} style={{ color: 'var(--success)' }}>{stats.active}</span>
            <span className={styles.statLabel}>Active Projects</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNum} style={{ color: 'var(--primary)' }}>{stats.depts}</span>
            <span className={styles.statLabel}>Departments</span>
          </div>
        </div>

        {/* Form */}
        <EmployeeForm
          onSubmit={handleSubmit}
          editData={editData}
          onCancel={() => setEditData(null)}
        />

        {/* Table */}
        <EmployeeTable
          employees={employees}
          loading={loading}
          onEdit={setEditData}
          onDelete={handleDelete}
        />
      </main>

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

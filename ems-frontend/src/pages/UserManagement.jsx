import { useState, useEffect } from 'react';
import { getAllUsers, updateUserRole } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import styles from './UserManagement.module.css';

const roles = ['SUPER_ADMIN', 'ADMIN', 'EMPLOYEE'];

const roleBadgeClass = {
  SUPER_ADMIN: styles.badgeSuperAdmin,
  ADMIN: styles.badgeAdmin,
  EMPLOYEE: styles.badgeEmployee,
};

export default function UserManagement() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [toast, setToast] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getAllUsers();
      setUsers(res.data);
    } catch {
      setToast('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleRoleChange = async (id, newRole, username) => {
    if (username === user.username) {
      setToast("You can't change your own role");
      setTimeout(() => setToast(''), 3000);
      return;
    }
    setUpdating(id);
    try {
      await updateUserRole(id, newRole);
      setUsers(prev => prev.map(u =>
        u.id === id ? { ...u, role: newRole } : u
      ));
      setToast(`${username} role updated to ${newRole}`);
      setTimeout(() => setToast(''), 3000);
    } catch {
      setToast('Failed to update role');
      setTimeout(() => setToast(''), 3000);
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>User Management</h2>
          <p className={styles.sub}>Manage roles and access for all users</p>
        </div>
        <div className={styles.statsRow}>
          <div className={styles.stat}>
            <span className={styles.statNum}>{users.length}</span>
            <span className={styles.statLbl}>Total users</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNum} style={{ color: '#a78bfa' }}>
              {users.filter(u => u.role === 'SUPER_ADMIN').length}
            </span>
            <span className={styles.statLbl}>Super Admins</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNum} style={{ color: 'var(--accent-text)' }}>
              {users.filter(u => u.role === 'ADMIN').length}
            </span>
            <span className={styles.statLbl}>Admins</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNum} style={{ color: 'var(--green)' }}>
              {users.filter(u => u.role === 'EMPLOYEE').length}
            </span>
            <span className={styles.statLbl}>Employees</span>
          </div>
        </div>
      </div>

      {toast && (
        <div className={styles.toast}>{toast}</div>
      )}

      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <span className={styles.panelTitle}>All users</span>
          <span className={styles.panelSub}>{users.length} registered</span>
        </div>

        {loading ? (
          <div className={styles.loadingBox}>
            <div className={styles.spinner}></div>
            <p>Loading users...</p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Current Role</th>
                <th>Change Role</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className={u.username === user.username ? styles.currentUser : ''}>
                  <td><span className={styles.idChip}>#{u.id}</span></td>
                  <td>
                    <div className={styles.userRow}>
                      <div className={styles.avatar}>
                        {u.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className={styles.username}>{u.username}</div>
                        {u.username === user.username && (
                          <div className={styles.youLabel}>You</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`${styles.badge} ${roleBadgeClass[u.role]}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>
                    {u.username === user.username ? (
                      <span className={styles.cantChange}>Cannot change own role</span>
                    ) : (
                      <select
                        className={styles.roleSelect}
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value, u.username)}
                        disabled={updating === u.id}
                      >
                        {roles.map(r => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    )}
                  </td>
                  <td>
                    {updating === u.id ? (
                      <span className={styles.updating}>Updating...</span>
                    ) : (
                      <span className={styles.active}>● Active</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className={styles.infoBox}>
        <div className={styles.infoTitle}>Role Permissions</div>
        <div className={styles.infoGrid}>
          <div className={styles.infoCard}>
            <span className={`${styles.badge} ${styles.badgeSuperAdmin}`}>SUPER_ADMIN</span>
            <ul className={styles.permList}>
              <li>✓ View all employees</li>
              <li>✓ Add / Edit / Delete employees</li>
              <li>✓ Manage user roles</li>
              <li>✓ Full system access</li>
            </ul>
          </div>
          <div className={styles.infoCard}>
            <span className={`${styles.badge} ${styles.badgeAdmin}`}>ADMIN</span>
            <ul className={styles.permList}>
              <li>✓ View all employees</li>
              <li>✓ Add / Edit / Delete employees</li>
              <li>✗ Cannot manage user roles</li>
              <li>✗ No system settings access</li>
            </ul>
          </div>
          <div className={styles.infoCard}>
            <span className={`${styles.badge} ${styles.badgeEmployee}`}>EMPLOYEE</span>
            <ul className={styles.permList}>
              <li>✓ View all employees</li>
              <li>✗ Cannot add employees</li>
              <li>✗ Cannot edit or delete</li>
              <li>✗ No admin access</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
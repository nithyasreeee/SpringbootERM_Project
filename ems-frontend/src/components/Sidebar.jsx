import { useAuth } from '../context/AuthContext';
import styles from './Sidebar.module.css';

const roleBadgeClass = {
  SUPER_ADMIN: 'badgeSuperAdmin',
  ADMIN: 'badgeAdmin',
  EMPLOYEE: 'badgeEmployee',
};

const roleLabel = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  EMPLOYEE: 'Employee',
};

export default function Sidebar({ theme, onThemeToggle, onNavigate, currentPage }) {
  const { user, logout, isSuperAdmin } = useAuth();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoArea}>
        <div className={styles.logoBox}>HR</div>
        <div>
          <div className={styles.logoName}>WorkForce</div>
          <div className={styles.logoSub}>HR Platform</div>
        </div>
      </div>

      <nav className={styles.nav}>
        <div className={styles.navSection}>Main</div>

        <div
          className={`${styles.navItem} ${currentPage === 'dashboard' ? styles.active : ''}`}
          onClick={() => onNavigate('dashboard')}
        >
          <span className={styles.navIcon}>⬡</span>
          <span>Dashboard</span>
        </div>

        <div
          className={`${styles.navItem} ${currentPage === 'employees' ? styles.active : ''}`}
          onClick={() => onNavigate('employees')}
        >
          <span className={styles.navIcon}>◈</span>
          <span>Employees</span>
        </div>

        <div
          className={`${styles.navItem} ${currentPage === 'projects' ? styles.active : ''}`}
          onClick={() => onNavigate('projects')}
        >
          <span className={styles.navIcon}>◉</span>
          <span>Projects</span>
        </div>

        <div className={styles.navSection}>Manage</div>

        <div
          className={`${styles.navItem} ${currentPage === 'departments' ? styles.active : ''}`}
          onClick={() => onNavigate('departments')}
        >
          <span className={styles.navIcon}>⊞</span>
          <span>Departments</span>
        </div>

        <div
          className={`${styles.navItem} ${currentPage === 'reports' ? styles.active : ''}`}
          onClick={() => onNavigate('reports')}
        >
          <span className={styles.navIcon}>◧</span>
          <span>Reports</span>
        </div>

        <div
          className={`${styles.navItem} ${currentPage === 'settings' ? styles.active : ''}`}
          onClick={() => onNavigate('settings')}
        >
          <span className={styles.navIcon}>⊙</span>
          <span>Settings</span>
        </div>

        {/* Only visible to SUPER_ADMIN */}
        {isSuperAdmin && (
          <>
            <div className={styles.navSection}>Admin</div>
            <div
              className={`${styles.navItem} ${currentPage === 'users' ? styles.active : ''}`}
              onClick={() => onNavigate('users')}
            >
              <span className={styles.navIcon}>◑</span>
              <span>User Management</span>
            </div>
          </>
        )}
      </nav>

      <div className={styles.sidebarFooter}>
        <button className={styles.themeToggle} onClick={onThemeToggle}>
          {theme === 'dark' ? '☀ Light mode' : '☾ Dark mode'}
        </button>
        <div className={styles.userRow}>
          <div className={styles.avatar}>
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className={styles.userInfo}>
            <div className={styles.userName}>{user?.username || 'User'}</div>
            <span className={`${styles.roleBadge} ${styles[roleBadgeClass[user?.role] || 'badgeEmployee']}`}>
              {roleLabel[user?.role] || 'Employee'}
            </span>
          </div>
          <button className={styles.logoutBtn} onClick={logout} title="Logout">
            ⏻ logout
          </button>
        </div>
      </div>
    </aside>
  );
}
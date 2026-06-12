import { useAuth } from '../context/AuthContext';
import styles from './Sidebar.module.css';

const navItems = [
  { label: 'Dashboard', icon: '⬡' },
  { label: 'Employees', icon: '◈', active: true },
  { label: 'Projects', icon: '◉' },
  { label: 'Departments', icon: '⊞', section: 'Manage' },
  { label: 'Reports', icon: '◧' },
  { label: 'Settings', icon: '⊙' },
];

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

export default function Sidebar({ theme, onThemeToggle }) {
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
        {navItems.map((item, i) => (
          <div key={i}>
            {item.section && (
              <div className={styles.navSection}>{item.section}</div>
            )}
            <div className={`${styles.navItem} ${item.active ? styles.active : ''}`}>
              <span className={styles.navIcon}>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          </div>
        ))}

        {/* User Management — only visible to SUPER_ADMIN */}
        {isSuperAdmin && (
          <>
            <div className={styles.navSection}>Admin</div>
            <div className={styles.navItem}>
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
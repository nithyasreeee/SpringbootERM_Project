import styles from './Sidebar.module.css';

const navItems = [
  { label: 'Dashboard', icon: '⬡', section: null },
  { label: 'Employees', icon: '◈', badge: null, active: true },
  { label: 'Projects', icon: '◉' },
  { label: 'Departments', icon: '⊞', section: 'Manage' },
  { label: 'Reports', icon: '◧' },
  { label: 'Settings', icon: '⊙' },
];

export default function Sidebar({ theme, onThemeToggle }) {
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
            {item.section && <div className={styles.navSection}>{item.section}</div>}
            <div className={`${styles.navItem} ${item.active ? styles.active : ''}`}>
              <span className={styles.navIcon}>{item.icon}</span>
              <span>{item.label}</span>
              {item.badge && <span className={styles.navBadge}>{item.badge}</span>}
            </div>
          </div>
        ))}
      </nav>

      <div className={styles.sidebarFooter}>
        <button className={styles.themeToggle} onClick={onThemeToggle} title="Toggle theme">
          {theme === 'dark' ? '☀ Light mode' : '☾ Dark mode'}
        </button>
        <div className={styles.avatarRow}>
          <div className={styles.avatar}>NR</div>
          <div>
            <div className={styles.avatarName}>Nithyasree R</div>
            <div className={styles.avatarRole}>Admin</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

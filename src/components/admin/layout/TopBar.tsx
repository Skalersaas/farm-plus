import { useLocation, Link } from 'react-router-dom';
import { Menu, Search, Bell, ChevronRight } from 'lucide-react';
import styles from './TopBar.module.css';

interface TopBarProps {
  onMenuClick: () => void;
}

const pageTitles: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/dashboard': 'Dashboard',
  '/admin/fields': 'My Fields',
  '/admin/plants': 'My Plants',
  '/admin/calendar': 'Calendar',
  '/admin/notes': 'Notes',
  '/admin/reports': 'Reports',
  '/admin/settings': 'Settings',
};

function getBreadcrumbs(pathname: string): Array<{ label: string; path: string }> {
  const parts = pathname.split('/').filter(Boolean);
  const breadcrumbs: Array<{ label: string; path: string }> = [];

  let currentPath = '';
  for (const part of parts) {
    currentPath += `/${part}`;
    const label = pageTitles[currentPath] || part.charAt(0).toUpperCase() + part.slice(1);
    breadcrumbs.push({ label, path: currentPath });
  }

  return breadcrumbs;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const location = useLocation();
  const pageTitle = pageTitles[location.pathname] || 'Dashboard';
  const breadcrumbs = getBreadcrumbs(location.pathname);

  return (
    <header className={styles.topBar}>
      <div className={styles.left}>
        <button className={styles.menuBtn} onClick={onMenuClick}>
          <Menu size={20} />
        </button>

        <div>
          <nav className={styles.breadcrumb}>
            {breadcrumbs.map((crumb, index) => (
              <span key={crumb.path}>
                {index > 0 && (
                  <ChevronRight size={14} className={styles.breadcrumbSeparator} />
                )}
                {index === breadcrumbs.length - 1 ? (
                  <span className={styles.breadcrumbCurrent}>{crumb.label}</span>
                ) : (
                  <Link to={crumb.path} className={styles.breadcrumbLink}>
                    {crumb.label}
                  </Link>
                )}
              </span>
            ))}
          </nav>
          <h1 className={styles.pageTitle}>{pageTitle}</h1>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.searchBar}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search..."
            className={styles.searchInput}
          />
        </div>

        <button className={styles.iconBtn}>
          <Bell size={20} />
          <span className={styles.badge}>3</span>
        </button>

        <button className={styles.userMenu}>
          <div className={styles.avatar}>JD</div>
          <div>
            <div className={styles.userName}>John Doe</div>
            <div className={styles.userRole}>Farm Owner</div>
          </div>
        </button>
      </div>
    </header>
  );
}

export default TopBar;

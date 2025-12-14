import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Map,
  Leaf,
  Calendar,
  FileText,
  BarChart3,
  Grid3X3,
  Settings,
  ChevronLeft,
} from 'lucide-react';
import { useUIStore } from '../../../stores';
import styles from './Sidebar.module.css';

const navItems = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/fields', icon: Map, label: 'My Fields' },
  { to: '/admin/plants', icon: Leaf, label: 'My Plants' },
  { to: '/admin/map', icon: Grid3X3, label: 'Crop Map' },
  { to: '/admin/calendar', icon: Calendar, label: 'Calendar' },
  { to: '/admin/notes', icon: FileText, label: 'Notes' },
  { to: '/admin/reports', icon: BarChart3, label: 'Reports' },
];

const bottomNavItems = [
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUIStore();

  return (
    <aside className={`${styles.sidebar} ${sidebarCollapsed ? styles.collapsed : ''}`}>
      {/* Logo */}
      <div className={styles.logo}>
        <img src="/logo.png" alt="Farm+" className={styles.logoImg} />
        <span className={styles.logoText}>Farm+</span>
      </div>

      {/* Navigation */}
      <nav className={styles.nav}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ''}`
            }
          >
            <item.icon className={styles.navIcon} />
            <span className={styles.navText}>{item.label}</span>
          </NavLink>
        ))}

        <div className={styles.divider} />

        {bottomNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ''}`
            }
          >
            <item.icon className={styles.navIcon} />
            <span className={styles.navText}>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className={styles.footer}>
        <button className={styles.collapseBtn} onClick={toggleSidebar}>
          <ChevronLeft className={styles.collapseIcon} size={20} />
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;

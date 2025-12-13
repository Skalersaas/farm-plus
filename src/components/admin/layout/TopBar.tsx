import { useState, useEffect, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Menu, Search, Bell, ChevronRight, X, Map, Leaf, FileText, Droplets, AlertTriangle } from 'lucide-react';
import { useFieldsStore, usePlantsStore, useUIStore } from '../../../stores';
import styles from './TopBar.module.css';

interface TopBarProps {
  onMenuClick: () => void;
}

interface CurrentUser {
  id: string;
  name: string;
  email: string;
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

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const pageTitle = pageTitles[location.pathname] || 'Dashboard';
  const breadcrumbs = getBreadcrumbs(location.pathname);

  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const { fields } = useFieldsStore();
  const { plants } = usePlantsStore();
  const { notes, activityLog } = useUIStore();

  // Load current user on mount
  useEffect(() => {
    const userStr = localStorage.getItem('farm-plus-current-user');
    if (userStr) {
      try {
        setCurrentUser(JSON.parse(userStr));
      } catch {
        // Ignore parsing errors
      }
    }
  }, []);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search results
  const searchResults = searchQuery.trim().length > 0 ? {
    fields: fields.filter((f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 3),
    plants: plants.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 3),
    notes: notes.filter((n) =>
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.title?.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 3),
  } : { fields: [], plants: [], notes: [] };

  const hasResults =
    searchResults.fields.length > 0 ||
    searchResults.plants.length > 0 ||
    searchResults.notes.length > 0;

  // Notifications - plants needing water + recent activities
  const plantsNeedingWater = plants.filter(
    (p) => p.wateringStatus === 'overdue' || p.wateringStatus === 'critical'
  ).slice(0, 5);

  const recentActivities = activityLog.slice(0, 5);
  const notificationCount = plantsNeedingWater.length;

  const handleSearchSelect = (type: string, id: string) => {
    setShowSearchResults(false);
    setSearchQuery('');
    if (type === 'field') {
      navigate(`/admin/fields/${id}`);
    } else if (type === 'plant') {
      navigate(`/admin/plants/${id}`);
    } else if (type === 'note') {
      navigate('/admin/notes');
    }
  };

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
        {/* Search */}
        <div className={styles.searchContainer} ref={searchRef}>
          <div className={styles.searchBar}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(e.target.value.trim().length > 0);
              }}
              onFocus={() => {
                if (searchQuery.trim().length > 0) {
                  setShowSearchResults(true);
                }
              }}
            />
            {searchQuery && (
              <button
                className={styles.searchClear}
                onClick={() => {
                  setSearchQuery('');
                  setShowSearchResults(false);
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {showSearchResults && (
            <div className={styles.searchResults}>
              {!hasResults ? (
                <div className={styles.noResults}>No results found</div>
              ) : (
                <>
                  {searchResults.fields.length > 0 && (
                    <div className={styles.searchSection}>
                      <div className={styles.searchSectionTitle}>Fields</div>
                      {searchResults.fields.map((field) => (
                        <button
                          key={field.id}
                          className={styles.searchResultItem}
                          onClick={() => handleSearchSelect('field', field.id)}
                        >
                          <Map size={16} />
                          <span>{field.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  {searchResults.plants.length > 0 && (
                    <div className={styles.searchSection}>
                      <div className={styles.searchSectionTitle}>Plants</div>
                      {searchResults.plants.map((plant) => (
                        <button
                          key={plant.id}
                          className={styles.searchResultItem}
                          onClick={() => handleSearchSelect('plant', plant.id)}
                        >
                          <Leaf size={16} />
                          <span>{plant.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  {searchResults.notes.length > 0 && (
                    <div className={styles.searchSection}>
                      <div className={styles.searchSectionTitle}>Notes</div>
                      {searchResults.notes.map((note) => (
                        <button
                          key={note.id}
                          className={styles.searchResultItem}
                          onClick={() => handleSearchSelect('note', note.id)}
                        >
                          <FileText size={16} />
                          <span>{note.title || note.content.slice(0, 30)}...</span>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className={styles.notifContainer} ref={notifRef}>
          <button
            className={styles.iconBtn}
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={20} />
            {notificationCount > 0 && (
              <span className={styles.badge}>{notificationCount}</span>
            )}
          </button>

          {showNotifications && (
            <div className={styles.notifDropdown}>
              <div className={styles.notifHeader}>
                <h3>Notifications</h3>
                {notificationCount > 0 && (
                  <span className={styles.notifCount}>{notificationCount} alerts</span>
                )}
              </div>

              <div className={styles.notifContent}>
                {plantsNeedingWater.length > 0 && (
                  <div className={styles.notifSection}>
                    <div className={styles.notifSectionTitle}>
                      <Droplets size={14} />
                      Plants Need Water
                    </div>
                    {plantsNeedingWater.map((plant) => (
                      <button
                        key={plant.id}
                        className={styles.notifItem}
                        onClick={() => {
                          setShowNotifications(false);
                          navigate(`/admin/plants/${plant.id}`);
                        }}
                      >
                        <AlertTriangle
                          size={14}
                          className={
                            plant.wateringStatus === 'critical'
                              ? styles.critical
                              : styles.warning
                          }
                        />
                        <span>{plant.name}</span>
                        <span className={styles.notifStatus}>
                          {plant.wateringStatus}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {recentActivities.length > 0 && (
                  <div className={styles.notifSection}>
                    <div className={styles.notifSectionTitle}>Recent Activity</div>
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className={styles.notifActivity}>
                        <span>{activity.action}</span>
                        <span className={styles.notifTime}>
                          {new Date(activity.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {plantsNeedingWater.length === 0 && recentActivities.length === 0 && (
                  <div className={styles.noNotif}>No notifications</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <button className={styles.userMenu}>
          <div className={styles.avatar}>
            {currentUser ? getInitials(currentUser.name) : 'U'}
          </div>
          <div>
            <div className={styles.userName}>
              {currentUser?.name || 'User'}
            </div>
            <div className={styles.userRole}>Farm Owner</div>
          </div>
        </button>
      </div>
    </header>
  );
}

export default TopBar;

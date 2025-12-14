import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { ChatWidget } from '../../chat';
import { useUIStore, useFieldsStore, usePlantsStore } from '../../../stores';
import { defaultPlantTypes, sampleFields, samplePlants } from '../../../services/seedData';
import styles from './AdminLayout.module.css';

export function AdminLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { sidebarCollapsed } = useUIStore();
  const { setFields, fields } = useFieldsStore();
  const { setPlants, setPlantTypes, plants } = usePlantsStore();

  // Initialize seed data on first load
  useEffect(() => {
    if (fields.length === 0) {
      setFields(sampleFields);
    }
    if (plants.length === 0) {
      setPlantTypes(defaultPlantTypes);
      setPlants(samplePlants);
    }
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <div
        className={`${styles.sidebar} ${sidebarCollapsed ? styles.collapsed : ''} ${
          mobileMenuOpen ? styles.mobileOpen : ''
        }`}
      >
        <Sidebar />
      </div>

      {/* Mobile overlay */}
      <div
        className={`${styles.overlay} ${mobileMenuOpen ? styles.visible : ''}`}
        onClick={closeMobileMenu}
      />

      {/* Main content */}
      <main
        className={`${styles.mainContent} ${sidebarCollapsed ? styles.expanded : ''}`}
      >
        <div className={styles.topBar}>
          <TopBar onMenuClick={toggleMobileMenu} />
        </div>

        <div className={styles.content}>
          <Outlet />
        </div>
      </main>

      {/* Chat Support Widget */}
      <ChatWidget />
    </div>
  );
}

export default AdminLayout;

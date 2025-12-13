import { useState, useEffect } from 'react';
import { User, Building2, Bell, Save } from 'lucide-react';
import styles from './SettingsPage.module.css';

type SettingsTab = 'profile' | 'farm' | 'notifications';

interface CurrentUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [farmData, setFarmData] = useState({
    name: 'Green Valley Farm',
    address: '123 Farm Road, Valley City',
    timezone: 'UTC-5',
    units: 'metric',
  });

  const [notifications, setNotifications] = useState({
    overdueWatering: true,
    newProblems: true,
    taskReminders: true,
    weeklyReport: false,
  });

  // Load current user data on mount
  useEffect(() => {
    const currentUserStr = localStorage.getItem('farm-plus-current-user');
    if (currentUserStr) {
      try {
        const currentUser: CurrentUser = JSON.parse(currentUserStr);
        setProfileData({
          name: currentUser.name || '',
          email: currentUser.email || '',
          phone: currentUser.phone || '',
        });
      } catch {
        // If parsing fails, use defaults
      }
    }
  }, []);

  const tabs = [
    { id: 'profile' as const, label: 'Profile', icon: User },
    { id: 'farm' as const, label: 'Farm Settings', icon: Building2 },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
  ];

  const handleSave = () => {
    // Update current user in localStorage
    const currentUserStr = localStorage.getItem('farm-plus-current-user');
    if (currentUserStr) {
      try {
        const currentUser = JSON.parse(currentUserStr);
        const updatedUser = {
          ...currentUser,
          name: profileData.name,
          email: profileData.email,
          phone: profileData.phone,
        };
        localStorage.setItem('farm-plus-current-user', JSON.stringify(updatedUser));

        // Also update in users array
        const usersStr = localStorage.getItem('farm-plus-users');
        if (usersStr) {
          const users = JSON.parse(usersStr);
          const updatedUsers = users.map((u: CurrentUser) =>
            u.id === currentUser.id ? updatedUser : u
          );
          localStorage.setItem('farm-plus-users', JSON.stringify(updatedUsers));
        }
      } catch {
        // Handle error silently
      }
    }
    alert('Settings saved successfully!');
  };

  return (
    <div className={styles.container}>
      {/* Tabs */}
      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className={styles.content}>
        {activeTab === 'profile' && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Profile Settings</h2>
            <div className={styles.form}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Full Name</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Email</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Phone</label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className={styles.input}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'farm' && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Farm Settings</h2>
            <div className={styles.form}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Farm Name</label>
                <input
                  type="text"
                  value={farmData.name}
                  onChange={(e) => setFarmData({ ...farmData, name: e.target.value })}
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Address</label>
                <input
                  type="text"
                  value={farmData.address}
                  onChange={(e) => setFarmData({ ...farmData, address: e.target.value })}
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Timezone</label>
                <select
                  value={farmData.timezone}
                  onChange={(e) => setFarmData({ ...farmData, timezone: e.target.value })}
                  className={styles.select}
                >
                  <option value="UTC-8">UTC-8 (Pacific)</option>
                  <option value="UTC-7">UTC-7 (Mountain)</option>
                  <option value="UTC-6">UTC-6 (Central)</option>
                  <option value="UTC-5">UTC-5 (Eastern)</option>
                  <option value="UTC+0">UTC+0 (London)</option>
                  <option value="UTC+1">UTC+1 (Paris)</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Units</label>
                <select
                  value={farmData.units}
                  onChange={(e) => setFarmData({ ...farmData, units: e.target.value })}
                  className={styles.select}
                >
                  <option value="metric">Metric (m², liters)</option>
                  <option value="imperial">Imperial (ft², gallons)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Notification Settings</h2>
            <div className={styles.form}>
              <div className={styles.toggle}>
                <div className={styles.toggleInfo}>
                  <span className={styles.toggleLabel}>Overdue Watering Alerts</span>
                  <span className={styles.toggleDesc}>Get notified when plants need water</span>
                </div>
                <button
                  className={`${styles.toggleBtn} ${notifications.overdueWatering ? styles.on : ''}`}
                  onClick={() => setNotifications({ ...notifications, overdueWatering: !notifications.overdueWatering })}
                >
                  <span className={styles.toggleKnob} />
                </button>
              </div>

              <div className={styles.toggle}>
                <div className={styles.toggleInfo}>
                  <span className={styles.toggleLabel}>Problem Alerts</span>
                  <span className={styles.toggleDesc}>Get notified about plant health issues</span>
                </div>
                <button
                  className={`${styles.toggleBtn} ${notifications.newProblems ? styles.on : ''}`}
                  onClick={() => setNotifications({ ...notifications, newProblems: !notifications.newProblems })}
                >
                  <span className={styles.toggleKnob} />
                </button>
              </div>

              <div className={styles.toggle}>
                <div className={styles.toggleInfo}>
                  <span className={styles.toggleLabel}>Task Reminders</span>
                  <span className={styles.toggleDesc}>Get reminded about upcoming tasks</span>
                </div>
                <button
                  className={`${styles.toggleBtn} ${notifications.taskReminders ? styles.on : ''}`}
                  onClick={() => setNotifications({ ...notifications, taskReminders: !notifications.taskReminders })}
                >
                  <span className={styles.toggleKnob} />
                </button>
              </div>

              <div className={styles.toggle}>
                <div className={styles.toggleInfo}>
                  <span className={styles.toggleLabel}>Weekly Report</span>
                  <span className={styles.toggleDesc}>Receive a weekly summary email</span>
                </div>
                <button
                  className={`${styles.toggleBtn} ${notifications.weeklyReport ? styles.on : ''}`}
                  onClick={() => setNotifications({ ...notifications, weeklyReport: !notifications.weeklyReport })}
                >
                  <span className={styles.toggleKnob} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className={styles.actions}>
          <button className={styles.saveBtn} onClick={handleSave}>
            <Save size={18} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;

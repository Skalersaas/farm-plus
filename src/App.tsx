import { Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages';
import './styles/globals.css';

// Lazy load admin pages
import { lazy, Suspense } from 'react';

const AdminLayout = lazy(() => import('./components/admin/layout/AdminLayout'));
const Dashboard = lazy(() => import('./components/admin/dashboard/Dashboard'));
const FieldsList = lazy(() => import('./components/admin/fields/FieldsList'));
const FieldDetail = lazy(() => import('./components/admin/fields/FieldDetail'));
const PlantsList = lazy(() => import('./components/admin/plants/PlantsList'));
const PlantDetail = lazy(() => import('./components/admin/plants/PlantDetail'));
const VirtualMap = lazy(() => import('./components/admin/map/VirtualMap'));
const Calendar = lazy(() => import('./components/admin/calendar/Calendar'));
const NotesJournal = lazy(() => import('./components/admin/notes/NotesJournal'));
const ReportsPage = lazy(() => import('./components/admin/reports/ReportsPage'));
const SettingsPage = lazy(() => import('./components/admin/settings/SettingsPage'));

// Loading fallback component
function LoadingFallback() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      color: 'white',
      fontSize: '1.2rem'
    }}>
      Loading...
    </div>
  );
}

function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Landing page */}
        <Route path="/" element={<LandingPage />} />

        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="fields" element={<FieldsList />} />
          <Route path="fields/:id" element={<FieldDetail />} />
          <Route path="plants" element={<PlantsList />} />
          <Route path="plants/:id" element={<PlantDetail />} />
          <Route path="map" element={<VirtualMap />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="notes" element={<NotesJournal />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;

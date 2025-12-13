import { Map, Leaf, Droplets, AlertTriangle } from 'lucide-react';
import { useFieldsStore, usePlantsStore } from '../../../stores';
import { StatsCard } from './StatsCard';
import { QuickActions } from './QuickActions';
import { WateringWidget } from './WateringWidget';
import { ActivityFeed } from './ActivityFeed';
import styles from './Dashboard.module.css';

export function Dashboard() {
  const { fields } = useFieldsStore();
  const { plants, getPlantsNeedingWater } = usePlantsStore();

  const totalPlants = plants.reduce((sum, p) => sum + p.quantity, 0);
  const plantsNeedingWater = getPlantsNeedingWater();
  const problemPlants = plants.filter(
    (p) => p.healthStatus === 'sick' || p.healthStatus === 'observation'
  );

  return (
    <div className={styles.dashboard}>
      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <StatsCard
          label="Total Fields"
          value={fields.length}
          icon={Map}
          variant="primary"
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          label="Total Plants"
          value={totalPlants}
          icon={Leaf}
          variant="success"
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          label="Need Watering"
          value={plantsNeedingWater.length}
          icon={Droplets}
          variant={plantsNeedingWater.length > 0 ? 'warning' : 'info'}
        />
        <StatsCard
          label="Problems"
          value={problemPlants.length}
          icon={AlertTriangle}
          variant={problemPlants.length > 0 ? 'danger' : 'success'}
        />
      </div>

      {/* Widgets Grid */}
      <div className={styles.widgetsGrid}>
        <div className={styles.mainWidgets}>
          {/* Activity Feed */}
          <div>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Recent Activity</h2>
            </div>
            <ActivityFeed />
          </div>
        </div>

        <div className={styles.sideWidgets}>
          {/* Quick Actions */}
          <QuickActions />

          {/* Watering Widget */}
          <WateringWidget />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

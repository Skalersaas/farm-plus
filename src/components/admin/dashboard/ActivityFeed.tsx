import { formatDistanceToNow } from 'date-fns';
import {
  Droplets,
  Leaf,
  FileText,
  CheckSquare,
  AlertTriangle,
  Map,
  Sprout,
} from 'lucide-react';
import { useUIStore } from '../../../stores';
import type { ActivityLogEntry } from '../../../types';
import styles from './ActivityFeed.module.css';

const iconMap: Record<ActivityLogEntry['type'], typeof Droplets> = {
  watering: Droplets,
  planting: Sprout,
  harvest: Leaf,
  note: FileText,
  task: CheckSquare,
  problem: AlertTriangle,
  field: Map,
  plant: Leaf,
};

// Sample activity data (in real app, this would come from the store)
const sampleActivity: ActivityLogEntry[] = [
  {
    id: '1',
    type: 'watering',
    action: 'complete',
    description: 'Watered Cherry Tomatoes',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    type: 'planting',
    action: 'create',
    description: 'Planted 10 Cucumber seedlings',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    type: 'problem',
    action: 'create',
    description: 'Detected powdery mildew on Strawberries',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    type: 'note',
    action: 'create',
    description: 'Added growth observation for Tomatoes',
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    type: 'watering',
    action: 'complete',
    description: 'Watered Sweet Basil',
    timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
  },
];

export function ActivityFeed() {
  const { activityLog } = useUIStore();

  // Use sample data if activity log is empty
  const activities = activityLog.length > 0 ? activityLog.slice(0, 5) : sampleActivity;

  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <h3 className={styles.title}>Recent Activity</h3>
      </div>

      {activities.length > 0 ? (
        <div className={styles.list}>
          {activities.map((activity) => {
            const Icon = iconMap[activity.type] || FileText;

            return (
              <div key={activity.id} className={styles.item}>
                <div className={`${styles.iconWrapper} ${styles[activity.type]}`}>
                  <Icon size={16} />
                </div>
                <div className={styles.content}>
                  <div className={styles.description}>{activity.description}</div>
                  <div className={styles.time}>
                    {formatDistanceToNow(new Date(activity.timestamp), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles.empty}>No recent activity</div>
      )}
    </div>
  );
}

export default ActivityFeed;

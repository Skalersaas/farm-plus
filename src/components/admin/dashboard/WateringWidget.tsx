import { Link } from 'react-router-dom';
import { Droplets, CheckCircle } from 'lucide-react';
import { usePlantsStore, useFieldsStore } from '../../../stores';
import type { WateringStatus } from '../../../types';
import styles from './WateringWidget.module.css';

const statusConfig: Record<WateringStatus, { className: string; label: string }> = {
  watered: { className: 'watered', label: 'Watered' },
  due_soon: { className: 'dueSoon', label: 'Due soon' },
  overdue: { className: 'overdue', label: 'Overdue' },
  critical: { className: 'critical', label: 'Critical' },
};

export function WateringWidget() {
  const { plants, waterPlant } = usePlantsStore();
  const { getFieldById } = useFieldsStore();

  // Get plants that need watering (not watered status)
  const plantsNeedingWater = plants
    .filter((p) => p.wateringStatus !== 'watered')
    .sort((a, b) => {
      const priority = { critical: 0, overdue: 1, due_soon: 2, watered: 3 };
      return priority[a.wateringStatus] - priority[b.wateringStatus];
    })
    .slice(0, 5);

  const handleWater = (plantId: string) => {
    waterPlant(plantId);
  };

  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <h3 className={styles.title}>Watering Schedule</h3>
        <Link to="/admin/plants" className={styles.viewAll}>
          View all
        </Link>
      </div>

      {plantsNeedingWater.length > 0 ? (
        <div className={styles.list}>
          {plantsNeedingWater.map((plant) => {
            const field = getFieldById(plant.fieldId);
            const config = statusConfig[plant.wateringStatus];

            return (
              <div key={plant.id} className={styles.item}>
                <div className={`${styles.statusIcon} ${styles[config.className]}`}>
                  <Droplets size={16} />
                </div>
                <div className={styles.itemContent}>
                  <div className={styles.plantName}>{plant.name}</div>
                  <div className={styles.plantInfo}>
                    {field?.name} • {config.label}
                  </div>
                </div>
                <button
                  className={styles.waterBtn}
                  onClick={() => handleWater(plant.id)}
                >
                  Water
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles.empty}>
          <CheckCircle size={32} className={styles.emptyIcon} />
          <p>All plants are watered!</p>
        </div>
      )}
    </div>
  );
}

export default WateringWidget;

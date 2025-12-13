import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Droplets, Calendar, MapPin } from 'lucide-react';
import { usePlantsStore, useFieldsStore } from '../../../stores';
import { format, formatDistanceToNow } from 'date-fns';
import styles from './PlantDetail.module.css';

export function PlantDetail() {
  const { id } = useParams<{ id: string }>();
  const { getPlantById, getWateringLogs, waterPlant } = usePlantsStore();
  const { getFieldById } = useFieldsStore();

  const plant = id ? getPlantById(id) : undefined;
  const wateringLogs = id ? getWateringLogs(id) : [];
  const field = plant ? getFieldById(plant.fieldId) : undefined;

  if (!plant) {
    return (
      <div className={styles.notFound}>
        <h2>Plant not found</h2>
        <Link to="/admin/plants" className={styles.backLink}>
          <ArrowLeft size={18} />
          Back to Plants
        </Link>
      </div>
    );
  }

  const handleWater = () => {
    if (plant) {
      waterPlant(plant.id);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <Link to="/admin/plants" className={styles.backLink}>
          <ArrowLeft size={18} />
          Back to Plants
        </Link>

        <div className={styles.headerContent}>
          <div>
            <h1 className={styles.title}>{plant.name}</h1>
            <div className={styles.meta}>
              <span className={styles.metaItem}>
                <MapPin size={14} />
                {field?.name || 'Unknown field'}
              </span>
              <span className={styles.metaItem}>
                <Calendar size={14} />
                Planted {format(new Date(plant.plantedAt), 'MMM d, yyyy')}
              </span>
            </div>
          </div>

          <div className={styles.actions}>
            <button className={styles.waterBtn} onClick={handleWater}>
              <Droplets size={16} />
              Water Now
            </button>
            <button className={styles.editBtn}>
              <Edit size={16} />
              Edit
            </button>
            <button className={styles.deleteBtn}>
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className={styles.grid}>
        {/* Info Card */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Plant Information</h3>
          <div className={styles.infoList}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Type</span>
              <span className={styles.infoValue}>{plant.type?.name || 'Unknown'}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Variety</span>
              <span className={styles.infoValue}>{plant.variety || 'Not specified'}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Quantity</span>
              <span className={styles.infoValue}>{plant.quantity} plants</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Health Status</span>
              <span className={`${styles.badge} ${styles[plant.healthStatus]}`}>
                {plant.healthStatus}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Watering Status</span>
              <span className={`${styles.badge} ${styles[plant.wateringStatus.replace('_', '')]}`}>
                {plant.wateringStatus.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>

        {/* Watering Info */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Watering Schedule</h3>
          <div className={styles.infoList}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Frequency</span>
              <span className={styles.infoValue}>
                Every {plant.wateringFrequencyDays} days
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Last Watered</span>
              <span className={styles.infoValue}>
                {plant.lastWateredAt
                  ? formatDistanceToNow(new Date(plant.lastWateredAt), {
                      addSuffix: true,
                    })
                  : 'Never'}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Next Watering</span>
              <span className={styles.infoValue}>
                {plant.nextWateringAt
                  ? format(new Date(plant.nextWateringAt), 'MMM d, yyyy')
                  : 'Not scheduled'}
              </span>
            </div>
          </div>
        </div>

        {/* Watering History */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Watering History</h3>
          {wateringLogs.length > 0 ? (
            <div className={styles.historyList}>
              {wateringLogs.slice(0, 10).map((log) => (
                <div key={log.id} className={styles.historyItem}>
                  <Droplets size={14} className={styles.historyIcon} />
                  <div className={styles.historyContent}>
                    <span className={styles.historyDate}>
                      {format(new Date(log.date), 'MMM d, yyyy h:mm a')}
                    </span>
                    {log.notes && (
                      <span className={styles.historyNotes}>{log.notes}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>No watering history yet</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PlantDetail;

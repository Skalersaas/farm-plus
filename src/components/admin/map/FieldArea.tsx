import { MapPin, Ruler } from 'lucide-react';
import { PlantMarker } from './PlantMarker';
import type { Field, Plant } from '../../../types';
import styles from './FieldArea.module.css';

interface FieldAreaProps {
  field: Field;
  plants: Plant[];
  onPlantClick: (plant: Plant, event: React.MouseEvent) => void;
}

const statusColors: Record<string, string> = {
  healthy: '#22c55e',
  attention: '#f59e0b',
  critical: '#ef4444',
};

export function FieldArea({ field, plants, onPlantClick }: FieldAreaProps) {
  const statusColor = statusColors[field.status] || statusColors.healthy;

  return (
    <div
      className={styles.container}
      style={{ borderColor: `${statusColor}40` }}
    >
      {/* Field Header */}
      <div className={styles.header}>
        <div className={styles.fieldInfo}>
          <div
            className={styles.statusDot}
            style={{ background: statusColor }}
          />
          <h3 className={styles.fieldName}>{field.name}</h3>
          <div
            className={styles.statusBadge}
            style={{ background: `${statusColor}20`, color: statusColor }}
          >
            {field.status}
          </div>
        </div>
        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <Ruler size={14} />
            {field.area} m²
          </span>
          {field.location && (
            <span className={styles.metaItem}>
              <MapPin size={14} />
              {field.location}
            </span>
          )}
        </div>
      </div>

      {/* Plants Grid */}
      <div className={styles.plantsGrid}>
        {plants.length > 0 ? (
          plants.map((plant) => (
            <PlantMarker
              key={plant.id}
              plant={plant}
              onClick={(e) => onPlantClick(plant, e)}
            />
          ))
        ) : (
          <div className={styles.noPlantsMessage}>
            No plants in this field
          </div>
        )}
      </div>

      {/* Field Footer */}
      <div className={styles.footer}>
        <span className={styles.plantCount}>
          {plants.length} plant{plants.length !== 1 ? 's' : ''}
        </span>
        {field.soilType && (
          <span className={styles.soilType}>
            {field.soilType} soil
          </span>
        )}
      </div>
    </div>
  );
}

export default FieldArea;

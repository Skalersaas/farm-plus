import { Leaf, Flower2, Carrot, Cherry } from 'lucide-react';
import type { Plant } from '../../../types';
import styles from './PlantMarker.module.css';

interface PlantMarkerProps {
  plant: Plant;
  onClick: (event: React.MouseEvent) => void;
}

const statusColors: Record<string, string> = {
  watered: '#22c55e',
  due_soon: '#f59e0b',
  overdue: '#f97316',
  critical: '#ef4444',
};

// Get icon based on plant type/category
function getPlantIcon(plant: Plant) {
  const category = plant.type?.category?.toLowerCase() || '';
  const name = plant.name.toLowerCase();

  if (category.includes('herb') || name.includes('basil') || name.includes('mint')) {
    return Flower2;
  }
  if (category.includes('fruit') || name.includes('strawberry') || name.includes('tomato')) {
    return Cherry;
  }
  if (name.includes('carrot') || name.includes('potato') || name.includes('beet')) {
    return Carrot;
  }
  return Leaf;
}

export function PlantMarker({ plant, onClick }: PlantMarkerProps) {
  const color = statusColors[plant.wateringStatus] || statusColors.watered;
  const Icon = getPlantIcon(plant);
  const isCritical = plant.wateringStatus === 'critical';

  return (
    <button
      className={`${styles.marker} ${isCritical ? styles.pulse : ''}`}
      style={{
        background: `${color}20`,
        borderColor: color,
        color: color,
      }}
      onClick={onClick}
      title={`${plant.name} - ${plant.wateringStatus.replace('_', ' ')}`}
    >
      <Icon size={16} />
      <span className={styles.name}>{plant.name}</span>
      <span className={styles.quantity}>x{plant.quantity}</span>
    </button>
  );
}

export default PlantMarker;

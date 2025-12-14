import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Droplets, Eye, Edit, Heart, X } from 'lucide-react';
import { format } from 'date-fns';
import { usePlantsStore } from '../../../stores';
import type { Plant } from '../../../types';
import styles from './PlantActionMenu.module.css';

interface PlantActionMenuProps {
  plant: Plant;
  position: { x: number; y: number };
  onClose: () => void;
}

const healthColors: Record<string, string> = {
  healthy: '#22c55e',
  sick: '#ef4444',
  observation: '#f59e0b',
  dead: '#6b7280',
};

export function PlantActionMenu({ plant, position, onClose }: PlantActionMenuProps) {
  const navigate = useNavigate();
  const { waterPlant } = usePlantsStore();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleWater = () => {
    waterPlant(plant.id);
    onClose();
  };

  const handleViewDetails = () => {
    navigate(`/admin/plants/${plant.id}`);
    onClose();
  };

  const handleEdit = () => {
    navigate(`/admin/plants?edit=${plant.id}`);
    onClose();
  };

  const healthColor = healthColors[plant.healthStatus] || healthColors.healthy;
  const canWater = plant.wateringStatus !== 'watered';

  return (
    <div
      ref={menuRef}
      className={styles.menu}
      style={{
        left: Math.min(position.x, window.innerWidth - 220),
        top: Math.min(position.y, window.innerHeight - 280),
      }}
    >
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.plantInfo}>
          <h4 className={styles.plantName}>{plant.name}</h4>
          <span className={styles.plantType}>{plant.type?.name || 'Plant'}</span>
        </div>
        <button className={styles.closeBtn} onClick={onClose}>
          <X size={16} />
        </button>
      </div>

      {/* Status */}
      <div className={styles.statusRow}>
        <div className={styles.statusItem}>
          <span className={styles.statusLabel}>Health</span>
          <span
            className={styles.healthBadge}
            style={{ background: `${healthColor}20`, color: healthColor }}
          >
            <Heart size={12} />
            {plant.healthStatus}
          </span>
        </div>
        <div className={styles.statusItem}>
          <span className={styles.statusLabel}>Last Watered</span>
          <span className={styles.statusValue}>
            {plant.lastWateredAt
              ? format(new Date(plant.lastWateredAt), 'MMM d, h:mm a')
              : 'Never'}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <button
          className={`${styles.actionBtn} ${styles.waterBtn}`}
          onClick={handleWater}
          disabled={!canWater}
        >
          <Droplets size={16} />
          {canWater ? 'Water Now' : 'Already Watered'}
        </button>

        <button className={styles.actionBtn} onClick={handleViewDetails}>
          <Eye size={16} />
          View Details
        </button>

        <button className={styles.actionBtn} onClick={handleEdit}>
          <Edit size={16} />
          Edit Plant
        </button>
      </div>
    </div>
  );
}

export default PlantActionMenu;

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Leaf, Droplets, Eye } from 'lucide-react';
import { usePlantsStore, useFieldsStore } from '../../../stores';
import { formatDistanceToNow } from 'date-fns';
import type { WateringStatus } from '../../../types';
import styles from './PlantsList.module.css';

const wateringStatusLabels: Record<WateringStatus, string> = {
  watered: 'Watered',
  due_soon: 'Due Soon',
  overdue: 'Overdue',
  critical: 'Critical',
};

const wateringStatusStyles: Record<WateringStatus, string> = {
  watered: styles.watered,
  due_soon: styles.dueSoon,
  overdue: styles.overdue,
  critical: styles.critical,
};

export function PlantsList() {
  const { plants, waterPlant } = usePlantsStore();
  const { fields, getFieldById } = useFieldsStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [fieldFilter, setFieldFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const filteredPlants = plants.filter((plant) => {
    const matchesSearch = plant.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesField = !fieldFilter || plant.fieldId === fieldFilter;
    const matchesStatus = !statusFilter || plant.wateringStatus === statusFilter;
    return matchesSearch && matchesField && matchesStatus;
  });

  const handleWater = (plantId: string) => {
    waterPlant(plantId);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.filters}>
          <div className={styles.searchBar}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search plants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <select
            value={fieldFilter}
            onChange={(e) => setFieldFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">All Fields</option>
            {fields.map((field) => (
              <option key={field.id} value={field.id}>
                {field.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">All Status</option>
            <option value="watered">Watered</option>
            <option value="due_soon">Due Soon</option>
            <option value="overdue">Overdue</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <div className={styles.actions}>
          <button className={styles.addBtn}>
            <Plus size={18} />
            Add Plant
          </button>
        </div>
      </div>

      {/* Plants Grid */}
      {filteredPlants.length > 0 ? (
        <div className={styles.grid}>
          {filteredPlants.map((plant) => {
            const field = getFieldById(plant.fieldId);

            return (
              <div key={plant.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <div>
                    <div className={styles.plantIcon}>
                      <Leaf size={20} />
                    </div>
                  </div>
                  <div style={{ flex: 1, marginLeft: '12px' }}>
                    <h3 className={styles.cardTitle}>{plant.name}</h3>
                    <div className={styles.cardSubtitle}>
                      {field?.name || 'Unknown field'}
                    </div>
                  </div>
                  <div
                    className={`${styles.wateringStatus} ${
                      wateringStatusStyles[plant.wateringStatus]
                    }`}
                  >
                    <Droplets size={12} />
                    {wateringStatusLabels[plant.wateringStatus]}
                  </div>
                </div>

                <div className={styles.cardContent}>
                  <div className={styles.stat}>
                    <span className={styles.statLabel}>Quantity</span>
                    <span className={styles.statValue}>{plant.quantity} plants</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statLabel}>Health</span>
                    <span
                      className={`${styles.healthBadge} ${styles[plant.healthStatus]}`}
                    >
                      {plant.healthStatus}
                    </span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statLabel}>Planted</span>
                    <span className={styles.statValue}>
                      {formatDistanceToNow(new Date(plant.plantedAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statLabel}>Last Watered</span>
                    <span className={styles.statValue}>
                      {plant.lastWateredAt
                        ? formatDistanceToNow(new Date(plant.lastWateredAt), {
                            addSuffix: true,
                          })
                        : 'Never'}
                    </span>
                  </div>
                </div>

                <div className={styles.cardFooter}>
                  <Link to={`/admin/plants/${plant.id}`} className={styles.viewLink}>
                    <Eye size={14} />
                    View
                  </Link>
                  {plant.wateringStatus !== 'watered' && (
                    <button
                      className={styles.waterBtn}
                      onClick={() => handleWater(plant.id)}
                    >
                      <Droplets size={14} />
                      Water
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles.empty}>
          <p>No plants found. Add your first plant to get started!</p>
          <button className={styles.addBtn}>
            <Plus size={18} />
            Add Plant
          </button>
        </div>
      )}
    </div>
  );
}

export default PlantsList;

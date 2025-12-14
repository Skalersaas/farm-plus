import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Leaf, Droplets, Eye, Edit, Map, Filter } from 'lucide-react';
import { usePlantsStore, useFieldsStore } from '../../../stores';
import { Dropdown } from '../../ui';
import type { DropdownOption } from '../../ui';
import { PlantForm } from './PlantForm';
import { formatDistanceToNow } from 'date-fns';
import type { Plant, WateringStatus } from '../../../types';
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

const statusOptions: DropdownOption[] = [
  { value: '', label: 'All Status', icon: <Filter size={16} /> },
  { value: 'watered', label: 'Watered', icon: <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} /> },
  { value: 'due_soon', label: 'Due Soon', icon: <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} /> },
  { value: 'overdue', label: 'Overdue', icon: <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#f97316', display: 'inline-block' }} /> },
  { value: 'critical', label: 'Critical', icon: <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} /> },
];

export function PlantsList() {
  const { plants, waterPlant } = usePlantsStore();
  const { fields, getFieldById } = useFieldsStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [fieldFilter, setFieldFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [editingPlant, setEditingPlant] = useState<Plant | null>(null);

  // Build field options
  const fieldOptions: DropdownOption[] = [
    { value: '', label: 'All Fields', icon: <Map size={16} /> },
    ...fields.map((field) => ({
      value: field.id,
      label: field.name,
      icon: <Map size={16} />,
    })),
  ];

  const filteredPlants = plants.filter((plant) => {
    const matchesSearch = plant.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesField = !fieldFilter || plant.fieldId === fieldFilter;
    const matchesStatus = !statusFilter || plant.wateringStatus === statusFilter;
    return matchesSearch && matchesField && matchesStatus;
  });

  const handleWater = (plantId: string) => {
    waterPlant(plantId);
  };

  const handleAddClick = () => {
    setEditingPlant(null);
    setShowForm(true);
  };

  const handleEditClick = (plant: Plant) => {
    setEditingPlant(plant);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingPlant(null);
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

          <Dropdown
            options={fieldOptions}
            value={fieldFilter}
            onChange={setFieldFilter}
            placeholder="All Fields"
          />

          <Dropdown
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="All Status"
          />
        </div>

        <div className={styles.actions}>
          <button className={styles.addBtn} onClick={handleAddClick}>
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
                      title={plant.healthStatus}
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
                  <button
                    className={styles.editBtn}
                    onClick={() => handleEditClick(plant)}
                  >
                    <Edit size={14} />
                    Edit
                  </button>
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
          <button className={styles.addBtn} onClick={handleAddClick}>
            <Plus size={18} />
            Add Plant
          </button>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <PlantForm plant={editingPlant} onClose={handleCloseForm} />
      )}
    </div>
  );
}

export default PlantsList;

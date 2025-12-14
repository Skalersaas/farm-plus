import { useState } from 'react';
import { Grid3X3, ZoomIn, ZoomOut, RotateCcw, Plus } from 'lucide-react';
import { useFieldsStore, usePlantsStore } from '../../../stores';
import { FieldArea } from './FieldArea';
import { MapControls } from './MapControls';
import { PlantActionMenu } from './PlantActionMenu';
import { FieldForm } from '../fields/FieldForm';
import type { Plant } from '../../../types';
import styles from './VirtualMap.module.css';

export function VirtualMap() {
  const { fields } = useFieldsStore();
  const { plants } = usePlantsStore();
  const [scale, setScale] = useState(1);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterField, setFilterField] = useState<string>('');
  const [showFieldForm, setShowFieldForm] = useState(false);

  // Group plants by field
  const plantsByField = plants.reduce((acc, plant) => {
    if (!acc[plant.fieldId]) {
      acc[plant.fieldId] = [];
    }
    acc[plant.fieldId].push(plant);
    return acc;
  }, {} as Record<string, Plant[]>);

  // Filter fields based on selection
  const filteredFields = filterField
    ? fields.filter((f) => f.id === filterField)
    : fields;

  const handlePlantClick = (plant: Plant, event: React.MouseEvent) => {
    event.stopPropagation();
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    setMenuPosition({ x: rect.left, y: rect.bottom + 8 });
    setSelectedPlant(plant);
  };

  const handleCloseMenu = () => {
    setSelectedPlant(null);
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.5));
  };

  const handleReset = () => {
    setScale(1);
    setFilterStatus('');
    setFilterField('');
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <div className={styles.iconWrapper}>
            <Grid3X3 size={24} />
          </div>
          <div>
            <h1 className={styles.title}>Crop Map</h1>
            <p className={styles.subtitle}>
              Interactive view of your fields and plants
            </p>
          </div>
        </div>

        <div className={styles.headerActions}>
          <div className={styles.controls}>
            <button className={styles.controlBtn} onClick={handleZoomOut} title="Zoom Out">
              <ZoomOut size={18} />
            </button>
            <span className={styles.scaleLabel}>{Math.round(scale * 100)}%</span>
            <button className={styles.controlBtn} onClick={handleZoomIn} title="Zoom In">
              <ZoomIn size={18} />
            </button>
            <button className={styles.controlBtn} onClick={handleReset} title="Reset">
              <RotateCcw size={18} />
            </button>
          </div>

          <button className={styles.addBtn} onClick={() => setShowFieldForm(true)}>
            <Plus size={18} />
            Add Field
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.content}>
        {/* Map Area */}
        <div className={styles.mapWrapper}>
          <div
            className={styles.mapCanvas}
            style={{ transform: `scale(${scale})` }}
            onClick={handleCloseMenu}
          >
            {filteredFields.length > 0 ? (
              <div className={styles.fieldsGrid}>
                {filteredFields.map((field) => {
                  const fieldPlants = plantsByField[field.id] || [];
                  const filteredPlants = filterStatus
                    ? fieldPlants.filter((p) => p.wateringStatus === filterStatus)
                    : fieldPlants;

                  return (
                    <FieldArea
                      key={field.id}
                      field={field}
                      plants={filteredPlants}
                      onPlantClick={handlePlantClick}
                    />
                  );
                })}
              </div>
            ) : (
              <div className={styles.empty}>
                <Grid3X3 size={48} className={styles.emptyIcon} />
                <p>No fields found</p>
                <span>Add fields to see them on the map</span>
              </div>
            )}
          </div>
        </div>

        {/* Side Controls */}
        <MapControls
          fields={fields}
          filterField={filterField}
          filterStatus={filterStatus}
          onFieldChange={setFilterField}
          onStatusChange={setFilterStatus}
        />
      </div>

      {/* Plant Action Menu */}
      {selectedPlant && (
        <PlantActionMenu
          plant={selectedPlant}
          position={menuPosition}
          onClose={handleCloseMenu}
        />
      )}

      {/* Field Form Modal */}
      {showFieldForm && (
        <FieldForm onClose={() => setShowFieldForm(false)} />
      )}
    </div>
  );
}

export default VirtualMap;

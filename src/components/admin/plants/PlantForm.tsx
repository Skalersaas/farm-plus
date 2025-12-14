import { useState, useEffect } from 'react';
import { X, Leaf, Map } from 'lucide-react';
import { usePlantsStore, useFieldsStore } from '../../../stores';
import { Dropdown } from '../../ui';
import type { DropdownOption } from '../../ui';
import type { Plant, PlantHealthStatus, WateringStatus } from '../../../types';
import styles from './PlantForm.module.css';

interface PlantFormProps {
  plant?: Plant | null;
  onClose: () => void;
}

export function PlantForm({ plant, onClose }: PlantFormProps) {
  const { addPlant, updatePlant, plantTypes } = usePlantsStore();
  const { fields } = useFieldsStore();
  const isEditing = !!plant;

  const [formData, setFormData] = useState({
    name: '',
    typeId: '',
    fieldId: '',
    quantity: '1',
    wateringFrequencyDays: '7',
    healthStatus: 'healthy' as PlantHealthStatus,
    variety: '',
    notes: '',
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (plant) {
      setFormData({
        name: plant.name,
        typeId: plant.typeId || '',
        fieldId: plant.fieldId,
        quantity: plant.quantity.toString(),
        wateringFrequencyDays: plant.wateringFrequencyDays.toString(),
        healthStatus: plant.healthStatus,
        variety: plant.variety || '',
        notes: plant.notes || '',
      });
    }
  }, [plant]);

  // Build dropdown options
  const fieldOptions: DropdownOption[] = [
    { value: '', label: 'Select field', icon: <Map size={16} /> },
    ...fields.map((field) => ({
      value: field.id,
      label: field.name,
      icon: <Map size={16} />,
    })),
  ];

  const plantTypeOptions: DropdownOption[] = [
    { value: '', label: 'Custom', icon: <Leaf size={16} /> },
    ...plantTypes.map((type) => ({
      value: type.id,
      label: type.name,
      icon: <Leaf size={16} />,
    })),
  ];

  const healthStatusOptions: DropdownOption[] = [
    { value: 'healthy', label: 'Healthy', icon: <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} /> },
    { value: 'observation', label: 'Needs Observation', icon: <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} /> },
    { value: 'sick', label: 'Sick', icon: <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} /> },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Plant name is required');
      return;
    }

    if (!formData.fieldId) {
      setError('Please select a field');
      return;
    }

    if (!formData.quantity || parseInt(formData.quantity) <= 0) {
      setError('Valid quantity is required');
      return;
    }

    const selectedType = plantTypes.find((t) => t.id === formData.typeId);
    const defaultType = {
      id: 'custom',
      name: formData.name,
      category: 'Custom',
      wateringFrequencyDays: parseInt(formData.wateringFrequencyDays) || 7,
    };

    if (isEditing && plant) {
      updatePlant(plant.id, {
        name: formData.name.trim(),
        typeId: formData.typeId || 'custom',
        fieldId: formData.fieldId,
        quantity: parseInt(formData.quantity),
        wateringFrequencyDays: parseInt(formData.wateringFrequencyDays) || 7,
        healthStatus: formData.healthStatus,
        variety: formData.variety.trim() || undefined,
        notes: formData.notes.trim() || undefined,
      });
    } else {
      const now = new Date().toISOString();
      const newPlant: Plant = {
        id: `plant-${Date.now()}`,
        name: formData.name.trim(),
        typeId: formData.typeId || 'custom',
        type: selectedType || defaultType,
        fieldId: formData.fieldId,
        quantity: parseInt(formData.quantity),
        wateringFrequencyDays: parseInt(formData.wateringFrequencyDays) || 7,
        healthStatus: formData.healthStatus,
        wateringStatus: 'due_soon' as WateringStatus,
        variety: formData.variety.trim() || undefined,
        notes: formData.notes.trim() || undefined,
        plantedAt: now,
        photos: [],
        createdAt: now,
        updatedAt: now,
      };
      addPlant(newPlant);
    }

    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{isEditing ? 'Edit Plant' : 'Add New Plant'}</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Plant Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={styles.input}
              placeholder="e.g., Tomatoes"
            />
          </div>

          <div className={styles.row}>
            <Dropdown
              label="Field *"
              options={fieldOptions}
              value={formData.fieldId}
              onChange={(value) => setFormData({ ...formData, fieldId: value })}
              placeholder="Select field"
            />

            <Dropdown
              label="Plant Type"
              options={plantTypeOptions}
              value={formData.typeId}
              onChange={(value) => setFormData({ ...formData, typeId: value })}
              placeholder="Custom"
            />
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Quantity *</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className={styles.input}
                placeholder="e.g., 10"
                min="1"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Watering Frequency (days)</label>
              <input
                type="number"
                value={formData.wateringFrequencyDays}
                onChange={(e) => setFormData({ ...formData, wateringFrequencyDays: e.target.value })}
                className={styles.input}
                placeholder="e.g., 7"
                min="1"
              />
            </div>
          </div>

          <div className={styles.row}>
            <Dropdown
              label="Health Status"
              options={healthStatusOptions}
              value={formData.healthStatus}
              onChange={(value) => setFormData({ ...formData, healthStatus: value as PlantHealthStatus })}
              placeholder="Select status"
            />

            <div className={styles.formGroup}>
              <label className={styles.label}>Variety</label>
              <input
                type="text"
                value={formData.variety}
                onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
                className={styles.input}
                placeholder="e.g., Cherry"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className={styles.textarea}
              placeholder="Additional notes about this plant..."
              rows={3}
            />
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.submitBtn}>
              {isEditing ? 'Save Changes' : 'Add Plant'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PlantForm;

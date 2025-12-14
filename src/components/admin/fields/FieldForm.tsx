import { useState, useEffect } from 'react';
import { X, Layers } from 'lucide-react';
import { useFieldsStore } from '../../../stores';
import { Dropdown } from '../../ui';
import type { DropdownOption } from '../../ui';
import type { Field, FieldStatus, SoilType } from '../../../types';
import styles from './FieldForm.module.css';

interface FieldFormProps {
  field?: Field | null;
  onClose: () => void;
}

export function FieldForm({ field, onClose }: FieldFormProps) {
  const { addField, updateField } = useFieldsStore();
  const isEditing = !!field;

  const [formData, setFormData] = useState({
    name: '',
    area: '',
    location: '',
    soilType: '' as SoilType | '',
    status: 'healthy' as FieldStatus,
    notes: '',
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (field) {
      setFormData({
        name: field.name,
        area: field.area.toString(),
        location: field.location || '',
        soilType: field.soilType || '',
        status: field.status,
        notes: field.notes || '',
      });
    }
  }, [field]);

  // Dropdown options
  const statusOptions: DropdownOption[] = [
    { value: 'healthy', label: 'Healthy', icon: <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} /> },
    { value: 'attention', label: 'Needs Attention', icon: <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} /> },
    { value: 'critical', label: 'Critical', icon: <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} /> },
  ];

  const soilTypeOptions: DropdownOption[] = [
    { value: '', label: 'Select soil type', icon: <Layers size={16} /> },
    { value: 'clay', label: 'Clay', icon: <Layers size={16} /> },
    { value: 'sandy', label: 'Sandy', icon: <Layers size={16} /> },
    { value: 'loam', label: 'Loam', icon: <Layers size={16} /> },
    { value: 'silt', label: 'Silt', icon: <Layers size={16} /> },
    { value: 'peat', label: 'Peat', icon: <Layers size={16} /> },
    { value: 'chalk', label: 'Chalk', icon: <Layers size={16} /> },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Field name is required');
      return;
    }

    if (!formData.area || parseFloat(formData.area) <= 0) {
      setError('Valid area is required');
      return;
    }

    if (isEditing && field) {
      updateField(field.id, {
        name: formData.name.trim(),
        area: parseFloat(formData.area),
        location: formData.location.trim() || undefined,
        soilType: formData.soilType || undefined,
        status: formData.status,
        notes: formData.notes.trim() || undefined,
      });
    } else {
      const newField: Field = {
        id: `field-${Date.now()}`,
        name: formData.name.trim(),
        area: parseFloat(formData.area),
        location: formData.location.trim() || undefined,
        soilType: formData.soilType || undefined,
        status: formData.status,
        notes: formData.notes.trim() || undefined,
        zones: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      addField(newField);
    }

    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{isEditing ? 'Edit Field' : 'Add New Field'}</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Field Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={styles.input}
              placeholder="e.g., North Field"
            />
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Area (m²) *</label>
              <input
                type="number"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                className={styles.input}
                placeholder="e.g., 5000"
                min="0"
                step="0.01"
              />
            </div>

            <Dropdown
              label="Status"
              options={statusOptions}
              value={formData.status}
              onChange={(value) => setFormData({ ...formData, status: value as FieldStatus })}
              placeholder="Select status"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className={styles.input}
              placeholder="e.g., North side of property"
            />
          </div>

          <Dropdown
            label="Soil Type"
            options={soilTypeOptions}
            value={formData.soilType}
            onChange={(value) => setFormData({ ...formData, soilType: value as SoilType })}
            placeholder="Select soil type"
          />

          <div className={styles.formGroup}>
            <label className={styles.label}>Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className={styles.textarea}
              placeholder="Additional notes about this field..."
              rows={3}
            />
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.submitBtn}>
              {isEditing ? 'Save Changes' : 'Add Field'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FieldForm;

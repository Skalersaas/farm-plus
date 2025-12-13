import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useFieldsStore } from '../../../stores';
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

            <div className={styles.formGroup}>
              <label className={styles.label}>Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as FieldStatus })}
                className={styles.select}
              >
                <option value="healthy">Healthy</option>
                <option value="attention">Needs Attention</option>
                <option value="critical">Critical</option>
              </select>
            </div>
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

          <div className={styles.formGroup}>
            <label className={styles.label}>Soil Type</label>
            <select
              value={formData.soilType}
              onChange={(e) => setFormData({ ...formData, soilType: e.target.value as SoilType })}
              className={styles.select}
            >
              <option value="">Select soil type</option>
              <option value="clay">Clay</option>
              <option value="sandy">Sandy</option>
              <option value="loam">Loam</option>
              <option value="silt">Silt</option>
              <option value="peat">Peat</option>
              <option value="chalk">Chalk</option>
            </select>
          </div>

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

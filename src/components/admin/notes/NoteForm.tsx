import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useUIStore, useFieldsStore, usePlantsStore } from '../../../stores';
import type { Note, NoteType } from '../../../types';
import styles from './NoteForm.module.css';

interface NoteFormProps {
  note?: Note | null;
  onClose: () => void;
}

const noteTypes: { value: NoteType; label: string }[] = [
  { value: 'observation', label: 'Observation' },
  { value: 'watering', label: 'Watering' },
  { value: 'growth', label: 'Growth' },
  { value: 'pest', label: 'Pest Issue' },
  { value: 'disease', label: 'Disease' },
  { value: 'fertilizer', label: 'Fertilizer' },
  { value: 'weather', label: 'Weather' },
  { value: 'work', label: 'Work Done' },
  { value: 'harvest', label: 'Harvest' },
];

export function NoteForm({ note, onClose }: NoteFormProps) {
  const { addNote, updateNote } = useUIStore();
  const { fields } = useFieldsStore();
  const { plants } = usePlantsStore();
  const isEditing = !!note;

  const [formData, setFormData] = useState({
    type: 'observation' as NoteType,
    title: '',
    content: '',
    fieldId: '',
    plantId: '',
    tags: '',
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (note) {
      setFormData({
        type: note.type,
        title: note.title || '',
        content: note.content,
        fieldId: note.fieldId || '',
        plantId: note.plantId || '',
        tags: note.tags.join(', '),
      });
    }
  }, [note]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.content.trim()) {
      setError('Note content is required');
      return;
    }

    const tags = formData.tags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    if (isEditing && note) {
      updateNote(note.id, {
        type: formData.type,
        title: formData.title.trim() || undefined,
        content: formData.content.trim(),
        fieldId: formData.fieldId || undefined,
        plantId: formData.plantId || undefined,
        tags,
      });
    } else {
      const now = new Date().toISOString();
      const newNote: Note = {
        id: `note-${Date.now()}`,
        type: formData.type,
        title: formData.title.trim() || undefined,
        content: formData.content.trim(),
        fieldId: formData.fieldId || undefined,
        plantId: formData.plantId || undefined,
        tags,
        photos: [],
        isPrivate: false,
        createdAt: now,
        updatedAt: now,
      };
      addNote(newNote);
    }

    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{isEditing ? 'Edit Note' : 'Add New Note'}</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as NoteType })}
                className={styles.select}
              >
                {noteTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={styles.input}
                placeholder="Optional title"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Content *</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className={styles.textarea}
              placeholder="Write your note here..."
              rows={5}
            />
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Related Field</label>
              <select
                value={formData.fieldId}
                onChange={(e) => setFormData({ ...formData, fieldId: e.target.value })}
                className={styles.select}
              >
                <option value="">None</option>
                {fields.map((field) => (
                  <option key={field.id} value={field.id}>
                    {field.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Related Plant</label>
              <select
                value={formData.plantId}
                onChange={(e) => setFormData({ ...formData, plantId: e.target.value })}
                className={styles.select}
              >
                <option value="">None</option>
                {plants.map((plant) => (
                  <option key={plant.id} value={plant.id}>
                    {plant.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Tags</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className={styles.input}
              placeholder="Separate tags with commas (e.g., urgent, tomatoes)"
            />
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.submitBtn}>
              {isEditing ? 'Save Changes' : 'Add Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NoteForm;

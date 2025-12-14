import { useState, useEffect } from 'react';
import { X, Droplets, Leaf, Bug, Pill, Sun, Wrench, Eye, Map } from 'lucide-react';
import { useUIStore, useFieldsStore, usePlantsStore } from '../../../stores';
import { Dropdown } from '../../ui';
import type { DropdownOption } from '../../ui';
import type { Note, NoteType } from '../../../types';
import styles from './NoteForm.module.css';

interface NoteFormProps {
  note?: Note | null;
  onClose: () => void;
}

const noteTypeIcons: Record<NoteType, React.ReactNode> = {
  observation: <Eye size={16} />,
  watering: <Droplets size={16} />,
  growth: <Leaf size={16} />,
  pest: <Bug size={16} />,
  disease: <Pill size={16} />,
  fertilizer: <Pill size={16} />,
  weather: <Sun size={16} />,
  work: <Wrench size={16} />,
  harvest: <Leaf size={16} />,
};

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

  // Build dropdown options
  const noteTypeOptions: DropdownOption[] = noteTypes.map((type) => ({
    value: type.value,
    label: type.label,
    icon: noteTypeIcons[type.value],
  }));

  const fieldOptions: DropdownOption[] = [
    { value: '', label: 'None', icon: <Map size={16} /> },
    ...fields.map((field) => ({
      value: field.id,
      label: field.name,
      icon: <Map size={16} />,
    })),
  ];

  const plantOptions: DropdownOption[] = [
    { value: '', label: 'None', icon: <Leaf size={16} /> },
    ...plants.map((plant) => ({
      value: plant.id,
      label: plant.name,
      icon: <Leaf size={16} />,
    })),
  ];

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
            <Dropdown
              label="Type *"
              options={noteTypeOptions}
              value={formData.type}
              onChange={(value) => setFormData({ ...formData, type: value as NoteType })}
              placeholder="Select type"
            />

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
            <Dropdown
              label="Related Field"
              options={fieldOptions}
              value={formData.fieldId}
              onChange={(value) => setFormData({ ...formData, fieldId: value })}
              placeholder="None"
            />

            <Dropdown
              label="Related Plant"
              options={plantOptions}
              value={formData.plantId}
              onChange={(value) => setFormData({ ...formData, plantId: value })}
              placeholder="None"
            />
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

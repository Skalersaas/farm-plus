import { useState } from 'react';
import { format } from 'date-fns';
import { Plus, Search, Droplets, Leaf, Bug, Pill, Sun, Wrench, Eye, PenSquare, FileText } from 'lucide-react';
import { useUIStore, useFieldsStore, usePlantsStore } from '../../../stores';
import { Dropdown } from '../../ui';
import type { DropdownOption } from '../../ui';
import { NoteForm } from './NoteForm';
import type { NoteType, Note } from '../../../types';
import styles from './NotesJournal.module.css';

const noteTypeIcons: Record<NoteType, typeof Droplets> = {
  watering: Droplets,
  growth: Leaf,
  pest: Bug,
  disease: Pill,
  fertilizer: Pill,
  weather: Sun,
  work: Wrench,
  observation: Eye,
  harvest: Leaf,
};

const noteTypeColors: Record<NoteType, string> = {
  watering: '#3b82f6',
  growth: '#22c55e',
  pest: '#ef4444',
  disease: '#f97316',
  fertilizer: '#a855f7',
  weather: '#06b6d4',
  work: '#8b5a2b',
  observation: '#64748b',
  harvest: '#eab308',
};

const noteTypeOptions: DropdownOption[] = [
  { value: '', label: 'All Types', icon: <FileText size={16} /> },
  { value: 'watering', label: 'Watering', icon: <Droplets size={16} /> },
  { value: 'growth', label: 'Growth', icon: <Leaf size={16} /> },
  { value: 'pest', label: 'Pest', icon: <Bug size={16} /> },
  { value: 'disease', label: 'Disease', icon: <Pill size={16} /> },
  { value: 'fertilizer', label: 'Fertilizer', icon: <Pill size={16} /> },
  { value: 'weather', label: 'Weather', icon: <Sun size={16} /> },
  { value: 'work', label: 'Work', icon: <Wrench size={16} /> },
  { value: 'observation', label: 'Observation', icon: <Eye size={16} /> },
  { value: 'harvest', label: 'Harvest', icon: <Leaf size={16} /> },
];

export function NotesJournal() {
  const { notes } = useUIStore();
  const { getFieldById } = useFieldsStore();
  const { getPlantById } = usePlantsStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const filteredNotes = notes
    .filter((note) => {
      const matchesSearch =
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.title?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = !typeFilter || note.type === typeFilter;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleAddClick = () => {
    setEditingNote(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingNote(null);
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
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <Dropdown
            options={noteTypeOptions}
            value={typeFilter}
            onChange={setTypeFilter}
            placeholder="All Types"
          />
        </div>

        <button className={styles.addBtn} onClick={handleAddClick}>
          <Plus size={18} />
          Add Note
        </button>
      </div>

      {/* Notes List */}
      {filteredNotes.length > 0 ? (
        <div className={styles.notesList}>
          {filteredNotes.map((note) => {
            const Icon = noteTypeIcons[note.type];
            const color = noteTypeColors[note.type];
            const field = note.fieldId ? getFieldById(note.fieldId) : null;
            const plant = note.plantId ? getPlantById(note.plantId) : null;

            return (
              <div key={note.id} className={styles.noteCard}>
                <div className={styles.noteHeader}>
                  <div
                    className={styles.noteIcon}
                    style={{ background: `${color}20`, color }}
                  >
                    <Icon size={18} />
                  </div>
                  <div className={styles.noteInfo}>
                    <h3 className={styles.noteTitle}>
                      {note.title || note.type.charAt(0).toUpperCase() + note.type.slice(1)}
                    </h3>
                    <div className={styles.noteMeta}>
                      <span>{format(new Date(note.createdAt), 'MMM d, yyyy h:mm a')}</span>
                      {field && <span>• {field.name}</span>}
                      {plant && <span>• {plant.name}</span>}
                    </div>
                  </div>
                  <span className={styles.noteType} style={{ background: `${color}20`, color }}>
                    {note.type}
                  </span>
                </div>

                <p className={styles.noteContent}>{note.content}</p>

                {note.tags.length > 0 && (
                  <div className={styles.noteTags}>
                    {note.tags.map((tag) => (
                      <span key={tag} className={styles.tag}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles.empty}>
          <PenSquare size={48} className={styles.emptyIcon} />
          <p>No notes found</p>
          <button className={styles.addBtn} onClick={handleAddClick}>
            <Plus size={18} />
            Add Your First Note
          </button>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <NoteForm note={editingNote} onClose={handleCloseForm} />
      )}
    </div>
  );
}

export default NotesJournal;

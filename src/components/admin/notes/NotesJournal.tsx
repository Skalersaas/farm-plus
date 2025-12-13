import { useState } from 'react';
import { format } from 'date-fns';
import { Plus, Search, Droplets, Leaf, Bug, Pill, Sun, Wrench, Eye, PenSquare } from 'lucide-react';
import { useUIStore, useFieldsStore, usePlantsStore } from '../../../stores';
import type { NoteType } from '../../../types';
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

export function NotesJournal() {
  const { notes } = useUIStore();
  const { getFieldById } = useFieldsStore();
  const { getPlantById } = usePlantsStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');

  const filteredNotes = notes
    .filter((note) => {
      const matchesSearch =
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.title?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = !typeFilter || note.type === typeFilter;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

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

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">All Types</option>
            <option value="watering">Watering</option>
            <option value="growth">Growth</option>
            <option value="pest">Pest</option>
            <option value="disease">Disease</option>
            <option value="fertilizer">Fertilizer</option>
            <option value="weather">Weather</option>
            <option value="work">Work</option>
            <option value="observation">Observation</option>
            <option value="harvest">Harvest</option>
          </select>
        </div>

        <button className={styles.addBtn}>
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
          <button className={styles.addBtn}>
            <Plus size={18} />
            Add Your First Note
          </button>
        </div>
      )}
    </div>
  );
}

export default NotesJournal;

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Grid, List, Search, Edit, Trash2, Eye } from 'lucide-react';
import { useFieldsStore } from '../../../stores';
import type { Field } from '../../../types';
import styles from './FieldsList.module.css';

export function FieldsList() {
  const { fields, deleteField } = useFieldsStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFields = fields.filter((field) =>
    field.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: Field['status']) => {
    switch (status) {
      case 'healthy':
        return styles.statusHealthy;
      case 'attention':
        return styles.statusAttention;
      case 'critical':
        return styles.statusCritical;
      default:
        return '';
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.searchBar}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search fields..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.actions}>
          <div className={styles.viewToggle}>
            <button
              className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.active : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid size={18} />
            </button>
            <button
              className={`${styles.viewBtn} ${viewMode === 'list' ? styles.active : ''}`}
              onClick={() => setViewMode('list')}
            >
              <List size={18} />
            </button>
          </div>

          <button className={styles.addBtn}>
            <Plus size={18} />
            Add Field
          </button>
        </div>
      </div>

      {/* Fields Grid/List */}
      {filteredFields.length > 0 ? (
        <div className={viewMode === 'grid' ? styles.grid : styles.list}>
          {filteredFields.map((field) => (
            <div key={field.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>{field.name}</h3>
                <div className={`${styles.status} ${getStatusColor(field.status)}`}>
                  {field.status}
                </div>
              </div>

              <div className={styles.cardContent}>
                <div className={styles.stat}>
                  <span className={styles.statLabel}>Area</span>
                  <span className={styles.statValue}>{field.area} m²</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statLabel}>Zones</span>
                  <span className={styles.statValue}>{field.zones.length}</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statLabel}>Location</span>
                  <span className={styles.statValue}>{field.location || 'Not set'}</span>
                </div>
              </div>

              <div className={styles.cardFooter}>
                <Link to={`/admin/fields/${field.id}`} className={styles.viewBtn}>
                  <Eye size={16} />
                  View
                </Link>
                <button className={styles.iconBtn}>
                  <Edit size={16} />
                </button>
                <button
                  className={`${styles.iconBtn} ${styles.danger}`}
                  onClick={() => deleteField(field.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <p>No fields found. Create your first field to get started!</p>
          <button className={styles.addBtn}>
            <Plus size={18} />
            Add Field
          </button>
        </div>
      )}
    </div>
  );
}

export default FieldsList;

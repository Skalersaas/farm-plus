import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, MapPin, Layers, Leaf } from 'lucide-react';
import { useFieldsStore, usePlantsStore } from '../../../stores';
import styles from './FieldDetail.module.css';

export function FieldDetail() {
  const { id } = useParams<{ id: string }>();
  const { getFieldById } = useFieldsStore();
  const { getPlantsByField } = usePlantsStore();

  const field = id ? getFieldById(id) : undefined;
  const plants = id ? getPlantsByField(id) : [];

  if (!field) {
    return (
      <div className={styles.notFound}>
        <h2>Field not found</h2>
        <Link to="/admin/fields" className={styles.backLink}>
          <ArrowLeft size={18} />
          Back to Fields
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <Link to="/admin/fields" className={styles.backLink}>
          <ArrowLeft size={18} />
          Back to Fields
        </Link>

        <div className={styles.headerContent}>
          <div>
            <h1 className={styles.title}>{field.name}</h1>
            <div className={styles.meta}>
              <span className={styles.metaItem}>
                <MapPin size={14} />
                {field.location || 'Location not set'}
              </span>
              <span className={styles.metaItem}>
                <Layers size={14} />
                {field.area} m²
              </span>
            </div>
          </div>

          <div className={styles.actions}>
            <button className={styles.editBtn}>
              <Edit size={16} />
              Edit
            </button>
            <button className={styles.deleteBtn}>
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className={styles.grid}>
        {/* Info Card */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Field Information</h3>
          <div className={styles.infoList}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Soil Type</span>
              <span className={styles.infoValue}>{field.soilType || 'Not specified'}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Total Zones</span>
              <span className={styles.infoValue}>{field.zones.length}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Plants</span>
              <span className={styles.infoValue}>{plants.length} varieties</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Status</span>
              <span className={`${styles.status} ${styles[field.status]}`}>
                {field.status}
              </span>
            </div>
          </div>
          {field.notes && (
            <div className={styles.notes}>
              <h4>Notes</h4>
              <p>{field.notes}</p>
            </div>
          )}
        </div>

        {/* Zones Card */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Zones</h3>
          {field.zones.length > 0 ? (
            <div className={styles.zonesList}>
              {field.zones.map((zone) => (
                <div key={zone.id} className={styles.zoneItem}>
                  <div className={styles.zoneName}>{zone.name}</div>
                  <div className={styles.zoneInfo}>
                    {zone.area} m² • {zone.soilType || 'Unknown soil'}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              No zones created yet
            </div>
          )}
        </div>

        {/* Plants Card */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Plants in this Field</h3>
          {plants.length > 0 ? (
            <div className={styles.plantsList}>
              {plants.map((plant) => (
                <Link
                  key={plant.id}
                  to={`/admin/plants/${plant.id}`}
                  className={styles.plantItem}
                >
                  <Leaf size={16} />
                  <div className={styles.plantInfo}>
                    <span className={styles.plantName}>{plant.name}</span>
                    <span className={styles.plantQty}>{plant.quantity} plants</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              No plants in this field yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FieldDetail;

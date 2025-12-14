import { Filter, Droplets, AlertCircle, Map, Leaf } from 'lucide-react';
import { Dropdown } from '../../ui';
import type { DropdownOption } from '../../ui';
import type { Field } from '../../../types';
import styles from './MapControls.module.css';

interface MapControlsProps {
  fields: Field[];
  filterField: string;
  filterStatus: string;
  onFieldChange: (fieldId: string) => void;
  onStatusChange: (status: string) => void;
}

const statusLegend = [
  { status: 'watered', label: 'Watered', color: '#22c55e' },
  { status: 'due_soon', label: 'Due Soon', color: '#f59e0b' },
  { status: 'overdue', label: 'Overdue', color: '#f97316' },
  { status: 'critical', label: 'Critical', color: '#ef4444' },
];

export function MapControls({
  fields,
  filterField,
  filterStatus,
  onFieldChange,
  onStatusChange,
}: MapControlsProps) {
  // Build field options
  const fieldOptions: DropdownOption[] = [
    { value: '', label: 'All Fields', icon: <Map size={16} /> },
    ...fields.map((field) => ({
      value: field.id,
      label: field.name,
      icon: <Leaf size={16} />,
    })),
  ];

  // Build status options
  const statusOptions: DropdownOption[] = [
    { value: '', label: 'All Status', icon: <Droplets size={16} /> },
    ...statusLegend.map((item) => ({
      value: item.status,
      label: item.label,
      icon: (
        <span
          style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: item.color,
            display: 'inline-block',
          }}
        />
      ),
    })),
  ];

  return (
    <div className={styles.container}>
      {/* Legend */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <Droplets size={16} />
          Watering Status
        </h3>
        <div className={styles.legend}>
          {statusLegend.map((item) => (
            <div key={item.status} className={styles.legendItem}>
              <span
                className={styles.legendDot}
                style={{ background: item.color }}
              />
              <span className={styles.legendLabel}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <Filter size={16} />
          Filters
        </h3>

        <Dropdown
          label="Field"
          options={fieldOptions}
          value={filterField}
          onChange={onFieldChange}
          placeholder="All Fields"
        />

        <Dropdown
          label="Watering Status"
          options={statusOptions}
          value={filterStatus}
          onChange={onStatusChange}
          placeholder="All Status"
        />
      </div>

      {/* Tips */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <AlertCircle size={16} />
          Tips
        </h3>
        <ul className={styles.tips}>
          <li>Click on a plant to see actions</li>
          <li>Red pulsing plants need urgent watering</li>
          <li>Use zoom controls to adjust view</li>
          <li>Filter by status to find plants that need attention</li>
        </ul>
      </div>
    </div>
  );
}

export default MapControls;

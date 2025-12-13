import { useNavigate } from 'react-router-dom';
import { Droplets, FileText, Map, Leaf } from 'lucide-react';
import { useUIStore } from '../../../stores';
import styles from './QuickActions.module.css';

const actions = [
  { icon: Map, label: 'Add Field', action: 'add-field' },
  { icon: Leaf, label: 'Add Plant', action: 'add-plant' },
  { icon: Droplets, label: 'Mark Watering', action: 'mark-watering' },
  { icon: FileText, label: 'Add Note', action: 'add-note' },
];

export function QuickActions() {
  const navigate = useNavigate();
  const { openModal } = useUIStore();

  const handleAction = (action: string) => {
    switch (action) {
      case 'add-field':
        navigate('/admin/fields');
        openModal('field-form');
        break;
      case 'add-plant':
        navigate('/admin/plants');
        openModal('plant-form');
        break;
      case 'mark-watering':
        navigate('/admin/plants');
        openModal('watering');
        break;
      case 'add-note':
        navigate('/admin/notes');
        openModal('note-form');
        break;
    }
  };

  return (
    <div className={styles.widget}>
      <h3 className={styles.title}>Quick Actions</h3>
      <div className={styles.grid}>
        {actions.map((action) => (
          <button
            key={action.action}
            className={styles.actionBtn}
            onClick={() => handleAction(action.action)}
          >
            <div className={styles.actionIcon}>
              <action.icon size={18} />
            </div>
            <span className={styles.actionLabel}>{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuickActions;

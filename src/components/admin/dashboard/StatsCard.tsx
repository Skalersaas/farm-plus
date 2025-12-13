import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import styles from './StatsCard.module.css';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatsCard({
  label,
  value,
  icon: Icon,
  variant = 'primary',
  trend,
}: StatsCardProps) {
  return (
    <div className={styles.card}>
      <div className={`${styles.iconWrapper} ${styles[variant]}`}>
        <Icon size={24} />
      </div>
      <div className={styles.content}>
        <div className={styles.label}>{label}</div>
        <div className={styles.value}>{value}</div>
        {trend && (
          <div className={`${styles.trend} ${trend.isPositive ? styles.up : styles.down}`}>
            {trend.isPositive ? (
              <TrendingUp className={styles.trendIcon} />
            ) : (
              <TrendingDown className={styles.trendIcon} />
            )}
            <span>{trend.value}% from last week</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default StatsCard;

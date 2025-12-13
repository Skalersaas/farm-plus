import type { ReactNode } from 'react';
import { useScrollBlur } from '../../hooks';
import styles from './GlassPanel.module.css';

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  maxBlur?: number;
}

export function GlassPanel({ children, className = '', maxBlur = 20 }: GlassPanelProps) {
  const { ref, blur, opacity } = useScrollBlur(maxBlur);

  return (
    <div
      ref={ref}
      className={`${styles.panel} ${className}`}
      style={{
        background: `rgba(255, 255, 255, ${opacity})`,
        backdropFilter: `blur(${blur}px)`,
        WebkitBackdropFilter: `blur(${blur}px)`,
      }}
    >
      {children}
    </div>
  );
}

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useScrollBlur } from '../../hooks';
import styles from './Card.module.css';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export function Card({ children, className = '', onClick, hoverable = true }: CardProps) {
  const { ref, blur, opacity } = useScrollBlur(16);

  return (
    <motion.div
      ref={ref}
      className={`${styles.card} ${hoverable ? styles.hoverable : ''} ${className}`}
      onClick={onClick}
      whileHover={hoverable ? { scale: 1.02, y: -4 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      style={{
        background: `rgba(255, 255, 255, ${opacity})`,
        backdropFilter: `blur(${blur}px)`,
        WebkitBackdropFilter: `blur(${blur}px)`,
      }}
    >
      {children}
    </motion.div>
  );
}

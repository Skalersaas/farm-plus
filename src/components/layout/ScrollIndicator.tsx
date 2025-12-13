import { motion } from 'framer-motion';
import styles from './ScrollIndicator.module.css';

interface ScrollIndicatorProps {
  targetSection: string;
}

export function ScrollIndicator({ targetSection }: ScrollIndicatorProps) {
  const handleClick = () => {
    const element = document.querySelector(targetSection);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.button
      className={styles.indicator}
      onClick={handleClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.6 }}
      aria-label="Scroll to next section"
    >
      <motion.div
        className={styles.circle}
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </motion.div>
    </motion.button>
  );
}

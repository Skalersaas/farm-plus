import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollBlur } from '../../hooks';
import styles from './Accordion.module.css';

interface AccordionItem {
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
}

function AccordionItemComponent({
  item,
  isOpen,
  onToggle
}: {
  item: AccordionItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const { ref, blur, opacity } = useScrollBlur(12);

  return (
    <div
      ref={ref}
      className={styles.item}
      style={{
        background: `rgba(255, 255, 255, ${opacity})`,
        backdropFilter: `blur(${blur}px)`,
        WebkitBackdropFilter: `blur(${blur}px)`,
      }}
    >
      <button
        className={`${styles.trigger} ${isOpen ? styles.active : ''}`}
        onClick={onToggle}
      >
        <span>{item.question}</span>
        <motion.span
          className={styles.icon}
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronIcon />
        </motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.content}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <p className={styles.answer}>{item.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Accordion({ items }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={styles.accordion}>
      {items.map((item, index) => (
        <AccordionItemComponent
          key={index}
          item={item}
          isOpen={openIndex === index}
          onToggle={() => toggleItem(index)}
        />
      ))}
    </div>
  );
}

function ChevronIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6,9 12,15 18,9" />
    </svg>
  );
}

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './InfoSection.module.css';

interface InfoItem {
  id: string;
  title: string;
  content: string;
}

const infoItems: InfoItem[] = [
  {
    id: 'services',
    title: 'Our services',
    content: 'Farm+ provides comprehensive digital tools for modern farmers: crop management and tracking, smart watering schedules, field mapping, health monitoring, weather integration, and detailed analytics. Our platform helps you optimize yields while reducing resource waste.',
  },
  {
    id: 'goals',
    title: 'Our goals',
    content: 'We aim to revolutionize agriculture through technology. Our mission is to make farming more efficient, sustainable, and profitable. By 2025, we plan to help farmers reduce water usage by 30% and increase crop yields by 25% through data-driven insights.',
  },
  {
    id: 'about',
    title: 'About us',
    content: 'Farm+ was founded by a team of agricultural experts and software engineers passionate about sustainable farming. Based in Azerbaijan, we combine local farming knowledge with cutting-edge technology to serve farmers worldwide.',
  },
];

export function InfoSection() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section id="info" className={`section ${styles.info}`}>
      <div className={styles.container}>
        {infoItems.map((item) => (
          <div key={item.id} className={styles.item}>
            <button
              className={styles.header}
              onClick={() => toggleExpand(item.id)}
            >
              <h2 className={styles.title}>{item.title}</h2>
              <motion.span
                className={styles.icon}
                animate={{ rotate: expandedId === item.id ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown />
              </motion.span>
            </button>
            <AnimatePresence>
              {expandedId === item.id && (
                <motion.div
                  className={styles.content}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className={styles.text}>{item.content}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}

function ChevronDown() {
  return (
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
      <polyline points="6,9 12,15 18,9" />
    </svg>
  );
}

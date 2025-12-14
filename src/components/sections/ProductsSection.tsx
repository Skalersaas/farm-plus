import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ProductsSection.module.css';

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
    content: 'We aim to revolutionize agriculture through technology. Our mission is to make farming more efficient, sustainable, and profitable. We help farmers reduce water usage by 30% and increase crop yields by 25% through data-driven insights.',
  },
  {
    id: 'about',
    title: 'About us',
    content: 'Farm+ was founded by a team of agricultural experts and software engineers passionate about sustainable farming. Based in Azerbaijan, we combine local farming knowledge with cutting-edge technology to serve farmers worldwide.',
  },
];

export function ProductsSection() {
  const [selectedId, setSelectedId] = useState<string>('services');

  const selectedItem = infoItems.find((item) => item.id === selectedId);

  return (
    <section id="products" className={`section ${styles.products}`}>
      <div className={styles.container}>
        {/* Left side - buttons */}
        <div className={styles.buttons}>
          {infoItems.map((item) => (
            <button
              key={item.id}
              className={`${styles.button} ${selectedId === item.id ? styles.active : ''}`}
              onClick={() => setSelectedId(item.id)}
            >
              <span className={styles.buttonTitle}>{item.title}</span>
            </button>
          ))}
        </div>

        {/* Right side - content */}
        <div className={styles.content}>
          <AnimatePresence mode="wait">
            {selectedItem && (
              <motion.div
                key={selectedItem.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className={styles.contentInner}
              >
                <h2 className={styles.contentTitle}>{selectedItem.title}</h2>
                <p className={styles.contentText}>{selectedItem.content}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

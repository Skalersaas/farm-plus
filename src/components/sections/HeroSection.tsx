import { ScrollIndicator } from '../layout';
import styles from './HeroSection.module.css';

export function HeroSection() {
  return (
    <section id="home" className={`section ${styles.hero}`}>
      <div className={styles.content}>
        <h1 className={styles.title}>FARM+</h1>
        <p className={styles.tagline}>INVESTING IN GREEN FUTURE</p>
      </div>

      <ScrollIndicator targetSection="#products" />
    </section>
  );
}

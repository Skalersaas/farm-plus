import { Card } from '../ui';
import styles from './ProductsSection.module.css';

const products = [
  { id: 1, name: 'PLANTS', description: 'Explore our diverse collection of sustainable plants' },
  { id: 2, name: 'FIELDS', description: 'Discover agricultural field investment opportunities' },
  { id: 3, name: 'WATERING', description: 'Smart irrigation and watering solutions' },
];

export function ProductsSection() {
  return (
    <section id="products" className={`section ${styles.products}`}>
      <div className={styles.content}>
        <div className={styles.cards}>
          {products.map((product) => (
            <Card key={product.id} className={styles.card}>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{product.name}</h3>
                <ChevronRight />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function ChevronRight() {
  return (
    <svg
      className={styles.chevron}
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9,6 15,12 9,18" />
    </svg>
  );
}

import { Accordion } from '../ui';
import styles from './FAQSection.module.css';

const faqItems = [
  {
    question: 'What is FARM+ and how does it work?',
    answer: 'FARM+ is a sustainable agriculture investment platform that connects investors with green farming initiatives. We provide opportunities to invest in plants, fields, and modern watering solutions while promoting environmental sustainability.',
  },
  {
    question: 'How can I start investing?',
    answer: 'Getting started is simple! Create an account, browse our available investment opportunities, and choose the projects that align with your values and financial goals. Our platform guides you through every step of the process.',
  },
  {
    question: 'What types of investments are available?',
    answer: 'We offer three main categories: Plants (sustainable plant cultivation), Fields (agricultural land investments), and Watering (smart irrigation technology). Each category offers various projects with different investment levels and returns.',
  },
  {
    question: 'Is my investment secure?',
    answer: 'We prioritize the security of your investments through rigorous project vetting, diversification options, and transparent reporting. All projects undergo thorough due diligence before being listed on our platform.',
  },
  {
    question: 'How do I contact support?',
    answer: 'You can reach our support team through the Contact Us form on our website, or email us directly. We typically respond within 24 hours on business days.',
  },
];

export function FAQSection() {
  return (
    <section id="faq" className={`section ${styles.faq}`}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h2 className={styles.title}>Frequently Asked Questions</h2>
          <p className={styles.subtitle}>
            Find answers to common questions about FARM+
          </p>
        </div>

        <Accordion items={faqItems} />
      </div>
    </section>
  );
}

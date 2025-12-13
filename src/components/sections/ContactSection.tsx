import { useState } from 'react';
import { Button, Input, GlassPanel } from '../ui';
import styles from './ContactSection.module.css';

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" className={`section ${styles.contact}`}>
      <div className={styles.content}>
        <GlassPanel className={styles.formWrapper}>
          <h2 className={styles.title}>Contact Us</h2>
          <p className={styles.subtitle}>
            Have questions? We'd love to hear from you.
          </p>

          <form className={styles.form} onSubmit={handleSubmit}>
            <Input
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <Input
              name="email"
              type="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <div className={styles.textareaWrapper}>
              <textarea
                name="message"
                className={styles.textarea}
                placeholder="Your Message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>
            <Button type="submit" variant="filled" size="lg" fullWidth>
              Send Message
            </Button>
          </form>
        </GlassPanel>
      </div>
    </section>
  );
}

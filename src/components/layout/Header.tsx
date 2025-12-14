import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui';
import styles from './Header.module.css';

interface HeaderProps {
  onLoginClick: () => void;
  onSignUpClick: () => void;
}

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Products', href: '#products' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact us', href: '#contact' },
];

export function Header({ onLoginClick, onSignUpClick }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <a href="#home" className={styles.logo}>
          <img src="/logo.png" alt="Farm+" className={styles.logoImg} />
        </a>

        {/* Desktop Navigation */}
        <nav className={styles.nav}>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={styles.navLink}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(link.href);
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className={styles.authButtons}>
          <Button variant="outlined" size="sm" onClick={onLoginClick}>
            Log in
          </Button>
          <Button variant="filled" size="sm" onClick={onSignUpClick}>
            Sign up
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className={styles.mobileMenuBtn}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`${styles.hamburger} ${isMobileMenuOpen ? styles.open : ''}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className={styles.mobileMenu}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav className={styles.mobileNav}>
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={styles.mobileNavLink}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className={styles.mobileAuthButtons}>
              <Button variant="outlined" fullWidth onClick={() => { setIsMobileMenuOpen(false); onLoginClick(); }}>
                Log in
              </Button>
              <Button variant="filled" fullWidth onClick={() => { setIsMobileMenuOpen(false); onSignUpClick(); }}>
                Sign up
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

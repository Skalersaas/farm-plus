import { useState } from 'react';
import { Header } from '../components/layout';
import { HeroSection, ProductsSection, ContactSection, FAQSection } from '../components/sections';
import { AuthModal, LoginForm, SignUpForm } from '../components/auth';

type AuthModalType = 'login' | 'signup' | null;

export function LandingPage() {
  const [authModal, setAuthModal] = useState<AuthModalType>(null);

  const openLogin = () => setAuthModal('login');
  const openSignUp = () => setAuthModal('signup');
  const closeModal = () => setAuthModal(null);

  return (
    <div className="app-wrapper">
      {/* Fixed background that stays constant */}
      <div className="fixed-background" />

      <Header onLoginClick={openLogin} onSignUpClick={openSignUp} />

      <main className="scroll-container">
        <HeroSection />
        <ProductsSection />
        <FAQSection />
        <ContactSection />
      </main>

      <AuthModal isOpen={authModal !== null} onClose={closeModal}>
        {authModal === 'login' && (
          <LoginForm onSwitchToSignUp={openSignUp} onClose={closeModal} />
        )}
        {authModal === 'signup' && (
          <SignUpForm onSwitchToLogin={openLogin} />
        )}
      </AuthModal>
    </div>
  );
}

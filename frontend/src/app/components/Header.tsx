'use client';

import { useState } from 'react';
import Link from 'next/link';
import LoginModal from './LoginModal';

export default function Header() {
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  return (
    <>
      <header className="header">
        <div className="container">
          <div className="header-content">
            {/* Logo */}
            <Link href="/" className="logo">
              <div className="logo-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
              </div>
              <span className="logo-text">TestGenie</span>
            </Link>

            {/* Navigation */}
            <nav className="nav">
              <Link href="#features" className="nav-link">Features</Link>
              <Link href="#how-it-works" className="nav-link">How It Works</Link>
              <Link href="#pricing" className="nav-link">Pricing</Link>
              <Link href="#testimonials" className="nav-link">Testimonials</Link>
              <Link href="#faqs" className="nav-link">FAQs</Link>
              <Link href="#contact" className="nav-link">Contact</Link>              
            </nav>

            {/* Auth Buttons */}
            <div className="auth-buttons">
              <button 
                className="btn btn-outline"
                onClick={handleLoginClick}
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
}
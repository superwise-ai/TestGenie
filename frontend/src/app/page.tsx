'use client';

import { useEffect } from 'react';
import Header from './components/Header';

export default function LandingPage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fadeInUp');
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe all sections
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  // Pricing toggle and FAQ functionality
  useEffect(() => {
    // Pricing toggle functionality
    const toggle = document.getElementById('pricing-toggle') as HTMLInputElement;
    const monthlyLabel = document.getElementById('monthly-label');
    const annualLabel = document.getElementById('annual-label');
    const priceAmounts = document.querySelectorAll('.price-amount');
    const pricePeriods = document.querySelectorAll('.price-period');
    
    function updatePricing() {
      if (!toggle) return;
      const isAnnual = toggle.checked;
      
      priceAmounts.forEach(amount => {
        const monthlyPrice = amount.getAttribute('data-monthly');
        const annualPrice = amount.getAttribute('data-annual');
        if (amount) {
          amount.textContent = isAnnual ? annualPrice : monthlyPrice;
        }
      });
      
      pricePeriods.forEach(period => {
        const monthlyPeriod = period.getAttribute('data-monthly');
        const annualPeriod = period.getAttribute('data-annual');
        if (period) {
          period.textContent = isAnnual ? annualPeriod : monthlyPeriod;
        }
      });
      
      // Update label styles
      if (isAnnual) {
        monthlyLabel?.classList.remove('active');
        annualLabel?.classList.add('active');
      } else {
        monthlyLabel?.classList.add('active');
        annualLabel?.classList.remove('active');
      }
    }
    
    if (toggle) {
      toggle.addEventListener('change', updatePricing);
      
      // Initialize with monthly pricing
      priceAmounts.forEach(amount => {
        const monthlyPrice = amount.getAttribute('data-monthly');
        if (amount) {
          amount.textContent = monthlyPrice;
        }
      });
      
      pricePeriods.forEach(period => {
        const monthlyPeriod = period.getAttribute('data-monthly');
        if (period) {
          period.textContent = monthlyPeriod;
        }
      });
    }
    
    // FAQ toggle functionality
    const faqItems = document.querySelectorAll('.faq-item-modern');
    const faqHandlers: Array<{ element: Element; handler: () => void }> = [];
    
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question-modern');
      
      if (question) {
        const handler = () => {
          const isActive = item.classList.contains('active');
          
          // Close all other FAQ items
          faqItems.forEach(otherItem => {
            if (otherItem !== item) {
              otherItem.classList.remove('active');
            }
          });
          
          // Toggle current item
          if (isActive) {
            item.classList.remove('active');
          } else {
            item.classList.add('active');
          }
        };
        
        question.addEventListener('click', handler);
        faqHandlers.push({ element: question, handler });
      }
    });

    return () => {
      if (toggle) {
        toggle.removeEventListener('change', updatePricing);
      }
      faqHandlers.forEach(({ element, handler }) => {
        element.removeEventListener('click', handler);
      });
    };
  }, []);

  return (
    <div className="landing-page">
      <Header />
      
      {/* Hero Section - Redesigned */}
      <section id="hero" className="hero">
        <div className="hero-background">
          <div className="hero-pattern"></div>
          <div className="hero-gradient"></div>
          <div className="hero-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
        </div>
        
        <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-badge">
              <span className="badge-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
              </span>
                <span>AI-Powered Testing Revolution</span>
                <div className="badge-pulse"></div>
        </div>
        
            <h1 className="hero-title">
                <span className="title-line">Transform Your Testing</span>
                <span className="title-line">
                  <span className="title-highlight">10x Faster</span>
                  <span className="title-main">with AI</span>
                </span>
                <span className="title-line">No Code Required</span>
              </h1>
              
            <div className="hero-description">
                <p>TestGenie revolutionizes web testing with AI-powered automation. Create, run, and maintain comprehensive test suites using natural language – no coding skills needed.</p>
              </div>

              <div className="hero-cta">
                <a href="#" className="btn btn-primary hero-btn-primary">
                  <span>Start Free Trial</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14m-7-7l7 7-7 7"/>
                  </svg>
                </a>
                <a href="#features" className="btn btn-outline hero-btn-secondary">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="5,3 19,12 5,21"/>
                  </svg>
                  <span>Watch Demo</span>
                </a>
            </div>
              </div>

          <div className="hero-visual">
              <div className="hero-demo">
                <div className="demo-header">
                  <div className="demo-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <div className="demo-title">TestGenie AI Assistant</div>
                  </div>
                
                <div className="demo-content">
                  <div className="demo-chat">
                    <div className="chat-message user-message">
                      <div className="message-avatar">U</div>
                      <div className="message-text">"Test user login with email and password"</div>
                </div>
                    
                    <div className="chat-message ai-message">
                      <div className="message-avatar ai">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                          <circle cx="12" cy="16" r="1"/>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                        </svg>
                </div>
                      <div className="message-content">
                        <div className="ai-typing">
                          <span>Generating test cases</span>
                          <div className="typing-dots">
                            <span></span>
                            <span></span>
                            <span></span>
                </div>
              </div>
                </div>
                    </div>
                  </div>
                  
                  <div className="demo-results">
                    <div className="result-item">
                      <div className="result-icon">✓</div>
                      <div className="result-text">Verify login form validation</div>
                    </div>
                    <div className="result-item">
                      <div className="result-icon">✓</div>
                      <div className="result-text">Test successful login flow</div>
                    </div>
                    <div className="result-item">
                      <div className="result-icon">✓</div>
                      <div className="result-text">Check error handling</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="hero-floating-elements">
                <div className="floating-card card-1">
                  <div className="card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="13,2 3,14 12,14 11,22 21,10 12,10"/>
                    </svg>
                  </div>
                  <div className="card-text">10x Faster</div>
                </div>
                <div className="floating-card card-2">
                  <div className="card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M2 12h20"/>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                    </svg>
                  </div>
                  <div className="card-text">3000+ Browsers</div>
                </div>
                <div className="floating-card card-3">
                  <div className="card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                      <path d="M2 17l10 5 10-5"/>
                      <path d="M2 12l10 5 10-5"/>
                    </svg>
                  </div>
                  <div className="card-text">AI Powered</div>
                </div>
              </div>
                    </div>
                  </div>
                  </div>
      </section>

      {/* Trust Section - Below Hero */}
      <section id="trust-hero" className="trust-hero-section">
        <div className="container">
          <div className="trust-hero-content">
            <h2 className="trust-hero-title">Trusted by Leading Quality Engineering Teams Worldwide</h2>
            <p className="trust-hero-description">An Agentic Test Automation Platform for the Entire Testing Lifecycle</p>
            <div className="trust-hero-stats">
              <div className="trust-hero-stat">
                <div className="stat-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="13,2 3,14 12,14 11,22 21,10 12,10"/>
                  </svg>
                    </div>
                <div className="stat-label">The Generator</div>
                <div className="stat-description">Instant Test Generation</div>
                    </div>
              <div className="trust-hero-stat">
                <div className="stat-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                  </svg>
                    </div>
                <div className="stat-label">The Runner</div>
                <div className="stat-description">10x Faster Execution</div>
              </div>
              <div className="trust-hero-stat">
                <div className="stat-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <circle cx="12" cy="12" r="6"/>
                    <circle cx="12" cy="12" r="2"/>
                  </svg>
            </div>
                <div className="stat-label">The Analyzer</div>
                <div className="stat-description">Instantly Spot Root Causes</div>
              </div>
              <div className="trust-hero-stat">
                <div className="stat-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-3.77 3.77a1 1 0 0 1-1.4 0l-1.6-1.6a1 1 0 0 1 0-1.4l3.77-3.77a6 6 0 0 1 7.94-7.94l3.77 3.77z"/>
                  </svg>
                </div>
                <div className="stat-label">The Optimizer</div>
                <div className="stat-description">100% Test Coverage</div>
              </div>
              <div className="trust-hero-stat">
                <div className="stat-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                  </svg>
                </div>
                <div className="stat-label">The Healer</div>
                <div className="stat-description">90% Less Maintenance</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose TestGenie Section - Redesigned */}
      <section id="features" className="features-section">
        <div className="container">
          <div className="features-header">
            <div className="features-badge">
              <span className="badge-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                </svg>
              </span>
              <span>Why Choose Us</span>
            </div>
            <h2 className="features-title">Why Choose TestGenie?</h2>
            <p className="features-subtitle">Join thousands of teams who have transformed their testing workflow with our AI-powered platform</p>
          </div>
          
          <div className="features-showcase">
              <div className="ai-demo-showcase">
                <div className="demo-header">
                  <div className="header-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                    </svg>
                  </div>
                  <h4>Experience AI Magic</h4>
                  <p>See how our AI transforms your words into comprehensive test cases in seconds</p>
                </div>
                
                <div className="demo-layout">
                  <div className="features-sidebar">
                    <h5>AI Capabilities</h5>
                    <div className="capability-list">
                      <div className="capability-item">
                        <div className="capability-icon">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1 .34-1.72l.52-1.05a3 3 0 0 0 .34-1.72V4.5A2.5 2.5 0 0 1 9.5 2Z"/>
                            <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0-.34-1.72l-.52-1.05a3 3 0 0 1-.34-1.72V4.5A2.5 2.5 0 0 0 14.5 2Z"/>
                          </svg>
                        </div>
                        <span>Natural language processing</span>
                      </div>
                      <div className="capability-item">
                        <div className="capability-icon">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                          </svg>
                        </div>
                        <span>Smart test case generation</span>
                      </div>
                      <div className="capability-item">
                        <div className="capability-icon">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <circle cx="12" cy="12" r="6"/>
                            <circle cx="12" cy="12" r="2"/>
                          </svg>
                        </div>
                        <span>Edge case detection</span>
                      </div>
                      <div className="capability-item">
                        <div className="capability-icon">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 12l2 2 4-4"/>
                            <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
                            <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"/>
                          </svg>
                        </div>
                        <span>Instant test validation</span>
                      </div>
                      <div className="capability-item">
                        <div className="capability-icon">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
                          </svg>
                        </div>
                        <span>Real-time bug reporting</span>
                      </div>
                      <div className="capability-item">
                        <div className="capability-icon">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                          </svg>
                        </div>
                        <span>Self-healing tests</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="chat-agent">
                    <div className="chat-header">
                      <div className="agent-info">
                        <div className="agent-avatar">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                            <circle cx="12" cy="16" r="1"/>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                          </svg>
                        </div>
                        <div className="agent-details">
                          <h6>TestGenie AI Assistant</h6>
                          <span className="agent-status">
                            <div className="status-dot"></div>
                            Online
                          </span>
                        </div>
                      </div>
                      <div className="chat-actions">
                        <button className="action-btn">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="3"/>
                            <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <div className="chat-messages">
                      <div className="message user-message">
                        <div className="message-avatar">U</div>
                        <div className="message-content">
                          <div className="message-text">"Test user login with email and password"</div>
                          <div className="message-time">2:30 PM</div>
                        </div>
                      </div>
                      
                      <div className="message ai-message">
                        <div className="message-avatar ai">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                            <circle cx="12" cy="16" r="1"/>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                          </svg>
                        </div>
                        <div className="message-content">
                          <div className="ai-response">
                            <div className="response-header">
                              <span className="response-title">Generating test cases...</span>
                              <div className="loading-dots">
                                <span></span>
                                <span></span>
                                <span></span>
                              </div>
                            </div>
                            <div className="generated-tests">
                              <div className="test-item">
                                <span className="test-icon">
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M9 12l2 2 4-4"/>
                                    <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
                                    <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"/>
                                  </svg>
                                </span>
                                <span className="test-text">Verify login form validation</span>
                              </div>
                              <div className="test-item">
                                <span className="test-icon">
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M9 12l2 2 4-4"/>
                                    <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
                                    <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"/>
                                  </svg>
                                </span>
                                <span className="test-text">Test successful login flow</span>
                              </div>
                              <div className="test-item">
                                <span className="test-icon">
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M9 12l2 2 4-4"/>
                                    <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
                                    <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"/>
                                  </svg>
                                </span>
                                <span className="test-text">Check error handling</span>
                              </div>
                            </div>
                          </div>
                          <div className="message-time">2:30 PM</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="chat-input">
                      <div className="input-container">
                        <input type="text" placeholder="Describe what you want to test..." />
                        <button className="send-btn">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          </div>
          
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 12l2 2 4-4"/>
                    <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
                    <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"/>
                  </svg>
              </div>
                <h3>Smart Test Generation</h3>
                <p>AI-powered test case creation with intelligent analysis and comprehensive coverage.</p>
                <div className="feature-stats">
                  <span className="stat">95% Accuracy</span>
              </div>
            </div>
            
              <div className="feature-card">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                    <line x1="8" y1="21" x2="16" y2="21"/>
                    <line x1="12" y1="17" x2="12" y2="21"/>
                  </svg>
              </div>
                <h3>Cross-Browser Testing</h3>
                <p>Test across 3000+ browser and device combinations for complete coverage.</p>
                <div className="feature-stats">
                  <span className="stat">3000+ Browsers</span>
              </div>
            </div>
            
              <div className="feature-card">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                  </svg>
              </div>
                <h3>Lightning Fast Execution</h3>
                <p>Parallel test execution across multiple browsers for maximum efficiency.</p>
                <div className="feature-stats">
                  <span className="stat">10x Faster</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section - Redesigned */}
      <section id="how-it-works" className="how-it-works-section">
        <div className="container">
          <div className="how-it-works-header">
            <div className="how-it-works-badge">
              <span className="badge-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
                  <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
                  <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
                  <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
                    </svg>
              </span>
              <span>Simple Process</span>
                </div>
            <h2 className="how-it-works-title">How TestGenie Works</h2>
            <p className="how-it-works-subtitle">Transform your testing workflow in 4 powerful steps - from idea to insights in minutes</p>
                  </div>
            
          <div className="workflow-showcase">
            <div className="workflow-steps">
              <div className="workflow-step-card">
                <div className="step-header">
                  <div className="step-number-badge">01</div>
                  </div>
                <div className="step-content">
                  <h3>Describe Your Test Scenario</h3>
                  <p>Simply tell our AI chatbot what you want to test using natural language. No technical jargon or complex syntax required.</p>
                  <div className="step-features">
                    <div className="feature-tag">Natural Language</div>
                    <div className="feature-tag">No Coding</div>
                    <div className="feature-tag">Instant Understanding</div>
                  </div>
                </div>
                <div className="step-demo">
                  <div className="demo-chat">
                    <div className="chat-bubble user-bubble">
                      <span>"Test user login with email and password"</span>
              </div>
                    <div className="chat-bubble ai-bubble">
                      <span>Got it! I'll create comprehensive test cases for login functionality.</span>
                  </div>
              </div>
            </div>
          </div>

              <div className="workflow-step-card">
                <div className="step-header">
                  <div className="step-number-badge">02</div>
        </div>
                <div className="step-content">
                  <h3>AI Generates Test Cases</h3>
                  <p>Our advanced AI analyzes your requirements and creates comprehensive test cases with edge cases and validation scenarios.</p>
                  <div className="step-features">
                    <div className="feature-tag">Smart Analysis</div>
                    <div className="feature-tag">Edge Cases</div>
                    <div className="feature-tag">Comprehensive Coverage</div>
                  </div>
                </div>
                <div className="step-demo">
                  <div className="demo-test-generation">
                    <div className="generating-header">
                      <div className="loading-spinner"></div>
                      <span>AI is generating test cases...</span>
              </div>
                    <div className="generated-tests-preview">
                      <div className="test-item-preview">
                        <div className="test-icon">✓</div>
                        <span>Verify login form validation</span>
                  </div>
                      <div className="test-item-preview">
                        <div className="test-icon">✓</div>
                        <span>Test successful login flow</span>
              </div>
                      <div className="test-item-preview">
                        <div className="test-icon">✓</div>
                        <span>Check error handling</span>
                  </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="workflow-step-card">
                <div className="step-header">
                  <div className="step-number-badge">03</div>
                </div>
                <div className="step-content">
                  <h3>Execute Across All Browsers</h3>
                  <p>Tests run simultaneously across 3000+ browser and device combinations, giving you comprehensive coverage in minutes.</p>
                  <div className="step-features">
                    <div className="feature-tag">3000+ Browsers</div>
                    <div className="feature-tag">Parallel Execution</div>
                    <div className="feature-tag">Real Devices</div>
                  </div>
                </div>
                <div className="step-demo">
                  <div className="demo-browsers">
                    <div className="browser-card chrome">
                      <div className="browser-logo">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                          <path d="M2 12h20"/>
                          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                        </svg>
              </div>
                      <span>Chrome</span>
              </div>
                    <div className="browser-card firefox">
                      <div className="browser-logo">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
                          <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
                    </svg>
                  </div>
                      <span>Firefox</span>
              </div>
                    <div className="browser-card safari">
                      <div className="browser-logo">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                          <path d="M2 17l10 5 10-5"/>
                          <path d="M2 12l10 5 10-5"/>
                        </svg>
            </div>
                      <span>Safari</span>
                  </div>
                    <div className="browser-card edge">
                      <div className="browser-logo">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                          <polyline points="3.27,6.96 12,12.01 20.73,6.96"/>
                          <line x1="12" y1="22.08" x2="12" y2="12"/>
                        </svg>
                      </div>
                      <span>Edge</span>
            </div>
                  </div>
                </div>
              </div>

              <div className="workflow-step-card">
                <div className="step-header">
                  <div className="step-number-badge">04</div>
                </div>
                <div className="step-content">
                  <h3>Get Detailed Reports & Insights</h3>
                  <p>Receive comprehensive reports with screenshots, videos, logs, and smart suggestions to fix issues quickly.</p>
                  <div className="step-features">
                    <div className="feature-tag">Visual Reports</div>
                    <div className="feature-tag">Smart Insights</div>
                    <div className="feature-tag">Actionable Fixes</div>
                  </div>
                </div>
                <div className="step-demo">
                  <div className="demo-results">
                    <div className="results-header">Test Results Dashboard</div>
                    <div className="results-stats">
                      <div className="stat-card passed">
                        <div className="stat-icon">✅</div>
                        <div className="stat-value">12</div>
                        <div className="stat-label">Passed</div>
              </div>
                      <div className="stat-card failed">
                        <div className="stat-icon">❌</div>
                        <div className="stat-value">2</div>
                        <div className="stat-label">Failed</div>
            </div>
                      <div className="stat-card duration">
                        <div className="stat-icon">⏱️</div>
                        <div className="stat-value">2.3s</div>
                        <div className="stat-label">Duration</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Trust Section */}
            <section id="trust" className="trust-section">
              <div className="container">
                <div className="trust-content">
                  <h2 className="trust-title">Ready to Transform Your Testing?</h2>
                  <p className="trust-subtitle">Join thousands of teams already using TestGenie to automate their testing workflow</p>
                  <div className="trust-cta">
                    <a href="#" className="trust-btn-primary">Start Free Trial</a>
                    <a href="#features" className="trust-btn-secondary">Watch Demo</a>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>


      {/* Pricing Section - Redesigned */}
      <section id="pricing" className="pricing-section">
        <div className="container">
          <div className="pricing-header">
            <div className="pricing-badge">
              <span className="badge-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23"/>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              </span>
              <span>Simple Pricing</span>
            </div>
            <h2 className="pricing-title">Simple & Transparent Pricing</h2>
            <p className="pricing-subtitle">Choose the perfect plan for your team. Start free and scale as you grow.</p>
                    </div>
          
          <div className="pricing-toggle">
            <span className="toggle-label active" id="monthly-label">Monthly</span>
            <div className="toggle-switch">
              <input type="checkbox" id="pricing-toggle" />
              <label htmlFor="pricing-toggle"></label>
            </div>
            <span className="toggle-label" id="annual-label">Yearly <span className="discount-badge">Save 20%</span></span>
          </div>
          
          <div className="pricing-grid">
            <div className="pricing-card">
              <div className="pricing-header">
                <div className="pricing-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <h3 className="pricing-title">Starter</h3>
                <div className="pricing-price">
                  <span className="price-amount" data-monthly="$0" data-annual="$0">$0</span>
                  <span className="price-period" data-monthly="/month" data-annual="/year">/month</span>
            </div>
                <p className="pricing-description">Perfect for individuals getting started</p>
              </div>
              <ul className="pricing-features">
                <li><span className="pricing-feature-icon">✓</span> 100 test executions</li>
                <li><span className="pricing-feature-icon">✓</span> 1000 steps</li>
                <li><span className="pricing-feature-icon">✓</span> 1 project</li>
                <li><span className="pricing-feature-icon">✓</span> Basic reporting</li>
                <li><span className="pricing-feature-icon">✓</span> Community support</li>
                <li><span className="pricing-feature-icon">✓</span> Email support</li>
              </ul>
              <button className="btn btn-outline">Get Started Free</button>
              </div>
              
            <div className="pricing-card featured">
              <div className="pricing-badge">
                <span className="badge-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-1.12-2.5-2.5-2.5S6 10.62 6 12s1.12 2.5 2.5 2.5z"/>
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </span>
                <span>Most Popular</span>
              </div>
              <div className="pricing-header">
                <div className="pricing-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                  </svg>
                </div>
                <h3 className="pricing-title">Professional</h3>
                <div className="pricing-price">
                  <span className="price-amount" data-monthly="$29" data-annual="$23">$29</span>
                  <span className="price-period" data-monthly="/month" data-annual="/year">/month</span>
                </div>
                <p className="pricing-description">Perfect for growing teams</p>
              </div>
              <ul className="pricing-features">
                <li><span className="pricing-feature-icon">✓</span> Unlimited tests</li>
                <li><span className="pricing-feature-icon">✓</span> Unlimited projects</li>
                <li><span className="pricing-feature-icon">✓</span> Advanced analytics</li>
                <li><span className="pricing-feature-icon">✓</span> CI/CD integrations</li>
                <li><span className="pricing-feature-icon">✓</span> Enterprise security</li>
                <li><span className="pricing-feature-icon">✓</span> Priority support</li>
                <li><span className="pricing-feature-icon">✓</span> Team collaboration</li>
              </ul>
              <button className="btn btn-primary">Start Free Trial</button>
          </div>
              
            <div className="pricing-card">
              <div className="pricing-header">
                <div className="pricing-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <h3 className="pricing-title">Enterprise</h3>
                <div className="pricing-price">
                  <span className="price-amount" data-monthly="Custom" data-annual="Custom">Custom</span>
                  <span className="price-period" data-monthly="pricing" data-annual="pricing">pricing</span>
                </div>
                <p className="pricing-description">Perfect for large organizations</p>
              </div>
              <ul className="pricing-features">
                <li><span className="pricing-feature-icon">✓</span> Everything in Professional</li>
                <li><span className="pricing-feature-icon">✓</span> Custom integrations</li>
                <li><span className="pricing-feature-icon">✓</span> Dedicated support</li>
                <li><span className="pricing-feature-icon">✓</span> Advanced security</li>
                <li><span className="pricing-feature-icon">✓</span> SLA guarantee</li>
                <li><span className="pricing-feature-icon">✓</span> Custom training</li>
              </ul>
              <button className="btn btn-outline">Contact Sales</button>
            </div>
          </div>
          
          <div className="pricing-footer">
            <div className="pricing-note">
              <p>All plans include 14-day free trial • No credit card required • Cancel anytime</p>
            </div>
          </div>
        </div>
      </section>


      {/* Platform Section - Redesigned */}
      <section id="platform" className="platform-section">
        <div className="platform-background">
          <div className="platform-pattern"></div>
          <div className="platform-gradient"></div>
        </div>
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <span className="badge-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
              </span>
              <span>Complete Platform</span>
            </div>
            <h2 className="section-title">No-Code Platform for End-to-End Testing</h2>
            <p className="section-subtitle">Everything you need to test your web applications without writing a single line of code</p>
          </div>
          
          <div className="platform-hero">
            <div className="platform-hero-content">
              <div className="hero-visual">
                <div className="hero-icon-container">
                  <div className="hero-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                      <line x1="8" y1="21" x2="16" y2="21"/>
                      <line x1="12" y1="17" x2="12" y2="21"/>
                    </svg>
                  </div>
                  <div className="floating-elements">
                    <div className="floating-icon icon-1">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12,6 12,12 16,14"/>
                      </svg>
                    </div>
                    <div className="floating-icon icon-2">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 12l2 2 4-4"/>
                        <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
                        <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"/>
                      </svg>
                    </div>
                    <div className="floating-icon icon-3">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                        <path d="M13 8H7"/>
                        <path d="M17 12H7"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div className="hero-text">
                <h2>Complete Testing Solution</h2>
                <p>Everything you need to test your web applications without writing a single line of code. From test creation to execution, management to reporting - all in one powerful platform.</p>
                <div className="hero-stats">
                  <div className="stat-item">
                    <span className="stat-number">5</span>
                    <span className="stat-label">Min Setup</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">100%</span>
                    <span className="stat-label">No Code</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">24/7</span>
                    <span className="stat-label">Support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="platform-cards-container">
            <div className="platform-cards-grid">
              <div className="platform-card-modern">
                <div className="card-icon-modern">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    <path d="M13 8H7"/>
                    <path d="M17 12H7"/>
                  </svg>
                </div>
                <div className="card-content-modern">
                  <h3>Test Authoring</h3>
                  <div className="features-compact">
                    <span>Test recorder</span>
                    <span>Plain English tests</span>
                    <span>Element repository</span>
                    <span>Reusable step groups</span>
                    <span>Custom Add-ons</span>
                  </div>
                </div>
              </div>

              <div className="platform-card-modern">
                <div className="card-icon-modern">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 12l2 2 4-4"/>
                    <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
                    <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"/>
                  </svg>
                </div>
                <div className="card-content-modern">
                  <h3>Test Execution</h3>
                  <div className="features-compact">
                    <span>Cloud Device Farm</span>
                    <span>Local Testing</span>
                    <span>Parallel Execution</span>
                    <span>Scheduled Runs</span>
                    <span>Agent Control</span>
                  </div>
                </div>
              </div>
              
              <div className="platform-card-modern">
                <div className="card-icon-modern">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 17.2v-1.704q0-.592.313-1.057t.836-.723q1.117-.535 2.248-.824 1.13-.29 2.484-.29t2.485.29 2.248.824q.522.258.836.723t.313 1.057V17.2zm13.33 0v-1.798a2.93 2.93 0 00-.377-1.438 3.5 3.5 0 00-1.073-1.173 8.4 8.4 0 011.498.356q.708.24 1.352.57.608.316.939.746t.331.94V17.2zm-7.449-5.836q-1.132 0-1.938-.788-.806-.787-.806-1.894t.806-1.894A2.67 2.67 0 019.88 6q1.132 0 1.939.788.806.788.806 1.894 0 1.108-.806 1.894a2.67 2.67 0 01-1.939.788m6.771-2.682q0 1.108-.806 1.894a2.67 2.67 0 01-1.938.788q-.133 0-.338-.03a3 3 0 01-.338-.064 4 4 0 00.713-1.21 3.9 3.9 0 00-.005-2.753 4.4 4.4 0 00-.708-1.213q.169-.059.338-.076.168-.018.338-.018 1.131 0 1.938.788t.806 1.894M5.176 16.05h9.41v-.554a.76.76 0 00-.123-.427 1 1 0 00-.39-.327 9.4 9.4 0 00-1.993-.74 9.2 9.2 0 00-2.199-.25q-1.173 0-2.198.25a9.4 9.4 0 00-1.994.74 1 1 0 00-.39.327.76.76 0 00-.123.427zm4.705-5.835q.646 0 1.108-.45.46-.45.46-1.083a1.46 1.46 0 00-.46-1.082q-.461-.45-1.108-.45-.646 0-1.107.45t-.461 1.082.46 1.083q.462.45 1.108.45"/>
                  </svg>
                </div>
                <div className="card-content-modern">
                  <h3>Test Management</h3>
                  <div className="features-compact">
                    <span>Requirements</span>
                    <span>Version Control</span>
                    <span>Review</span>
                    <span>User Management</span>
                    <span>Data Maintenance</span>
                  </div>
                </div>
              </div>

              <div className="platform-card-modern">
                <div className="card-icon-modern">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6.51 20q-1.035 0-1.772-.738A2.42 2.42 0 014 17.49q0-1.034.738-1.773a2.42 2.42 0 011.772-.737q.37 0 .72.11.351.112.642.313l3.496-3.497V8.934a2.47 2.47 0 01-1.345-.877A2.4 2.4 0 019.49 6.51q0-1.035.738-1.772A2.42 2.42 0 0112 4q1.034 0 1.772.738.738.737.738 1.772 0 .88-.529 1.547a2.45 2.45 0 01-1.35.877v2.972l3.51 3.496q.291-.2.634-.311.342-.111.715-.111 1.035 0 1.772.737.738.738.738 1.773t-.738 1.772A2.42 2.42 0 0117.49 20q-1.034 0-1.773-.738a2.42 2.42 0 01-.737-1.772q0-.315.074-.612a2.3 2.3 0 01.219-.556L12 13.05l-3.273 3.273q.145.26.219.556t.074.612q0 1.035-.737 1.772A2.42 2.42 0 016.51 20m10.979-1.263q.519 0 .883-.364a1.2 1.2 0 00.365-.882q0-.518-.364-.884a1.2 1.2 0 00-.882-.364q-.518 0-.884.363a1.2 1.2 0 00-.364.883q0 .519.363.883a1.2 1.2 0 00.883.365m-5.49-10.98q.519 0 .884-.363a1.2 1.2 0 00.364-.883q0-.519-.364-.883a1.2 1.2 0 00-.882-.365q-.519 0-.884.364a1.2 1.2 0 00-.364.882q0 .519.364.884a1.2 1.2 0 00.882.364m-5.49 10.98q.519 0 .884-.364a1.2 1.2 0 00.364-.882q0-.518-.363-.884a1.2 1.2 0 00-.883-.364q-.519 0-.883.363a1.2 1.2 0 00-.365.883q0 .519.364.883a1.2 1.2 0 00.882.365"/>
                  </svg>
                </div>
                <div className="card-content-modern">
                  <h3>Use Cases</h3>
                  <div className="features-compact">
                    <span>Functional UI Testing</span>
                    <span>Visual Testing</span>
                    <span>Integration Testing</span>
                    <span>Regression Testing</span>
                    <span>Continuous Testing</span>
                  </div>
                </div>
              </div>

              <div className="platform-card-modern">
                <div className="card-icon-modern">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 3v18h18"/>
                    <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
                  </svg>
                </div>
                <div className="card-content-modern">
                  <h3>Reporting & Analytics</h3>
                  <div className="features-compact">
                    <span>Test Debugger</span>
                    <span>Comprehensive Reports</span>
                    <span>Chat Alerts</span>
                    <span>Screenshots, Videos and Logs</span>
                    <span>Auto-Healing Suggestions</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Redesigned */}
      <section id="testimonials" className="testimonials-section-modern">
        <div className="testimonials-background">
          <div className="testimonials-pattern"></div>
          <div className="testimonials-gradient"></div>
        </div>
        
        <div className="container">
          <div className="testimonials-header">
            <div className="testimonials-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              <span>What Our Users Say</span>
            </div>
            <h2 className="testimonials-title">Loved by QA Teams Worldwide</h2>
            <p className="testimonials-subtitle">Join thousands of satisfied customers who have transformed their testing workflow with TestGenie</p>
          </div>
          
          <div className="testimonials-grid-modern">
            <div className="testimonial-card-modern">
              <div className="testimonial-quote-modern">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
                  <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>
                </svg>
              </div>
              <div className="testimonial-content-modern">
                <p>"TestGenie has revolutionized our QA process. What used to take days now takes hours. The AI-powered test generation is incredibly accurate and saves us so much time."</p>
                <div className="testimonial-author-modern">
                  <div className="author-avatar-modern">
                    <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face" alt="John Smith" />
                  </div>
                  <div className="author-info-modern">
                    <h4>John Smith</h4>
                    <p>QA Lead at TechCorp</p>
                    <div className="rating-modern">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                      </svg>
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                      </svg>
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                      </svg>
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                      </svg>
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="testimonial-card-modern">
              <div className="testimonial-quote-modern">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
                  <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>
                </svg>
              </div>
              <div className="testimonial-content-modern">
                <p>"The cross-browser testing capabilities are outstanding. We can now test across 3000+ browser combinations without any hassle. Our bug detection rate has improved by 40%."</p>
                <div className="testimonial-author-modern">
                  <div className="author-avatar-modern">
                    <img src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face" alt="Sarah Johnson" />
                  </div>
                  <div className="author-info-modern">
                    <h4>Sarah Johnson</h4>
                    <p>Senior Developer at StartupXYZ</p>
                    <div className="rating-modern">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                      </svg>
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                      </svg>
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                      </svg>
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                      </svg>
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="testimonial-card-modern">
              <div className="testimonial-quote-modern">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
                  <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>
                </svg>
              </div>
              <div className="testimonial-content-modern">
                <p>"As a non-technical person, I was amazed at how easy it is to create comprehensive test cases using natural language. TestGenie made testing accessible to our entire team."</p>
                <div className="testimonial-author-modern">
                  <div className="author-avatar-modern">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face" alt="Mike Chen" />
                  </div>
                  <div className="author-info-modern">
                    <h4>Mike Chen</h4>
                    <p>Product Manager at InnovateLab</p>
                    <div className="rating-modern">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                      </svg>
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                      </svg>
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                      </svg>
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                      </svg>
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Section - Redesigned */}
      <section id="faqs" className="faqs-section-modern">
        <div className="container">
          <div className="faqs-header">
            <div className="faqs-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <path d="M12 17h.01"/>
              </svg>
              <span>Frequently Asked</span>
            </div>
            <h2 className="faqs-title">Got Questions? We've Got Answers</h2>
            <p className="faqs-subtitle">Find answers to common questions about TestGenie and how it can help your team</p>
          </div>
          
          <div className="faqs-grid-modern">
            <div className="faq-item-modern">
              <div className="faq-question-modern">
                <h3>How does TestGenie's AI test generation work?</h3>
                <button className="faq-toggle-modern">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </button>
              </div>
              <div className="faq-answer-modern">
                <p>TestGenie uses advanced natural language processing to understand your test requirements and automatically generates comprehensive test cases. Simply describe what you want to test in plain English, and our AI creates detailed test scenarios with edge cases and validation steps.</p>
              </div>
            </div>

            <div className="faq-item-modern">
              <div className="faq-question-modern">
                <h3>What browsers and devices does TestGenie support?</h3>
                <button className="faq-toggle-modern">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </button>
              </div>
              <div className="faq-answer-modern">
                <p>TestGenie supports testing across 3000+ browser and device combinations, including Chrome, Firefox, Safari, Edge, and mobile browsers. We continuously update our browser matrix to include the latest versions and devices.</p>
              </div>
            </div>

            <div className="faq-item-modern">
              <div className="faq-question-modern">
                <h3>Can I integrate TestGenie with my existing CI/CD pipeline?</h3>
                <button className="faq-toggle-modern">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </button>
              </div>
              <div className="faq-answer-modern">
                <p>Yes! TestGenie offers seamless integration with popular CI/CD tools including Jenkins, GitHub Actions, GitLab CI, Azure DevOps, and more. You can easily trigger tests as part of your deployment pipeline.</p>
              </div>
            </div>

            <div className="faq-item-modern">
              <div className="faq-question-modern">
                <h3>Is there a free trial available?</h3>
                <button className="faq-toggle-modern">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </button>
              </div>
              <div className="faq-answer-modern">
                <p>Absolutely! We offer a 14-day free trial with full access to all features. No credit card required to get started. You can also use our free tier with 100 test executions per month.</p>
              </div>
            </div>

            <div className="faq-item-modern">
              <div className="faq-question-modern">
                <h3>How accurate are the AI-generated test cases?</h3>
                <button className="faq-toggle-modern">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </button>
              </div>
              <div className="faq-answer-modern">
                <p>Our AI achieves 95% accuracy in test case generation. The AI learns from millions of test patterns and continuously improves. You can always review and modify generated tests to match your specific requirements.</p>
              </div>
            </div>

            <div className="faq-item-modern">
              <div className="faq-question-modern">
                <h3>What kind of support do you provide?</h3>
                <button className="faq-toggle-modern">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </button>
              </div>
              <div className="faq-answer-modern">
                <p>We provide comprehensive support including email support, live chat, documentation, video tutorials, and community forums. Enterprise customers get dedicated support with SLA guarantees.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section - Redesigned */}
      <section id="contact" className="contact-section-modern">
        <div className="contact-background-modern">
          <div className="contact-pattern-modern"></div>
          <div className="contact-gradient-modern"></div>
        </div>
        
        <div className="container">
          <div className="contact-header-modern">
            <div className="contact-badge-modern">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              <span>Get in Touch</span>
            </div>
            <h2 className="contact-title-modern">Ready to Transform Your Testing?</h2>
            <p className="contact-subtitle-modern">Join thousands of teams who have revolutionized their QA workflow with TestGenie</p>
          </div>
          
          <div className="contact-content-modern">
            <div className="contact-info-modern">
              <div className="contact-intro-modern">
                <h3>Let's Start a Conversation</h3>
                <p>Our team of testing experts is here to help you understand how TestGenie can transform your QA process.</p>
              </div>
              
              <div className="contact-methods-modern">
                <div className="contact-method-modern">
                  <div className="method-icon-modern">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </div>
                  <div className="method-content-modern">
                    <h4>Email Us</h4>
                    <p>Get detailed information and personalized responses</p>
                    <div className="method-links-modern">
                      <a href="mailto:sales@testgenie.com">sales@testgenie.com</a>
                      <a href="mailto:support@testgenie.com">support@testgenie.com</a>
                    </div>
                  </div>
                </div>
                    
                <div className="contact-method-modern">
                  <div className="method-icon-modern">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                  </div>
                  <div className="method-content-modern">
                    <h4>Call Us</h4>
                    <p>Speak directly with our testing experts</p>
                    <div className="method-links-modern">
                      <a href="tel:+19991234567">+1 (999) 123-4567</a>
                    </div>
                  </div>
                </div>
                    
                <div className="contact-method-modern">
                  <div className="method-icon-modern">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  </div>
                  <div className="method-content-modern">
                    <h4>Visit Us</h4>
                    <p>Come see us at our headquarters</p>
                    <div className="method-links-modern">
                      <span>123 Innovation World Drive<br/>Technology Valley, CA 99999, USA</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="contact-form-modern" id="contact-form">
              <div className="form-header-modern">
                <h3>Send us a Message</h3>
                <p>Tell us about your testing challenges and we'll show you how TestGenie can help</p>
              </div>
              
              <form className="contact-form-wrapper-modern">
                <div className="form-row-modern">
                  <div className="form-group-modern">
                    <input type="text" placeholder="First Name" required />
                  </div>
                  <div className="form-group-modern">
                    <input type="text" placeholder="Last Name" required />
                  </div>
                </div>
                
                <div className="form-row-modern">
                  <div className="form-group-modern">
                    <input type="email" placeholder="Email Address" required />
                  </div>
                  <div className="form-group-modern">
                    <input type="text" placeholder="Company" />
                  </div>
                </div>
                
                <div className="form-group-modern">
                  <select required>
                    <option value="">What can we help you with?</option>
                    <option value="demo">Request a Demo</option>
                    <option value="pricing">Pricing Information</option>
                    <option value="integration">Integration Support</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="custom">Custom Solution</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="form-group-modern">
                  <textarea 
                    placeholder="Tell us about your testing challenges, team size, and what you hope to achieve with TestGenie..." 
                    rows={5} 
                    required
                  ></textarea>
                </div>
                
                <button type="submit" className="btn-modern btn-primary-modern">
                  <span>Send Message</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <h3><span className="footer-logo-icon">⚡</span> TestGenie</h3>
              <p>AI-Powered Web Testing Platform</p>
            </div>
            <div className="footer-links">
              <div className="footer-column">
                <h4>Product</h4>
                <ul>
                <li><a href="#features">Features</a></li>
                <li><a href="#pricing">Pricing</a></li>
                  <li><a href="#platform">Platform</a></li>
              </ul>
                    </div>
              <div className="footer-column">
                <h4>Company</h4>
                <ul>
                <li><a href="#about">About</a></li>
                  <li><a href="#contact">Contact</a></li>
                <li><a href="#careers">Careers</a></li>
                </ul>
                    </div>
              <div className="footer-column">
                <h4>Support</h4>
                <ul>
                  <li><a href="#help">Help Center</a></li>
                  <li><a href="#docs">Documentation</a></li>
                  <li><a href="#status">Status</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-bottom-content">
              <p>&copy; 2025 TestGenie. All rights reserved.</p>
              <div className="footer-bottom-links">
                <a href="#privacy">Privacy</a>
                <a href="#terms">Terms</a>
                <a href="#cookies">Cookies</a>
              </div>
            </div>
            </div>
          </div>
      </footer>
      
    </div>
  );
}
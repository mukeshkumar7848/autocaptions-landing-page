// ================================================
// AUTO CAPTIONS PRO - PREMIUM INTERACTIONS
// Apple-inspired smooth animations & UX
// ================================================

// Global guards to prevent duplicate initialization
const ACPApp = {
  initialized: false,
  aosReady: false
};

// ================================================
// UTILITY FUNCTIONS
// ================================================

// Debounce function for scroll events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ================================================
// AOS INITIALIZATION
// ================================================
function initAOSOnce() {
  if (!window.AOS || ACPApp.aosReady) return;
  ACPApp.aosReady = true;
  AOS.init({
    once: true,
    offset: 80,
    duration: 600,
    easing: 'ease-out-cubic',
    disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches
  });
  window.addEventListener('load', () => {
    if (window.AOS) AOS.refreshHard();
  });
}

// ================================================
// NAVIGATION
// ================================================
function initNavigation() {
  const nav = document.querySelector('.nav');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  if (!navToggle || !navMenu) return;

  // Navbar scroll effect (debounced)
  const handleScroll = debounce(() => {
    if (nav) {
      nav.classList.toggle('scrolled', window.pageYOffset > 50);
      nav.style.boxShadow = window.pageYOffset > 50 ? '0 2px 20px rgba(0, 0, 0, 0.08)' : 'none';
    }
  }, 16);
  
  window.addEventListener('scroll', handleScroll, { passive: true });

  // Toggle mobile menu
  const toggleMenu = (isOpen) => {
    navMenu.classList.toggle('active', isOpen);
    navToggle.classList.toggle('active', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    navMenu.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    document.body.classList.toggle('nav-open', isOpen);
    
    // Focus management
    if (isOpen) {
      const firstLink = navMenu.querySelector('a');
      if (firstLink) firstLink.focus();
    } else {
      navToggle.focus();
    }
  };

  // Mobile menu toggle button
  navToggle.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const isOpen = !navMenu.classList.contains('active');
    toggleMenu(isOpen);
  });

  // Close menu when clicking links
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggleMenu(false);
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
      toggleMenu(false);
    }
  });

  // Keyboard support - Escape key to close menu
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
      toggleMenu(false);
    }
  });

  // Focus trap in mobile menu
  navMenu.addEventListener('keydown', (e) => {
    if (!navMenu.classList.contains('active')) return;
    
    if (e.key === 'Tab') {
      const focusableElements = navMenu.querySelectorAll('a, button');
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  });
}

// ================================================
// FAQ ACCORDION
// ================================================
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    
    if (!question || !answer) return;
    
    // Set initial state
    answer.style.maxHeight = '0px';
    
    // Add ARIA attributes
    const questionId = `faq-q-${Math.random().toString(36).substr(2, 9)}`;
    const answerId = `faq-a-${Math.random().toString(36).substr(2, 9)}`;
    question.id = questionId;
    answer.id = answerId;
    question.setAttribute('aria-controls', answerId);
    question.setAttribute('aria-expanded', 'false');
    answer.setAttribute('aria-labelledby', questionId);
    question.setAttribute('role', 'button');
    question.setAttribute('tabindex', '0');
    
    // Click handler
    const toggleFAQ = () => {
      const isActive = item.classList.contains('active');
      
      // Close all items
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        const otherQuestion = otherItem.querySelector('.faq-question');
        const otherAnswer = otherItem.querySelector('.faq-answer');
        if (otherQuestion) otherQuestion.setAttribute('aria-expanded', 'false');
        if (otherAnswer) otherAnswer.style.maxHeight = '0px';
      });
      
      // Toggle current item
      if (!isActive) {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
        requestAnimationFrame(() => {
          answer.style.maxHeight = answer.scrollHeight + 'px';
        });
      }
    };
    
    question.addEventListener('click', toggleFAQ);
    
    // Keyboard support
    question.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleFAQ();
      }
    });
  });
}

// ================================================
// BACK TO TOP BUTTON
// ================================================
function initBackToTop() {
  const backToTop = document.querySelector('.back-to-top') || document.getElementById('backToTop');
  
  if (!backToTop) return;
  
  // Add ARIA label
  backToTop.setAttribute('aria-label', 'Back to top');
  
  const handleScroll = debounce(() => {
    backToTop.classList.toggle('visible', window.pageYOffset > 400);
  }, 100);
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  backToTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ================================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ================================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Skip if it's just "#"
      if (href === '#') {
        e.preventDefault();
        return;
      }
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // Set focus for accessibility
        target.setAttribute('tabindex', '-1');
        target.focus();
      }
    });
  });
}

// ================================================
// OS DETECTION FOR KEYBOARD SHORTCUTS
// ================================================
function detectOS() {
  const userAgent = window.navigator.userAgent.toLowerCase();
  const osElements = document.querySelectorAll('.os-specific');
  
  let os = 'other';
  if (userAgent.indexOf('mac') !== -1) {
    os = 'mac';
  } else if (userAgent.indexOf('win') !== -1) {
    os = 'windows';
  }
  
  osElements.forEach(el => {
    if (el.dataset.os === os) {
      el.style.display = 'inline';
    } else {
      el.style.display = 'none';
    }
  });
}

// ================================================
// INTERACTIVE DEMO PANEL (Optional Enhancement)
// ================================================
function initDemoPanel() {
  const animTiles = document.querySelectorAll('.anim-tile');
  
  animTiles.forEach(tile => {
    tile.addEventListener('click', () => {
      animTiles.forEach(t => t.classList.remove('active'));
      tile.classList.add('active');
    });
  });
  
  // Set first animation as active by default
  if (animTiles.length > 0) {
    animTiles[0].classList.add('active');
  }
}

// ================================================
// LAZY LOAD IMAGES
// ================================================
function initLazyLoading() {
  if (!('IntersectionObserver' in window)) return;
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      }
    });
  });
  
  document.querySelectorAll('img.lazy').forEach(img => {
    imageObserver.observe(img);
  });
}

// ================================================
// ANALYTICS HELPERS
// ================================================
function trackEvent(category, action, label) {
  try {
    // Placeholder for analytics tracking
    // Replace with your analytics provider (Google Analytics, Plausible, etc.)
    if (window.gtag) {
      gtag('event', action, {
        event_category: category,
        event_label: label
      });
    }
    console.log('Event:', category, action, label);
  } catch (error) {
    console.error('Analytics error:', error);
  }
}

// Track CTA clicks with loading states
function initCTATracking() {
  document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('click', function(e) {
      trackEvent('CTA', 'Click', this.textContent.trim());
      
      // Add loading state
      if (!this.classList.contains('loading')) {
        const originalText = this.textContent;
        this.classList.add('loading');
        this.disabled = true;
        this.setAttribute('aria-busy', 'true');
        
        // Remove loading state after delay (adjust as needed)
        setTimeout(() => {
          this.classList.remove('loading');
          this.disabled = false;
          this.removeAttribute('aria-busy');
        }, 2000);
      }
    });
  });
}

// ================================================
// ACCESSIBILITY ENHANCEMENTS
// ================================================
function initAccessibility() {
  // Add skip link if not present
  if (!document.querySelector('.skip-link')) {
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  // Add ARIA labels to icon-only buttons
  document.querySelectorAll('button:not([aria-label])').forEach(btn => {
    if (!btn.textContent.trim() && btn.querySelector('svg, i')) {
      const context = btn.closest('section')?.id || 'button';
      btn.setAttribute('aria-label', `Action button in ${context}`);
    }
  });
}

// ================================================
// MAIN INITIALIZATION
// ================================================
function init() {
  if (ACPApp.initialized) return;
  ACPApp.initialized = true;

  // Set current year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Initialize all components
  initAOSOnce();
  initNavigation();
  initFAQ();
  initBackToTop();
  initSmoothScroll();
  detectOS();
  initLazyLoading();
  initCTATracking();
  initAccessibility();

  // Initialize demo panel if present
  if (document.querySelector('.anim-tile')) {
    initDemoPanel();
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// ================================================
// AUTO CAPTIONS PRO - PREMIUM INTERACTIONS
// Apple-inspired smooth animations & UX
// ================================================

// Initialize AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', () => {
  // Initialize AOS Library
  AOS.init({
    once: true,
    offset: 80,
    duration: 600,
    easing: 'ease-out-cubic'
  });

  // Initialize all components
  initNavigation();
  initFAQ();
  initBackToTop();
  initSmoothScroll();
  detectOS();
});

// ================================================
// NAVIGATION
// ================================================
function initNavigation() {
  const nav = document.querySelector('.nav');
  
  // Navbar scroll effect
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add shadow on scroll
    if (currentScroll > 50) {
      nav.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.08)';
    } else {
      nav.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
  });
  
  // Mobile menu toggle (if implemented)
  const navToggle = document.querySelector('.nav-toggle');
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      const navMenu = document.querySelector('.nav-menu');
      navMenu.classList.toggle('active');
    });
  }
}

// ================================================
// FAQ ACCORDION
// ================================================
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
      // Close other items
      const isActive = item.classList.contains('active');
      
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
      });
      
      // Toggle current item
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

// ================================================
// BACK TO TOP BUTTON
// ================================================
function initBackToTop() {
  const backToTop = document.querySelector('.back-to-top');
  
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });
    
    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
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

// Initialize demo panel if present
if (document.querySelector('.anim-tile')) {
  document.addEventListener('DOMContentLoaded', initDemoPanel);
}

// ================================================
// PERFORMANCE OPTIMIZATIONS
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

// Lazy load images (if needed)
if ('IntersectionObserver' in window) {
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
// ANALYTICS HELPERS (Optional)
// ================================================
function trackEvent(category, action, label) {
  // Placeholder for analytics tracking
  // Replace with your analytics provider (Google Analytics, Plausible, etc.)
  console.log('Event:', category, action, label);
}

// Track CTA clicks
document.querySelectorAll('.btn-primary').forEach(btn => {
  btn.addEventListener('click', () => {
    trackEvent('CTA', 'Click', btn.textContent);
  });
});

// Initialize AOS
AOS.init({
  once: true,
  offset: 80,
  duration: 600,
  easing: 'ease-out-cubic'
});

// Set current year
document.getElementById('year').textContent = new Date().getFullYear();

// Navigation scroll effect
const nav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

// Mobile menu toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

navToggle.addEventListener('click', () => {
  navMenu.classList.toggle('active');
  navToggle.classList.toggle('active');
});

// Close mobile menu on link click
navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
  });
});

// FAQ Accordion
document.querySelectorAll('.faq-question').forEach(button => {
  button.addEventListener('click', () => {
    const item = button.parentElement;
    const isActive = item.classList.contains('active');

    // Close all
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('active');
    });

    // Open clicked if it wasn't active
    if (!isActive) {
      item.classList.add('active');
    }
  });
});

// Back to top button
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  if (window.scrollY > 500) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

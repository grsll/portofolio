/* ============================================
   PORTFOLIO WEBSITE - MAIN JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================
  // Scroll Progress Bar
  // ============================================
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.prepend(progressBar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
  }, { passive: true });

  // ============================================
  // Glassy Navbar on Inner Pages
  // ============================================
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  if (currentPath !== 'index.html' && currentPath !== '') {
    document.querySelector('.navbar')?.classList.add('navbar-inner', 'scrolled');
  }
  // ============================================
  // Page Loader
  // ============================================
  const loader = document.querySelector('.page-loader');

  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('hidden');
      }, 400);
    });
    // Fallback: hide loader after 2s no matter what
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 2000);
  }

  // ============================================
  // Theme Toggle (Dark Mode)
  // ============================================
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }

  // ============================================
  // Navbar Scroll Effect
  // ============================================
  const navbar = document.querySelector('.navbar');
  const scrollTopBtn = document.querySelector('.scroll-top');

  function handleScroll() {
    const scrollY = window.scrollY;

    // Navbar background on scroll
    if (navbar) {
      if (scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Scroll-to-top button visibility
    if (scrollTopBtn) {
      if (scrollY > 400) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  // Scroll to top click
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ============================================
  // Mobile Navigation Toggle
  // ============================================
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const mobileOverlay = document.querySelector('.mobile-overlay');

  function openMenu() {
    navToggle.classList.add('active');
    navLinks.classList.add('open');
    if (mobileOverlay) mobileOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    navToggle.classList.remove('active');
    navLinks.classList.remove('open');
    if (mobileOverlay) mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      if (navLinks.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', closeMenu);
  }

  // Close mobile menu on link click
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // ============================================
  // Active Navbar Link Highlight
  // ============================================
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ============================================
  // Page Transition Effect
  // ============================================
  const pageTransition = document.querySelector('.page-transition');
  const transitionLinks = document.querySelectorAll('a[href$=".html"]');

  transitionLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      // Only apply transition for local pages
      if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('mailto:')) {
        e.preventDefault();
        if (pageTransition) {
          pageTransition.classList.add('active');
          setTimeout(() => {
            window.location.href = href;
          }, 300);
        } else {
          window.location.href = href;
        }
      }
    });
  });

  // ============================================
  // Scroll Reveal Animation
  // ============================================
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ============================================
  // Skill Bar Animation
  // ============================================
  const skillBars = document.querySelectorAll('.skill-bar-fill');

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const width = target.getAttribute('data-width');
        target.style.width = width + '%';
        skillObserver.unobserve(target);
      }
    });
  }, {
    threshold: 0.3
  });

  skillBars.forEach(bar => skillObserver.observe(bar));

  // ============================================
  // Contact Form Validation
  // ============================================
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Clear previous errors
      contactForm.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error');
      });

      // Validate Name
      const nameInput = document.getElementById('name');
      if (nameInput && nameInput.value.trim().length < 2) {
        nameInput.closest('.form-group').classList.add('error');
        isValid = false;
      }

      // Validate Email
      const emailInput = document.getElementById('email');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailInput && !emailRegex.test(emailInput.value.trim())) {
        emailInput.closest('.form-group').classList.add('error');
        isValid = false;
      }

      // Validate Message
      const messageInput = document.getElementById('message');
      if (messageInput && messageInput.value.trim().length < 10) {
        messageInput.closest('.form-group').classList.add('error');
        isValid = false;
      }

      if (isValid) {
        // Show success message
        const successMsg = document.querySelector('.form-success');
        if (successMsg) {
          successMsg.classList.add('show');
          contactForm.reset();
          setTimeout(() => {
            successMsg.classList.remove('show');
          }, 5000);
        }
      }
    });

    // Real-time validation: remove error on input
    contactForm.querySelectorAll('input, textarea').forEach(input => {
      input.addEventListener('input', () => {
        input.closest('.form-group').classList.remove('error');
      });
    });
  }

  // ============================================
  // Typing Effect (Hero Section)
  // ============================================
  const typingEl = document.querySelector('.typing-text');
  if (typingEl) {
    const phrases = JSON.parse(typingEl.getAttribute('data-phrases') || '[]');
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        typingEl.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typingEl.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
      }

      let delay = isDeleting ? 40 : 80;

      if (!isDeleting && charIndex === currentPhrase.length) {
        delay = 2000; // Wait before deleting
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        delay = 500;
      }

      setTimeout(typeEffect, delay);
    }

    setTimeout(typeEffect, 1000);
  }

  // ============================================
  // Counter Animation
  // ============================================
  const counters = document.querySelectorAll('[data-count]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'));
        const suffix = el.getAttribute('data-suffix') || '';
        let current = 0;
        const increment = target / 60;
        const duration = 1500;
        const stepTime = duration / 60;

        const counter = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(counter);
          }
          el.textContent = Math.floor(current) + suffix;
        }, stepTime);

        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));

});

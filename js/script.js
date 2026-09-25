/* ==========================================================================
   YOGA SETYAWAN PURWANTO — JAVASCRIPT (SMOOTH & CLEAN)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --------------------------------------------------------------------------
  // 1. SCROLL PROGRESS BAR
  // --------------------------------------------------------------------------
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.prepend(progressBar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
  }, { passive: true });

  // --------------------------------------------------------------------------
  // 2. THEME SETUP (DARK MODE ONLY)
  // --------------------------------------------------------------------------
  document.documentElement.setAttribute('data-theme', 'dark');
  localStorage.setItem('theme', 'dark');

  // --------------------------------------------------------------------------
  // 3. NAVBAR SCROLL & SCROLL TO TOP
  // --------------------------------------------------------------------------
  const navbar = document.getElementById('navbar') || document.querySelector('.navbar');
  const scrollTopBtn = document.getElementById('scrollTop') || document.querySelector('.scroll-top-btn');

  function handleScroll() {
    const scrollY = window.scrollY;
    if (navbar) {
      if (scrollY > 30) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    if (scrollTopBtn) {
      if (scrollY > 300) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --------------------------------------------------------------------------
  // 4. MOBILE DRAWER MENU
  // --------------------------------------------------------------------------
  const navToggle = document.getElementById('navToggle') || document.querySelector('.nav-toggle');
  const navLinks = document.getElementById('navLinks') || document.querySelector('.nav-links');
  const mobileOverlay = document.querySelector('.mobile-overlay');

  function openMenu() {
    if (navToggle) navToggle.classList.add('active');
    if (navLinks) navLinks.classList.add('open');
    if (mobileOverlay) mobileOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    if (navToggle) navToggle.classList.remove('active');
    if (navLinks) navLinks.classList.remove('open');
    if (mobileOverlay) mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      if (navLinks && navLinks.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', closeMenu);
  }

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // --------------------------------------------------------------------------
  // 5. ACTIVE NAV LINK
  // --------------------------------------------------------------------------
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // --------------------------------------------------------------------------
  // 6. TYPING ANIMATION (HERO)
  // --------------------------------------------------------------------------
  const typingEl = document.querySelector('.typing-text');
  if (typingEl) {
    const phrases = JSON.parse(typingEl.getAttribute('data-phrases') || '["Odoo Developer", "Python Backend", "Flutter Dev", "Problem Solver"]');
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeLoop() {
      const currentPhrase = phrases[phraseIndex];
      if (isDeleting) {
        typingEl.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typingEl.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
      }

      let delay = isDeleting ? 30 : 65;

      if (!isDeleting && charIndex === currentPhrase.length) {
        delay = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        delay = 350;
      }

      setTimeout(typeLoop, delay);
    }

    setTimeout(typeLoop, 600);
  }

  // --------------------------------------------------------------------------
  // 7. COUNTER ANIMATION
  // --------------------------------------------------------------------------
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-count'), 10) || 0;
          const suffix = el.getAttribute('data-suffix') || '';
          let current = 0;
          const steps = 35;
          const increment = target / steps;
          const intervalTime = 1000 / steps;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            el.textContent = Math.floor(current) + suffix;
          }, intervalTime);

          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.2 });

    counters.forEach(c => counterObserver.observe(c));
  }

  // --------------------------------------------------------------------------
  // 8. SMOOTH SCROLL REVEAL
  // --------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-l, .reveal-r');
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -30px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // --------------------------------------------------------------------------
  // 9. SKILL PROGRESS BAR
  // --------------------------------------------------------------------------
  const skillBars = document.querySelectorAll('.skill-progress-fill, .skill-fill');
  if (skillBars.length > 0) {
    const skillObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const width = target.getAttribute('data-width') || '80';
          target.style.width = width + '%';
          skillObserver.unobserve(target);
        }
      });
    }, { threshold: 0.2 });

    skillBars.forEach(b => skillObserver.observe(b));
  }

  // --------------------------------------------------------------------------
  // 10. PROJECT FILTERING & REAL-TIME SEARCH
  // --------------------------------------------------------------------------
  const filterPills = document.querySelectorAll('.filter-pill');
  const searchInput = document.getElementById('projectSearch');
  const projectCards = document.querySelectorAll('.project-card');

  function applyProjectFilters() {
    const activePill = document.querySelector('.filter-pill.active');
    const selectedCategory = activePill ? activePill.getAttribute('data-category') : 'all';
    const searchQuery = searchInput ? searchInput.value.toLowerCase().trim() : '';

    projectCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category') || '';
      const cardTitle = card.querySelector('.project-title')?.textContent.toLowerCase() || '';
      const cardDesc = card.querySelector('.project-description, .project-desc')?.textContent.toLowerCase() || '';
      const cardTech = card.querySelector('.project-tech-stack, .tech-tags')?.textContent.toLowerCase() || '';

      const matchCategory = (selectedCategory === 'all' || cardCategory.includes(selectedCategory));
      const matchSearch = (cardTitle.includes(searchQuery) || cardDesc.includes(searchQuery) || cardTech.includes(searchQuery));

      if (matchCategory && matchSearch) {
        card.style.display = 'flex';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 10);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(6px)';
        setTimeout(() => {
          card.style.display = 'none';
        }, 180);
      }
    });
  }

  if (filterPills.length > 0) {
    filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        applyProjectFilters();
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', applyProjectFilters);
  }

  // --------------------------------------------------------------------------
  // 11. TOAST NOTIFICATION UTILITY
  // --------------------------------------------------------------------------
  let toastEl = document.querySelector('.toast-notification');
  if (!toastEl) {
    toastEl = document.createElement('div');
    toastEl.className = 'toast-notification';
    toastEl.innerHTML = '<span id="toastMsg">Tersalin!</span>';
    document.body.appendChild(toastEl);
  }

  window.showToast = function(message) {
    const msgSpan = document.getElementById('toastMsg');
    if (msgSpan) msgSpan.textContent = message;
    toastEl.classList.add('show');
    setTimeout(() => {
      toastEl.classList.remove('show');
    }, 2400);
  };

  // --------------------------------------------------------------------------
  // 12. COPY EMAIL TO CLIPBOARD
  // --------------------------------------------------------------------------
  document.querySelectorAll('.btn-copy-email').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = btn.getAttribute('data-email') || 'astdnn48@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        window.showToast(`Email ${email} berhasil disalin!`);
      }).catch(() => {
        window.showToast(`Email: ${email}`);
      });
    });
  });

  // --------------------------------------------------------------------------
  // 13. PDF CV MODAL VIEWER
  // --------------------------------------------------------------------------
  window.openPdfModal = function(pdfUrl, title) {
    const overlay = document.getElementById('pdfModalOverlay');
    const iframe = document.getElementById('pdfIframe');
    const titleEl = document.getElementById('pdfModalTitle');
    const downloadBtn = document.getElementById('pdfDownloadBtn');

    if (overlay && iframe) {
      if (titleEl) titleEl.textContent = title || 'Curriculum Vitae — Yoga Setyawan Purwanto';
      iframe.src = pdfUrl || 'pdf/yoga_setyawan_cv.pdf';
      if (downloadBtn) downloadBtn.href = pdfUrl || 'pdf/yoga_setyawan_cv.pdf';
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (window.lucide) window.lucide.createIcons();
    }
  };

  window.closePdfModal = function() {
    const overlay = document.getElementById('pdfModalOverlay');
    const iframe = document.getElementById('pdfIframe');
    if (overlay) {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
      if (iframe) {
        setTimeout(() => { iframe.src = ''; }, 250);
      }
    }
  };

  const pdfOverlay = document.getElementById('pdfModalOverlay');
  const pdfCloseBtn = document.getElementById('pdfModalClose');
  if (pdfOverlay) {
    pdfOverlay.addEventListener('click', (e) => {
      if (e.target === pdfOverlay) window.closePdfModal();
    });
  }
  if (pdfCloseBtn) {
    pdfCloseBtn.addEventListener('click', window.closePdfModal);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      window.closePdfModal();
    }
  });

  // --------------------------------------------------------------------------
  // 14. CONTACT FORM SUBMISSION & VALIDATION
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      let isValid = true;
      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const messageInput = document.getElementById('message');

      // Reset error states
      contactForm.querySelectorAll('.form-group').forEach(group => group.classList.remove('invalid'));

      if (!nameInput || nameInput.value.trim().length < 2) {
        isValid = false;
        nameInput?.closest('.form-group')?.classList.add('invalid');
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput || !emailPattern.test(emailInput.value.trim())) {
        isValid = false;
        emailInput?.closest('.form-group')?.classList.add('invalid');
      }

      if (!messageInput || messageInput.value.trim().length < 10) {
        isValid = false;
        messageInput?.closest('.form-group')?.classList.add('invalid');
      }

      if (!isValid) return;

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Mengirim Pesan...</span>';
      }

      try {
        const formData = new FormData(contactForm);
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          if (formSuccess) formSuccess.classList.add('show');
          contactForm.reset();
          if (window.lucide) window.lucide.createIcons();
        } else {
          window.showToast('Gagal mengirim pesan, silakan hubungi via WhatsApp.');
        }
      } catch (error) {
        window.showToast('Terjadi kesalahan jaringan.');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
          if (window.lucide) window.lucide.createIcons();
        }
      }
    });
  }

  // --------------------------------------------------------------------------
  // 15. INITIALIZE ICONS
  // --------------------------------------------------------------------------
  if (window.lucide) {
    window.lucide.createIcons();
  }

});

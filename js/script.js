/* ==========================================================================
   YOGA — JAVASCRIPT (CLEAN, ACCESSIBLE, ROBUST)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --------------------------------------------------------------------------
  // 1. SCROLL PROGRESS INDICATOR
  // --------------------------------------------------------------------------
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  progressBar.setAttribute('aria-hidden', 'true');
  document.body.prepend(progressBar);

  function updateProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = Math.min(100, Math.max(0, progress)) + '%';
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  // --------------------------------------------------------------------------
  // 2. NAVBAR SCROLL STATE & SCROLL-TO-TOP BUTTON
  // --------------------------------------------------------------------------
  const navbar = document.querySelector('.nav-bar');
  const scrollTopBtn = document.getElementById('scrollTop') || document.querySelector('.scroll-top-btn');

  function handleNavbarScroll() {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    if (navbar) {
      if (scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    if (scrollTopBtn) {
      if (scrollY > 350) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --------------------------------------------------------------------------
  // 3. RESPONSIVE MOBILE NAVIGATION DRAWER
  // --------------------------------------------------------------------------
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  let mobileOverlay = document.querySelector('.mobile-overlay');

  if (!mobileOverlay) {
    mobileOverlay = document.createElement('div');
    mobileOverlay.className = 'mobile-overlay';
    document.body.appendChild(mobileOverlay);
  }

  function openMobileMenu() {
    if (navToggle) {
      navToggle.setAttribute('aria-expanded', 'true');
      navToggle.innerHTML = '<i data-lucide="x" style="width: 20px; height: 20px;"></i>';
    }
    if (navLinks) navLinks.classList.add('open');
    if (mobileOverlay) mobileOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (window.lucide) window.lucide.createIcons();
  }

  function closeMobileMenu() {
    if (navToggle) {
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.innerHTML = '<i data-lucide="menu" style="width: 20px; height: 20px;"></i>';
    }
    if (navLinks) navLinks.classList.remove('open');
    if (mobileOverlay) mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
    if (window.lucide) window.lucide.createIcons();
  }

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks && navLinks.classList.contains('open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', closeMobileMenu);
  }

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // --------------------------------------------------------------------------
  // 4. ACTIVE NAVIGATION LINK DETECTION
  // --------------------------------------------------------------------------
  const pathParts = window.location.pathname.split('/');
  const currentPage = pathParts[pathParts.length - 1] || 'index.html';

  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    }
  });

  // --------------------------------------------------------------------------
  // 5. TOAST NOTIFICATION UTILITY
  // --------------------------------------------------------------------------
  let toastEl = document.querySelector('.toast-notification');
  if (!toastEl) {
    toastEl = document.createElement('div');
    toastEl.className = 'toast-notification';
    toastEl.setAttribute('role', 'status');
    toastEl.setAttribute('aria-live', 'polite');
    toastEl.innerHTML = '<span id="toastMsg">Tersalin!</span>';
    document.body.appendChild(toastEl);
  }

  let toastTimer = null;
  window.showToast = function (message) {
    const msgSpan = document.getElementById('toastMsg');
    if (msgSpan) msgSpan.textContent = message;
    toastEl.classList.add('show');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove('show');
    }, 2400);
  };

  // --------------------------------------------------------------------------
  // 6. COPY EMAIL TO CLIPBOARD
  // --------------------------------------------------------------------------
  document.querySelectorAll('.btn-copy-email').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = btn.getAttribute('data-email') || 'astdnn48@gmail.com';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(() => {
          window.showToast(`Email ${email} berhasil disalin!`);
        }).catch(() => {
          window.showToast(`Email: ${email}`);
        });
      } else {
        window.showToast(`Email: ${email}`);
      }
    });
  });

  // --------------------------------------------------------------------------
  // 7. PDF CV MODAL VIEWER
  // --------------------------------------------------------------------------
  const DEFAULT_CV_PREVIEW = 'https://drive.google.com/file/d/1Rk5Mdu3G75TwLHxBnJttavgqscBvGUX7/preview';
  const DEFAULT_CV_DOWNLOAD = 'pdf/yoga_setyawan_cv.pdf';
  const DEFAULT_CV_DRIVE_VIEW = 'https://drive.google.com/file/d/1Rk5Mdu3G75TwLHxBnJttavgqscBvGUX7/view?usp=sharing';

  window.openPdfModal = function (pdfUrl, title, downloadUrl) {
    const overlay = document.getElementById('pdfModalOverlay');
    const iframe = document.getElementById('pdfIframe');
    const titleEl = document.getElementById('pdfModalTitle');
    const downloadBtn = document.getElementById('pdfDownloadBtn');
    const externalBtn = document.getElementById('pdfExternalBtn');

    if (overlay && iframe) {
      if (titleEl) titleEl.textContent = title || 'Curriculum Vitae — Yoga Setyawan Purwanto';
      const targetUrl = pdfUrl || DEFAULT_CV_PREVIEW;
      iframe.src = targetUrl;
      if (downloadBtn) {
        downloadBtn.href = downloadUrl || DEFAULT_CV_DOWNLOAD;
        downloadBtn.setAttribute('download', 'CV_Yoga_Setyawan_Purwanto.pdf');
      }
      if (externalBtn) {
        externalBtn.href = DEFAULT_CV_DRIVE_VIEW;
      }
      overlay.classList.add('active');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (window.lucide) window.lucide.createIcons();
    }
  };

  window.closePdfModal = function () {
    const overlay = document.getElementById('pdfModalOverlay');
    const iframe = document.getElementById('pdfIframe');
    if (overlay) {
      overlay.classList.remove('active');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (iframe) {
        setTimeout(() => { iframe.src = ''; }, 200);
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
      closeMobileMenu();
    }
  });

  // --------------------------------------------------------------------------
  // 8. PROJECT FILTERING & REAL-TIME SEARCH (PROJECTS PAGE)
  // --------------------------------------------------------------------------
  const filterPills = document.querySelectorAll('.filter-pill');
  const searchInput = document.getElementById('projectSearch');
  const filterableProjects = document.querySelectorAll('.project-item, .project-featured-card, .project-archive-item');

  function applyProjectFilters() {
    const activePill = document.querySelector('.filter-pill.active');
    const selectedCategory = activePill ? activePill.getAttribute('data-category') : 'all';
    const searchQuery = searchInput ? searchInput.value.toLowerCase().trim() : '';

    let visibleCount = 0;

    filterableProjects.forEach(item => {
      const itemCategory = (item.getAttribute('data-category') || '').toLowerCase();
      const title = (item.querySelector('.project-title, .project-archive-title')?.textContent || '').toLowerCase();
      const desc = (item.querySelector('.project-desc, .project-archive-desc')?.textContent || '').toLowerCase();
      const tech = (item.querySelector('.tag-cloud, .project-archive-desc')?.textContent || '').toLowerCase();

      const matchCategory = (selectedCategory === 'all' || itemCategory.includes(selectedCategory));
      const matchSearch = (!searchQuery || title.includes(searchQuery) || desc.includes(searchQuery) || tech.includes(searchQuery));

      if (matchCategory && matchSearch) {
        item.style.display = '';
        visibleCount++;
      } else {
        item.style.display = 'none';
      }
    });

    const emptyNotice = document.getElementById('noProjectsNotice');
    if (emptyNotice) {
      emptyNotice.style.display = visibleCount === 0 ? 'block' : 'none';
    }
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
  // 9. CONTACT FORM SUBMISSION & CLIENT VALIDATION
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

      // Reset errors
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

      if (!messageInput || messageInput.value.trim().length < 8) {
        isValid = false;
        messageInput?.closest('.form-group')?.classList.add('invalid');
      }

      if (!isValid) return;

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';
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
          if (formSuccess) {
            formSuccess.classList.add('show');
            formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
          contactForm.reset();
          window.showToast('Pesan Anda berhasil dikirim!');
        } else {
          window.showToast('Gagal mengirim pesan. Silakan hubungi via WhatsApp.');
        }
      } catch (err) {
        window.showToast('Terjadi gangguan koneksi. Silakan hubungi via WhatsApp.');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;
          if (window.lucide) window.lucide.createIcons();
        }
      }
    });
  }

  // --------------------------------------------------------------------------
  // 10. LUCIDE ICONS INITIALIZATION
  // --------------------------------------------------------------------------
  if (window.lucide) {
    window.lucide.createIcons();
  }

});

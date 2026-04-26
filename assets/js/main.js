(() => {
  const header = document.getElementById('siteHeader');
  const searchToggle = document.getElementById('searchToggle');
  const searchPanel = document.getElementById('searchPanel');
  const searchInput = document.getElementById('searchInput');
  const navLinks = Array.from(document.querySelectorAll('#mainNavbar .nav-link[href^="#"]'));
  const sections = ['home', 'news', 'electric', 'features', 'stories', 'about', 'contact']
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const setHeaderState = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  };

  const closeSearchPanel = () => {
    if (!searchPanel || !searchToggle) return;
    searchPanel.classList.remove('is-open');
    searchToggle.setAttribute('aria-expanded', 'false');
  };

  setHeaderState();
  window.addEventListener('scroll', setHeaderState);

  if (searchToggle && searchPanel) {
    searchToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = searchPanel.classList.toggle('is-open');
      searchToggle.setAttribute('aria-expanded', String(isOpen));
      if (isOpen && searchInput) searchInput.focus();
    });

    document.addEventListener('click', (event) => {
      if (!searchPanel.contains(event.target) && !searchToggle.contains(event.target)) {
        closeSearchPanel();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeSearchPanel();
    });
  }

  const navbarCollapseEl = document.getElementById('mainNavbar');
  const bsCollapse = navbarCollapseEl ? new bootstrap.Collapse(navbarCollapseEl, { toggle: false }) : null;

  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      event.preventDefault();
      const headerHeight = header ? header.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight + 2;
      window.scrollTo({ top, behavior: 'smooth' });

      if (window.innerWidth < 992 && navbarCollapseEl?.classList.contains('show')) {
        const inDropdownMenu = !!link.closest('.dropdown-menu');
        const isDropdownToggle = link.classList.contains('dropdown-toggle');
        if (!isDropdownToggle || inDropdownMenu) {
          bsCollapse?.hide();
        }
      }
    });
  });

  const setActiveByScroll = () => {
    const scrollPos = window.scrollY + (header ? header.offsetHeight + 30 : 100);
    let currentId = sections[0]?.id;

    sections.forEach((section) => {
      if (section.offsetTop <= scrollPos) currentId = section.id;
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute('href')?.replace('#', '');
      link.classList.toggle('active', href === currentId);
    });
  };

  setActiveByScroll();
  window.addEventListener('scroll', setActiveByScroll);

  const slides = Array.from(document.querySelectorAll('.hero-slide'));
  const prevBtn = document.getElementById('heroPrev');
  const nextBtn = document.getElementById('heroNext');
  let currentSlide = slides.findIndex((slide) => slide.classList.contains('active'));
  if (currentSlide < 0) currentSlide = 0;

  const renderSlide = (index) => {
    slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
  };

  const goToSlide = (index) => {
    currentSlide = (index + slides.length) % slides.length;
    renderSlide(currentSlide);
  };

  let autoplay = null;
  const startAutoplay = () => {
    if (slides.length < 2) return;
    clearInterval(autoplay);
    autoplay = setInterval(() => goToSlide(currentSlide + 1), 5000);
  };

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      goToSlide(currentSlide - 1);
      startAutoplay();
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      goToSlide(currentSlide + 1);
      startAutoplay();
    });
  }
  startAutoplay();

  const categoryTabs = document.getElementById('categoryTabs');
  if (categoryTabs) {
    categoryTabs.addEventListener('click', (event) => {
      const button = event.target.closest('.category-item');
      if (!button) return;
      categoryTabs.querySelectorAll('.category-item').forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
    });
  }

  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterMessage = document.getElementById('newsletterMessage');
  const nameInput = document.getElementById('newsName');
  const emailInput = document.getElementById('newsEmail');
  const privacyAgree = document.getElementById('privacyAgree');

  if (newsletterForm && newsletterMessage && nameInput && emailInput) {
    newsletterForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!name || !email) {
        newsletterMessage.textContent = 'Please enter both your name and email.';
        newsletterMessage.style.color = '#c0392b';
        return;
      }

      if (!validEmail) {
        newsletterMessage.textContent = 'Please enter a valid email address.';
        newsletterMessage.style.color = '#c0392b';
        return;
      }

      if (privacyAgree && !privacyAgree.checked) {
        newsletterMessage.textContent = 'Please agree to the privacy policy before subscribing.';
        newsletterMessage.style.color = '#c0392b';
        return;
      }

      newsletterMessage.textContent = `Thanks ${name}! You are now subscribed.`;
      newsletterMessage.style.color = '#1e824c';
      newsletterForm.reset();
    });
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
      });
    },
    { threshold: 0.18 }
  );

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
})();

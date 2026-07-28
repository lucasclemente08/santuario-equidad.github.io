// ═══════════════════════════════════════════
// SANTUARIO EQUIDAD — App Principal
// Router SPA con hash-based navigation
// ═══════════════════════════════════════════

const App = {
  currentSection: 'home',

  async init() {
    this.renderShell();
    this.initTheme();
    this.initScrollEffects();
    this.initIntersectionObserver();
    this.navigate();
    window.addEventListener('hashchange', () => this.navigate());
  },

  renderShell() {
    const cfg = Store.get();
    const app = document.getElementById('app');
    const waMsg = encodeURIComponent(cfg.whatsapp.message);
    const waUrl = `https://wa.me/${cfg.whatsapp.number}?text=${waMsg}`;

    app.innerHTML = `
      ${Navbar.render()}
      <main id="main-content"></main>
      ${Footer.render()}
      <button class="back-to-top" id="backToTop" aria-label="Volver arriba" title="Volver arriba">
        <i class="fas fa-chevron-up"></i>
      </button>
      <a href="${waUrl}" class="whatsapp-float" target="_blank" rel="noopener"
         aria-label="Contactar por WhatsApp" title="Escribinos por WhatsApp">
        <i class="fab fa-whatsapp"></i>
      </a>
    `;

    Navbar.init();
    this.initBackToTop();
  },

  navigate() {
    const hash = window.location.hash.slice(1) || 'home';
    this.currentSection = hash;

    const main = document.getElementById('main-content');
    if (!main) return;

    // Admin panel
    if (hash === 'admin') {
      this.loadAdminCSS();
      main.innerHTML = AdminPanel.render();
      setTimeout(() => AdminPanel.init(), 50);
      Navbar.setActive('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Remove admin CSS if coming from admin
    this.removeAdminCSS();

    switch (hash) {
      case 'home':
        main.innerHTML = Hero.render() + HelpCards.render();
        break;
      case 'nosotros':
        main.innerHTML = AboutSection.render();
        break;
      case 'donar':
        main.innerHTML = DonateSection.render();
        setTimeout(() => DonateSection.init(), 100);
        break;
      case 'apadrinar':
        main.innerHTML = AnimalsSection.renderApadrinar();
        break;
      case 'adoptar':
        main.innerHTML = AnimalsSection.renderAdoptar();
        break;
      case 'voluntariado':
        main.innerHTML = VolunteerSection.render();
        break;
      case 'contacto':
        main.innerHTML = ContactSection.render();
        setTimeout(() => ContactSection.init(), 100);
        break;
      default:
        main.innerHTML = Hero.render() + HelpCards.render();
    }

    // Stats bar solo en home
    if (hash === 'home') {
      const statsHtml = StatsBar.render();
      const hero = main.querySelector('.hero');
      if (hero && !document.querySelector('.stats-bar')) {
        hero.insertAdjacentHTML('afterend', statsHtml);
        setTimeout(() => StatsBar.init(), 200);
      }
    }

    Navbar.setActive(hash);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => this.initIntersectionObserver(), 100);
  },

  loadAdminCSS() {
    if (!document.getElementById('admin-css')) {
      const link = document.createElement('link');
      link.id = 'admin-css';
      link.rel = 'stylesheet';
      link.href = 'css/admin.css';
      document.head.appendChild(link);
    }
  },

  removeAdminCSS() {
    const link = document.getElementById('admin-css');
    if (link) link.remove();
  },

  initTheme() {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;

    const updateIcon = () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const icon = toggle.querySelector('i');
      if (icon) icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    };

    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
    updateIcon();

    toggle.onclick = () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      if (isDark) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
      }
      updateIcon();
    };
  },

  initScrollEffects() {},

  initIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
  },

  initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 500);
    });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());

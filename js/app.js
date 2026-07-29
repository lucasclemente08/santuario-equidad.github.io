// ═══════════════════════════════════════════
// SANTUARIO EQUIDAD — App Principal v3
// Router SPA estable + stats integradas
// ═══════════════════════════════════════════

const App = {
  currentSection: 'home',

  async init() {
    this.renderShell();
    this.initTheme();
    this.navigate();
    window.addEventListener('hashchange', () => this.navigate());
  },

  renderShell() {
    const cfg = Store.get();
    const app = document.getElementById('app');
    const waMsg = encodeURIComponent(cfg.whatsapp.message);
    const waUrl = 'https://wa.me/' + cfg.whatsapp.number + '?text=' + waMsg;

    app.innerHTML = Navbar.render() +
      '<main id="main-content"></main>' +
      Footer.render() +
      '<button class="back-to-top" id="backToTop" aria-label="Volver arriba"><i class="fas fa-chevron-up"></i></button>' +
      '<a href="' + waUrl + '" class="whatsapp-float" target="_blank" rel="noopener" aria-label="WhatsApp"><i class="fab fa-whatsapp"></i></a>';

    Navbar.init();
    this.initBackToTop();
  },

  navigate() {
    const hash = window.location.hash.slice(1) || 'home';
    this.currentSection = hash;
    const main = document.getElementById('main-content');
    if (!main) return;

    // Admin
    if (hash === 'admin') {
      this.loadAdminCSS();
      if (!Auth.isAuthenticated()) {
        main.innerHTML = Auth.renderLogin();
        Auth.initLoginEvents();
      } else {
        main.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;padding:4rem;color:var(--text-light);"><i class="fas fa-spinner fa-spin"></i> Cargando panel...</div>';
        setTimeout(function() { AdminPanel.init(); }, 50);
      }
      Navbar.setActive('admin');
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }

    this.removeAdminCSS();

    // Render section
    switch (hash) {
      case 'home':
        main.innerHTML = Hero.render() + StatsBar.render() + HelpCards.render();
        break;
      case 'nosotros':
        main.innerHTML = AboutSection.render();
        break;
      case 'donar':
        main.innerHTML = DonateSection.render();
        setTimeout(function() { DonateSection.init(); }, 100);
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
      case 'noticias':
        main.innerHTML = NewsSection.render();
        break;
      case 'contacto':
        main.innerHTML = ContactSection.render();
        setTimeout(function() { ContactSection.init(); }, 100);
        break;
      default:
        main.innerHTML = Hero.render() + StatsBar.render() + HelpCards.render();
    }

    Navbar.setActive(hash);
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Inicializar animaciones
    setTimeout(function() { App.initAnimations(); }, 150);
    if (hash === 'home') setTimeout(function() { StatsBar.init(); }, 300);
  },

  initAnimations() {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    document.querySelectorAll('.fade-in').forEach(function(el) { observer.observe(el); });
  },

  // ── Actualizar navbar dinámicamente (sin recargar la página) ──
  refreshNavbar() {
    var oldNav = document.getElementById('navbar');
    if (!oldNav) return;
    var temp = document.createElement('div');
    temp.innerHTML = Navbar.render();
    var newNav = temp.firstElementChild;
    oldNav.parentNode.replaceChild(newNav, oldNav);
    Navbar.init();
    Navbar.setActive(this.currentSection);
    this.initTheme(); // Re-attach theme toggle
  },

  loadAdminCSS() {
    if (!document.getElementById('admin-css')) {
      var link = document.createElement('link');
      link.id = 'admin-css';
      link.rel = 'stylesheet';
      link.href = 'css/admin.css';
      document.head.appendChild(link);
    }
  },

  removeAdminCSS() {
    var link = document.getElementById('admin-css');
    if (link) link.remove();
  },

  initTheme() {
    var toggle = document.getElementById('themeToggle');
    if (!toggle) return;

    var updateIcon = function() {
      var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      var icon = toggle.querySelector('i');
      if (icon) icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    };

    var saved = localStorage.getItem('theme');
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
    updateIcon();

    toggle.onclick = function() {
      var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
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

  initBackToTop() {
    var btn = document.getElementById('backToTop');
    if (!btn) return;
    window.addEventListener('scroll', function() {
      btn.classList.toggle('visible', window.scrollY > 500);
    });
    btn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
};

document.addEventListener('DOMContentLoaded', function() { App.init(); });

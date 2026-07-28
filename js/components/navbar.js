// Componente Navbar (data-driven)
const Navbar = {
  render() {
    const cfg = Store.get();
    const navItems = cfg.nav.map(item =>
      `<li><a href="${item.href}" data-nav="${item.id}">${item.label}</a></li>`
    ).join('');

    return `
      <nav class="navbar" id="navbar">
        <div class="container">
          <a href="#home" class="nav-logo" data-nav="home">
            <img src="${cfg.site.logo}" alt="${cfg.site.name}" width="42" height="42">
            ${cfg.site.name}
          </a>
          <ul class="nav-links" id="navLinks">
            ${navItems}
          </ul>
          <div class="nav-actions">
            <button class="theme-toggle" id="themeToggle" aria-label="Cambiar tema" title="Modo oscuro">
              <i class="fas fa-moon"></i>
            </button>
            <button class="hamburger" id="hamburger" aria-label="Menú">
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </nav>
    `;
  },

  init() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const navbar = document.getElementById('navbar');

    hamburger?.addEventListener('click', () => navLinks?.classList.toggle('open'));

    navLinks?.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navLinks.classList.remove('open'));
    });

    window.addEventListener('scroll', () => {
      navbar?.classList.toggle('scrolled', window.scrollY > 50);
    });
  },

  setActive(section) {
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.classList.toggle('active', link.dataset.nav === section);
    });
  }
};

const Hero = {
  render() {
    const cfg = Store.get();
    const h = cfg.hero;
    const buttons = h.buttons.map(b =>
      `<a href="${b.href}" class="btn btn-${b.style}"${b.style==='outline'?' style="color:#fff;border-color:#fff;"':''}>
        ${b.text} <i class="fas ${b.icon}"></i>
      </a>`
    ).join('');

    return `
      <section class="hero" id="home" style="background:linear-gradient(135deg,var(--green-900),var(--green-700),#1b4332))">
        <div class="container">
          <div class="hero-content fade-in">
            <h1>${h.title}</h1>
            <p>${h.subtitle}</p>
            <div class="hero-buttons">${buttons}</div>
          </div>
          <div class="hero-visual fade-in">
            <img src="${h.image}" alt="${cfg.site.name}" onerror="this.style.display='none'">
          </div>
        </div>
        <div class="hero-wave">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path d="M0,60 C360,120 720,0 1440,60 L1440,120 L0,120 Z"></path>
          </svg>
        </div>
      </section>
    `;
  }
};

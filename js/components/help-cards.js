const HelpCards = {
  render() {
    const cfg = Store.get();
    const cards = cfg.helpCards.map(c => `
      <a href="${c.link}" class="help-card fade-in" ${c.external ? 'target="_blank" rel="noopener"' : ''}>
        <div class="icon-circle"><i class="fa-solid ${c.icon}"></i></div>
        <h3>${c.title}</h3>
        <p>${c.desc}</p>
      </a>
    `).join('');

    return `
      <section class="section" id="como-ayudar">
        <div class="container">
          <div class="section-title">
            <h2>¿Cómo ayudar?</h2>
            <p>Hay muchas formas de colaborar con el santuario. Elegí la que más te guste.</p>
          </div>
          <div class="help-grid">${cards}</div>
        </div>
      </section>
    `;
  }
};

const AnimalsSection = {
  renderSection(category) {
    const cfg = Store.get();
    const data = cfg.animales[category];
    const cards = data.items.map(a => this.renderCard(a, cfg)).join('');

    let extra = '';
    if (category === 'adopcion') {
      extra = `
        <div style="text-align:center; margin-top: 2rem; max-width: 700px; margin-left: auto; margin-right: auto;">
          <p style="color: var(--text-light); font-style: italic;">${cfg.animales.adopcionMessage}</p>
          <a href="${cfg.animales.instagramUrl}" target="_blank" rel="noopener" class="btn btn-outline" style="margin-top:1rem;">
            <i class="fab fa-instagram"></i> Escribinos en Instagram
          </a>
        </div>`;
    }

    const bg = category === 'adopcion' ? 'style="background: var(--bg-alt);"' : '';

    return `
      <section class="section" id="${data.id}" ${bg}>
        <div class="container">
          <div class="section-title">
            <h2>${data.title}</h2>
            <p>${data.subtitle}</p>
          </div>
          <div class="animals-grid">${cards}</div>
          ${extra}
        </div>
      </section>
    `;
  },

  renderCard(animal, cfg) {
    return `
      <div class="animal-card fade-in">
        <div class="animal-card-img">
          <img src="${animal.imagen}" alt="${animal.nombre}" loading="lazy"
               onerror="this.src='${cfg.animales.fallbackImage}'">
          <span class="animal-card-badge">${animal.tipo}</span>
        </div>
        <div class="animal-card-body">
          <h3>${animal.nombre}</h3>
          <p>${animal.historia}</p>
          <div class="animal-card-actions">
            <a href="#contacto" class="btn btn-primary">${animal.accion} <i class="fas fa-heart"></i></a>
          </div>
        </div>
      </div>
    `;
  },

  renderAdoptar() { return this.renderSection('adopcion'); },
  renderApadrinar() { return this.renderSection('apadrinamiento'); }
};

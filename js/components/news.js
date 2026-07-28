// Componente Noticias — Vista pública con filtros y embeds de Instagram
const NewsSection = {
  render() {
    const cfg = Store.get();
    const n = cfg.noticias;
    const items = [...n.items].sort((a, b) => new Date(b.date) - new Date(a.date));

    const categoryFilters = n.categories.map(cat =>
      `<button class="news-filter-btn" data-cat="${cat}" onclick="NewsSection.filter('${cat}')">
        ${cat === 'todas' ? '📰 Todas' : this._capitalize(cat)}
      </button>`
    ).join('');

    const newsCards = items.map(item => this.renderCard(item)).join('');

    return `
      <section class="section" id="noticias">
        <div class="container">
          <div class="section-title">
            <h2>${n.title}</h2>
            <p>${n.subtitle}</p>
          </div>

          <div class="news-filters">
            ${categoryFilters}
          </div>

          <div class="news-grid" id="newsGrid">
            ${newsCards}
          </div>
        </div>
      </section>
    `;
  },

  renderCard(item) {
    const date = new Date(item.date + 'T00:00:00');
    const formattedDate = date.toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' });
    const hasInstagram = item.instagramUrl && item.instagramUrl.includes('instagram.com');

    return `
      <article class="news-card fade-in" data-category="${item.category}">
        ${item.image ? `
        <div class="news-card-img">
          <img src="${item.image}" alt="${this._esc(item.title)}" loading="lazy"
               onerror="this.style.display='none'">
          <span class="news-card-category">${this._capitalize(item.category)}</span>
        </div>` : ''}

        <div class="news-card-body">
          <div class="news-card-meta">
            <span><i class="far fa-calendar"></i> ${formattedDate}</span>
            <span><i class="far fa-user"></i> ${this._esc(item.author)}</span>
          </div>
          <h3>${this._esc(item.title)}</h3>
          <p>${this._esc(item.content)}</p>

          ${item.tags && item.tags.length ? `
          <div class="news-card-tags">
            ${item.tags.map(t => `<span class="news-tag">#${this._esc(t)}</span>`).join('')}
          </div>` : ''}

          ${hasInstagram ? `
          <div class="news-instagram-embed">
            <button class="btn btn-outline btn-sm" onclick="NewsSection.loadInstagram(this, '${this._esc(item.instagramUrl)}')">
              <i class="fab fa-instagram"></i> Ver post de Instagram
            </button>
            <div class="instagram-embed-container" style="display:none;"></div>
          </div>` : ''}
        </div>
      </article>
    `;
  },

  filter(category) {
    document.querySelectorAll('.news-filter-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.cat === category);
    });

    document.querySelectorAll('.news-card').forEach(card => {
      if (category === 'todas' || card.dataset.category === category) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  },

  async loadInstagram(btn, url) {
    const container = btn.nextElementSibling;
    if (container.style.display === 'block') {
      container.style.display = 'none';
      btn.innerHTML = '<i class="fab fa-instagram"></i> Ver post de Instagram';
      return;
    }

    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cargando...';
    btn.disabled = true;

    // Usar Instagram oEmbed
    const embedUrl = `https://api.instagram.com/oembed?url=${encodeURIComponent(url)}&maxwidth=500`;
    try {
      const resp = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(embedUrl)}`);
      if (resp.ok) {
        const data = await resp.json();
        container.innerHTML = data.html;
        container.style.display = 'block';
        btn.style.display = 'none';

        // Re-procesar el embed de Instagram
        if (window.instgrm) {
          window.instgrm.Embeds.process();
        }
      } else {
        // Fallback: iframe directo
        container.innerHTML = `<iframe src="https://www.instagram.com/p/${this._extractPostId(url)}/embed" 
          width="100%" height="600" frameborder="0" scrolling="no" allowtransparency="true" 
          style="border:none;border-radius:8px;max-width:500px;"></iframe>`;
        container.style.display = 'block';
        btn.style.display = 'none';
      }
    } catch (e) {
      // Fallback: embed directo
      container.innerHTML = `<iframe src="https://www.instagram.com/p/${this._extractPostId(url)}/embed" 
        width="100%" height="600" frameborder="0" scrolling="no" allowtransparency="true"
        style="border:none;border-radius:8px;max-width:500px;"></iframe>`;
      container.style.display = 'block';
      btn.style.display = 'none';
    }
  },

  _extractPostId(url) {
    const match = url.match(/\/p\/([A-Za-z0-9_-]+)/);
    return match ? match[1] : '';
  },

  _capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  },

  _esc(s) {
    if (!s) return '';
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
};

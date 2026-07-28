// ═══════════════════════════════════════════
// ADMIN PANEL — Panel de administración
// Accesible vía #admin — Edita toda la web
// ═══════════════════════════════════════════

const AdminPanel = {
  currentSection: 'general',
  config: null,

  render() {
    this.config = Store.get();
    return `
      <div class="admin-layout">
        <aside class="admin-sidebar">
          <div class="admin-sidebar-header">
            <h2>⚙️ Admin</h2>
            <a href="#home" class="btn btn-sm" style="font-size:.75rem;padding:.3rem .75rem;">← Ver sitio</a>
          </div>
          <nav class="admin-nav">
            ${this.renderNav()}
          </nav>
          <div class="admin-sidebar-footer">
            <button class="btn btn-accent btn-sm btn-block" onclick="AdminPanel.exportConfig()" style="margin-bottom:.5rem;width:100%;">
              📥 Exportar JSON
            </button>
            <button class="btn btn-outline btn-sm btn-block" onclick="AdminPanel.importConfig()" style="margin-bottom:.5rem;width:100%;">
              📤 Importar JSON
            </button>
            <button class="btn btn-sm btn-block" onclick="AdminPanel.resetConfig()" style="width:100%;background:#dc3545;color:#fff;border:none;">
              🔄 Resetear a defaults
            </button>
            <input type="file" id="importFile" accept=".json" style="display:none" onchange="AdminPanel.handleImport(event)">
          </div>
        </aside>
        <main class="admin-main" id="adminMain">
          ${this.renderSection('general')}
        </main>
      </div>
    `;
  },

  init() {
    // Navegación del admin
    document.querySelectorAll('.admin-nav a').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = link.dataset.section;
        this.showSection(section);
        document.querySelectorAll('.admin-nav a').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      });
    });
  },

  renderNav() {
    const sections = [
      { id: 'general', icon: '🏠', label: 'General' },
      { id: 'nav', icon: '📋', label: 'Navegación' },
      { id: 'hero', icon: '🎯', label: 'Hero' },
      { id: 'stats', icon: '📊', label: 'Estadísticas' },
      { id: 'help', icon: '🆘', label: 'Cómo ayudar' },
      { id: 'about', icon: '📖', label: 'Nosotros' },
      { id: 'animals', icon: '🐾', label: 'Animales' },
      { id: 'donate', icon: '💰', label: 'Donar' },
      { id: 'volunteer', icon: '🙋', label: 'Voluntariado' },
      { id: 'contact', icon: '✉️', label: 'Contacto' },
      { id: 'footer', icon: '📌', label: 'Footer' },
      { id: 'whatsapp', icon: '💬', label: 'WhatsApp' },
      { id: 'theme', icon: '🎨', label: 'Tema' }
    ];

    return sections.map(s =>
      `<a href="#" data-section="${s.id}" class="${s.id === 'general' ? 'active' : ''}">${s.icon} ${s.label}</a>`
    ).join('');
  },

  showSection(sectionId) {
    this.currentSection = sectionId;
    this.config = Store.get();
    document.getElementById('adminMain').innerHTML = this.renderSection(sectionId);
    // Re-attach events
    this.attachEvents(sectionId);
  },

  // ── Render each section form ──

  renderSection(id) {
    this.config = Store.get();
    switch (id) {
      case 'general': return this.renderGeneral();
      case 'nav': return this.renderNavEditor();
      case 'hero': return this.renderHeroEditor();
      case 'stats': return this.renderStatsEditor();
      case 'help': return this.renderHelpEditor();
      case 'about': return this.renderAboutEditor();
      case 'animals': return this.renderAnimalsEditor();
      case 'donate': return this.renderDonateEditor();
      case 'volunteer': return this.renderVolunteerEditor();
      case 'contact': return this.renderContactEditor();
      case 'footer': return this.renderFooterEditor();
      case 'whatsapp': return this.renderWhatsappEditor();
      case 'theme': return this.renderThemeEditor();
      default: return '<p>Sección no encontrada</p>';
    }
  },

  attachEvents(id) {
    // Re-attach animal-specific events
    if (id === 'animals') {
      document.querySelectorAll('.admin-animal-delete').forEach(btn => {
        btn.onclick = () => this.deleteAnimal(btn.dataset.category, parseInt(btn.dataset.index));
      });
      document.getElementById('addAnimalBtn')?.addEventListener('click', () => this.addAnimal());
    }
  },

  // ── Field Helpers ──

  textField(label, key, value, type = 'text') {
    return `<div class="admin-field">
      <label>${label}</label>
      <input type="${type}" name="${key}" value="${this.esc(value || '')}" class="admin-input">
    </div>`;
  },

  textareaField(label, key, value) {
    return `<div class="admin-field">
      <label>${label}</label>
      <textarea name="${key}" class="admin-input" rows="3">${this.esc(value || '')}</textarea>
    </div>`;
  },

  numberField(label, key, value) {
    return `<div class="admin-field">
      <label>${label}</label>
      <input type="number" name="${key}" value="${value || 0}" class="admin-input">
    </div>`;
  },

  saveButton(sectionKey = null) {
    return `<button class="btn btn-primary" style="margin-top:1rem;" onclick="AdminPanel.saveSection('${sectionKey || this.currentSection}')">
      💾 Guardar cambios
    </button>`;
  },

  esc(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  },

  // ── Section Renderers ──

  renderGeneral() {
    const s = this.config.site;
    return `<div class="admin-section">
      <h2>🏠 Configuración General</h2>
      ${this.textField('Nombre del sitio', 'site.name', s.name)}
      ${this.textField('Tagline', 'site.tagline', s.tagline)}
      ${this.textField('URL del logo', 'site.logo', s.logo)}
      ${this.textField('Google Maps URL', 'site.googleMapsUrl', s.googleMapsUrl)}
      ${this.saveButton()}
    </div>`;
  },

  renderNavEditor() {
    const items = this.config.nav.map((item, i) => `
      <div class="admin-card" style="margin-bottom:.5rem;">
        ${this.textField('Etiqueta', `nav.${i}.label`, item.label)}
        ${this.textField('ID', `nav.${i}.id`, item.id)}
        ${this.textField('Href', `nav.${i}.href`, item.href)}
      </div>
    `).join('');
    return `<div class="admin-section"><h2>📋 Navegación</h2>${items}${this.saveButton('nav')}</div>`;
  },

  renderHeroEditor() {
    const h = this.config.hero;
    return `<div class="admin-section">
      <h2>🎯 Hero</h2>
      ${this.textField('Título', 'hero.title', h.title)}
      ${this.textareaField('Subtítulo', 'hero.subtitle', h.subtitle)}
      ${this.textField('Imagen principal', 'hero.image', h.image)}
      ${this.textField('Imagen de fondo', 'hero.backgroundImage', h.backgroundImage)}
      <h4>Botones</h4>
      ${h.buttons.map((b, i) => `
        <div class="admin-card">
          ${this.textField('Texto', 'hero.buttons.' + i + '.text', b.text)}
          ${this.textField('Link', 'hero.buttons.' + i + '.href', b.href)}
        </div>
      `).join('')}
      ${this.saveButton('hero')}
    </div>`;
  },

  renderStatsEditor() {
    const items = this.config.stats.map((s, i) => `
      <div class="admin-card">
        ${this.numberField('Número objetivo', `stats.${i}.target`, s.target)}
        ${this.textField('Sufijo', `stats.${i}.suffix`, s.suffix)}
        ${this.textField('Etiqueta', `stats.${i}.label`, s.label)}
      </div>
    `).join('');
    return `<div class="admin-section"><h2>📊 Estadísticas</h2>${items}${this.saveButton('stats')}</div>`;
  },

  renderHelpEditor() {
    const cards = this.config.helpCards.map((c, i) => `
      <div class="admin-card">
        ${this.textField('Título', `helpCards.${i}.title`, c.title)}
        ${this.textField('Descripción', `helpCards.${i}.desc`, c.desc)}
        ${this.textField('Icono (Font Awesome)', `helpCards.${i}.icon`, c.icon)}
        ${this.textField('Link', `helpCards.${i}.link`, c.link)}
      </div>
    `).join('');
    return `<div class="admin-section"><h2>🆘 Cómo ayudar</h2>${cards}${this.saveButton('helpCards')}</div>`;
  },

  renderAboutEditor() {
    const a = this.config.about;
    let html = `<div class="admin-section"><h2>📖 Nosotros</h2>
      ${this.textField('Título', 'about.title', a.title)}
      ${this.textareaField('Subtítulo', 'about.subtitle', a.subtitle)}
      ${this.textField('Imagen', 'about.image', a.image)}
      ${this.textField('Video URL', 'about.videoUrl', a.videoUrl)}`;

    a.sections.forEach((s, i) => {
      html += `<div class="admin-card">
        ${this.textField('Título sección', `about.sections.${i}.title`, s.title)}`;
      s.paragraphs.forEach((p, j) => {
        html += this.textareaField(`Párrafo ${j+1}`, `about.sections.${i}.paragraphs.${j}`, p);
      });
      html += `</div>`;
    });

    html += `<h4>Objetivos</h4>`;
    a.objectives.forEach((o, i) => {
      html += this.textareaField(`Objetivo ${i+1}`, `about.objectives.${i}`, o);
    });

    html += this.saveButton('about');
    html += `</div>`;
    return html;
  },

  renderAnimalsEditor() {
    const categories = ['adopcion', 'apadrinamiento'];
    let html = '<div class="admin-section"><h2>🐾 Animales</h2>';

    categories.forEach(cat => {
      const data = this.config.animales[cat];
      html += `<h3>${data.title} (${data.items.length} animales)</h3>`;
      html += this.textField('Título sección', `animales.${cat}.title`, data.title);
      html += this.textareaField('Subtítulo', `animales.${cat}.subtitle`, data.subtitle);

      data.items.forEach((a, i) => {
        html += `<div class="admin-card">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <h4>${a.nombre}</h4>
            <button class="admin-animal-delete btn btn-sm" data-category="${cat}" data-index="${i}"
                    style="background:#dc3545;color:#fff;border:none;padding:.25rem .75rem;border-radius:4px;cursor:pointer;">
              🗑 Eliminar
            </button>
          </div>
          ${this.textField('Nombre', `animales.${cat}.items.${i}.nombre`, a.nombre)}
          ${this.textField('Tipo', `animales.${cat}.items.${i}.tipo`, a.tipo)}
          ${this.textareaField('Historia', `animales.${cat}.items.${i}.historia`, a.historia)}
          ${this.textField('Imagen', `animales.${cat}.items.${i}.imagen`, a.imagen)}
          ${this.textField('Acción', `animales.${cat}.items.${i}.accion`, a.accion)}
        </div>`;
      });
    });

    html += `<button id="addAnimalBtn" class="btn btn-accent" style="margin-top:1rem;">➕ Agregar animal (a Adopción)</button>`;
    html += this.saveButton('animales');
    html += '</div>';
    return html;
  },

  renderDonateEditor() {
    const d = this.config.donate;
    let html = `<div class="admin-section"><h2>💰 Donar</h2>
      ${this.textField('Título', 'donate.title', d.title)}
      ${this.textareaField('Subtítulo', 'donate.subtitle', d.subtitle)}
      ${this.numberField('% Progreso', 'donate.progressPercent', d.progressPercent)}
      ${this.numberField('Monto actual', 'donate.progressCurrent', d.progressCurrent)}
      ${this.numberField('Meta', 'donate.progressGoal', d.progressGoal)}`;

    d.methods.forEach((m, i) => {
      html += `<div class="admin-card">
        ${this.textField('Icono (emoji)', `donate.methods.${i}.icon`, m.icon)}
        ${this.textField('Título', `donate.methods.${i}.title`, m.title)}
        ${this.textareaField('Descripción', `donate.methods.${i}.desc`, m.desc)}
      </div>`;
    });

    html += this.saveButton('donate');
    html += '</div>';
    return html;
  },

  renderVolunteerEditor() {
    const v = this.config.volunteer;
    let html = `<div class="admin-section"><h2>🙋 Voluntariado</h2>
      ${this.textField('Título', 'volunteer.title', v.title)}
      ${this.textareaField('Subtítulo', 'volunteer.subtitle', v.subtitle)}
      ${this.textField('Video URL', 'volunteer.videoUrl', v.videoUrl)}
      ${this.textField('YouTube URL', 'volunteer.youtubeUrl', v.youtubeUrl)}
      ${this.textField('Facebook URL', 'volunteer.facebookUrl', v.facebookUrl)}
      ${this.textField('Instagram URL', 'volunteer.instagramUrl', v.instagramUrl)}
      <h4>Requisitos</h4>`;

    v.requirements.forEach((r, i) => {
      html += this.textField(`Requisito ${i+1}`, `volunteer.requirements.${i}`, r);
    });

    html += this.saveButton('volunteer');
    html += '</div>';
    return html;
  },

  renderContactEditor() {
    const c = this.config.contact;
    return `<div class="admin-section"><h2>✉️ Contacto</h2>
      ${this.textField('Título', 'contact.title', c.title)}
      ${this.textareaField('Subtítulo', 'contact.subtitle', c.subtitle)}
      ${this.textField('Formspree Endpoint', 'contact.formspreeEndpoint', c.formspreeEndpoint)}
      ${this.textField('Mensaje éxito (título)', 'contact.successTitle', c.successTitle)}
      ${this.textareaField('Mensaje éxito (texto)', 'contact.successText', c.successText)}
      ${this.saveButton('contact')}
    </div>`;
  },

  renderFooterEditor() {
    const f = this.config.footer;
    let html = `<div class="admin-section"><h2>📌 Footer</h2>
      ${this.textField('Título about', 'footer.about.title', f.about.title)}
      ${this.textareaField('Texto about', 'footer.about.text', f.about.text)}
      ${this.textField('Ubicación', 'footer.about.location', f.about.location)}
      ${this.textField('Copyright', 'footer.copyright', f.copyright)}
      <h4>Enlaces</h4>`;

    f.links.forEach((l, i) => {
      html += `<div class="admin-card">
        ${this.textField('Label', `footer.links.${i}.label`, l.label)}
        ${this.textField('Href', `footer.links.${i}.href`, l.href)}
      </div>`;
    });

    html += `<h4>Redes Sociales</h4>`;
    f.social.items.forEach((s, i) => {
      html += `<div class="admin-card">
        ${this.textField('Plataforma', `footer.social.items.${i}.platform`, s.platform)}
        ${this.textField('URL', `footer.social.items.${i}.url`, s.url)}
        ${this.textField('Icono FA', `footer.social.items.${i}.icon`, s.icon)}
      </div>`;
    });

    html += this.saveButton('footer');
    html += '</div>';
    return html;
  },

  renderWhatsappEditor() {
    const w = this.config.whatsapp;
    return `<div class="admin-section"><h2>💬 WhatsApp</h2>
      ${this.textField('Número (con código país)', 'whatsapp.number', w.number)}
      ${this.textareaField('Mensaje predeterminado', 'whatsapp.message', w.message)}
      ${this.saveButton('whatsapp')}
    </div>`;
  },

  renderThemeEditor() {
    const t = this.config.theme;
    return `<div class="admin-section"><h2>🎨 Tema</h2>
      ${this.textField('Color primario (hex)', 'theme.colors.primary', t.colors.primary)}
      ${this.textField('Color acento (hex)', 'theme.colors.accent', t.colors.accent)}
      ${this.textField('Fondo claro', 'theme.colors.bgLight', t.colors.bgLight)}
      ${this.textField('Fondo oscuro', 'theme.colors.bgDark', t.colors.bgDark)}
      ${this.saveButton('theme')}
    </div>`;
  },

  // ── CRUD Operations ──

  saveSection(sectionKey) {
    const inputs = document.querySelectorAll('.admin-input');
    const config = JSON.parse(JSON.stringify(this.config));

    inputs.forEach(input => {
      const name = input.name;
      let value = input.value;
      if (input.type === 'number') value = Number(value);
      this._setNested(config, name, value);
    });

    Store.save(config);
    this.config = config;
    this._showToast('✅ Cambios guardados');

    // Recargar la página para reflejar cambios en navbar/footer
    setTimeout(() => location.reload(), 800);
  },

  addAnimal() {
    const config = Store.get();
    config.animales.adopcion.items.push({
      nombre: 'Nuevo animal',
      tipo: 'perro',
      historia: 'Escribí la historia del animal aquí.',
      imagen: 'assets/horse card.jpg',
      accion: 'Adoptar'
    });
    Store.save(config);
    this.showSection('animals');
    this._showToast('➕ Animal agregado a Adopción');
  },

  deleteAnimal(category, index) {
    if (!confirm('¿Eliminar este animal?')) return;
    const config = Store.get();
    config.animales[category].items.splice(index, 1);
    Store.save(config);
    this.showSection('animals');
    this._showToast('🗑 Animal eliminado');
  },

  exportConfig() {
    Store.export();
    this._showToast('📥 Configuración exportada');
  },

  importConfig() {
    document.getElementById('importFile')?.click();
  },

  async handleImport(event) {
    try {
      await Store.import(event.target.files[0]);
      this._showToast('📤 Configuración importada. Recargando...');
      setTimeout(() => location.reload(), 500);
    } catch (err) {
      this._showToast('❌ Error: ' + err.message);
    }
  },

  resetConfig() {
    if (!confirm('¿Resetear TODA la configuración a los valores por defecto? Esto no se puede deshacer.')) return;
    Store.reset();
    this._showToast('🔄 Configuración reseteada. Recargando...');
    setTimeout(() => location.reload(), 500);
  },

  // ── Utilities ──

  _setNested(obj, path, value) {
    const keys = path.split('.');
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!(key in current)) current[key] = {};
      if (Array.isArray(current) && !isNaN(keys[i+1])) {
        // es array index
      }
      current = current[key];
    }
    current[keys[keys.length - 1]] = value;
  },

  _showToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'admin-toast';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => { toast.classList.add('show'); }, 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }
};

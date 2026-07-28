
// ═══════════════════════════════════════════
// ADMIN PANEL v2 — UX premium + auth
// ═══════════════════════════════════════════

const AdminPanel = {
  currentSection: 'dashboard',
  config: null,
  sidebarOpen: true,

  // ── Init ──
  init() {
    if (!Auth.isAuthenticated()) {
      this.showLogin();
      return;
    }
    this.config = Store.get();
    this.renderShell();
    this.showSection('dashboard');
    this.initSidebar();
    this.initSearch();
  },

  showLogin(error = '') {
    const main = document.getElementById('adminMain');
    if (main) {
      main.innerHTML = Auth.renderLogin(error);
      Auth.initLoginEvents();
    }
  },

  // ── Shell ──
  renderShell() {
    const main = document.getElementById('main-content');
    if (!main) return;
    const cfg = this.config;
    main.innerHTML = `<div id="adminMain">` + `
      <div class="admin-layout">
        <aside class="admin-sidebar" id="adminSidebar">
          <div class="admin-sidebar-header">
            <div class="admin-brand">
              <img src="${cfg.site.logo}" alt="Logo" onerror="this.style.display='none'">
              <div>
                <h2>Admin</h2>
                <span>${cfg.site.name}</span>
              </div>
            </div>
            <button class="admin-sidebar-toggle" onclick="AdminPanel.toggleSidebar()" title="Colapsar menú">
              <i class="fas fa-bars"></i>
            </button>
          </div>
          <nav class="admin-nav" id="adminNav">${this.renderNav()}</nav>
          <div class="admin-sidebar-footer">
            <div class="admin-user-info">
              <i class="fas fa-shield-haltered"></i>
              <span>Administrador</span>
            </div>
            <div class="admin-sidebar-actions">
              <button class="admin-btn-sm admin-btn-outline" onclick="AdminPanel.exportConfig()" title="Exportar configuración">
                📥 Exportar
              </button>
              <button class="admin-btn-sm admin-btn-outline" onclick="AdminPanel.importConfig()" title="Importar configuración">
                📤 Importar
              </button>
              <button class="admin-btn-sm admin-btn-outline" onclick="AdminPanel.showSection('password')" title="Cambiar contraseña">
                🔑 Contraseña
              </button>
              <button class="admin-btn-sm admin-btn-danger" onclick="Auth.logout()" title="Cerrar sesión">
                🚪 Salir
              </button>
            </div>
            <input type="file" id="importFile" accept=".json" style="display:none" onchange="AdminPanel.handleImport(event)">
          </div>
        </aside>
        <main class="admin-main" id="adminContent"></main>
      </div>
      <div id="adminToastContainer"></div>
    </div>`;
  },

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
    document.getElementById('adminSidebar')?.classList.toggle('collapsed', !this.sidebarOpen);
  },

  // ── Navigation ──
  renderNav() {
    const groups = [
      {
        label: 'Principal',
        items: [
          { id: 'dashboard', icon: 'fa-gauge-high', label: 'Dashboard' },
          { id: 'general', icon: 'fa-gear', label: 'Configuración' },
          { id: 'nav', icon: 'fa-list', label: 'Navegación' },
        ]
      },
      {
        label: 'Contenido',
        items: [
          { id: 'hero', icon: 'fa-image', label: 'Hero' },
          { id: 'stats', icon: 'fa-chart-simple', label: 'Estadísticas' },
          { id: 'help', icon: 'fa-hand-holding-heart', label: 'Cómo ayudar' },
          { id: 'about', icon: 'fa-book-open', label: 'Nosotros' },
          { id: 'animals', icon: 'fa-paw', label: 'Animales' },
          { id: 'donate', icon: 'fa-circle-dollar-to-slot', label: 'Donar' },
          { id: 'volunteer', icon: 'fa-people-arrows', label: 'Voluntariado' },
        ]
      },
      {
        label: 'Sistema',
        items: [
          { id: 'contact', icon: 'fa-envelope', label: 'Contacto' },
          { id: 'footer', icon: 'fa-section', label: 'Footer' },
          { id: 'whatsapp', icon: 'fa-whatsapp', label: 'WhatsApp' },
          { id: 'theme', icon: 'fa-palette', label: 'Tema' },
          { id: 'password', icon: 'fa-key', label: 'Contraseña' },
        ]
      }
    ];

    return groups.map(g => `
      <div class="admin-nav-group">
        <div class="admin-nav-group-label">${g.label}</div>
        ${g.items.map(item => `
          <a href="#" data-section="${item.id}" class="admin-nav-link" onclick="AdminPanel.showSection('${item.id}');return false;">
            <i class="fas ${item.icon}"></i>
            <span>${item.label}</span>
          </a>
        `).join('')}
      </div>
    `).join('');
  },

  initSidebar() {
    document.querySelectorAll('.admin-nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = link.dataset.section;
        this.showSection(section);
      });
    });
  },

  initSearch() {
    const searchInput = document.getElementById('adminAnimalSearch');
    if (!searchInput) return;
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      document.querySelectorAll('.admin-animal-card').forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(query) ? '' : 'none';
      });
    });
  },

  // ── Section Router ──
  showSection(sectionId) {
    if (!Auth.isAuthenticated()) { this.showLogin(); return; }
    this.currentSection = sectionId;
    this.config = Store.get();

    // Update active nav
    document.querySelectorAll('.admin-nav-link').forEach(l => l.classList.remove('active'));
    const active = document.querySelector(`.admin-nav-link[data-section="${sectionId}"]`);
    if (active) active.classList.add('active');

    const content = document.getElementById('adminContent');
    if (!content) return;

    content.innerHTML = this.renderSection(sectionId);
    this.attachEvents(sectionId);
    if (sectionId === 'animals') this.initSearch();
  },

  // ── Render Sections ──

  renderSection(id) {
    this.config = Store.get();
    const methods = {
      'dashboard': 'renderDashboard',
      'general': 'renderGeneral',
      'nav': 'renderNavEditor',
      'hero': 'renderHeroEditor',
      'stats': 'renderStatsEditor',
      'help': 'renderHelpEditor',
      'about': 'renderAboutEditor',
      'animals': 'renderAnimalsEditor',
      'donate': 'renderDonateEditor',
      'volunteer': 'renderVolunteerEditor',
      'contact': 'renderContactEditor',
      'footer': 'renderFooterEditor',
      'whatsapp': 'renderWhatsappEditor',
      'theme': 'renderThemeEditor',
      'password': 'renderPasswordEditor',
    };
    return this[methods[id]] ? this[methods[id]]() : this.renderDashboard();
  },

  attachEvents(id) {
    if (id === 'animals') {
      document.querySelectorAll('.admin-animal-delete').forEach(btn => {
        btn.onclick = () => this.deleteAnimal(btn.dataset.category, parseInt(btn.dataset.index));
      });
      document.getElementById('addAnimalBtn')?.addEventListener('click', () => this.addAnimal());
    }
  },

  // ═══ DASHBOARD ═══
  renderDashboard() {
    const c = this.config;
    const totalAnimals = c.animales.adopcion.items.length + c.animales.apadrinamiento.items.length;
    const cards = [
      { icon: 'fa-paw', value: totalAnimals, label: 'Animales', color: '#52b788' },
      { icon: 'fa-list', value: c.nav.length, label: 'Items de menú', color: '#f0a500' },
      { icon: 'fa-chart-simple', value: c.stats.length, label: 'Estadísticas', color: '#40916c' },
      { icon: 'fa-circle-dollar-to-slot', value: c.donate.progressPercent + '%', label: 'Progreso donaciones', color: '#2d6a4f' },
    ];

    return `<div class="admin-section">
      <h2><i class="fas fa-gauge-high"></i> Dashboard</h2>
      <p class="admin-section-desc">Resumen general del sitio</p>

      <div class="admin-dash-grid">
        ${cards.map(card => `
          <div class="admin-dash-card" style="border-left: 4px solid ${card.color};">
            <div class="admin-dash-card-icon" style="background:${card.color}20;color:${card.color};">
              <i class="fas ${card.icon}"></i>
            </div>
            <div class="admin-dash-card-info">
              <span class="admin-dash-card-value">${card.value}</span>
              <span class="admin-dash-card-label">${card.label}</span>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="admin-dash-sections">
        <h3>Accesos rápidos</h3>
        <div class="admin-dash-links">
          ${[
            { id:'hero', icon:'fa-image', label:'Editar Hero', desc:'Título, imágenes y botones principales' },
            { id:'animals', icon:'fa-paw', label:'Gestionar Animales', desc:`${totalAnimals} animales — Agregar, editar, eliminar` },
            { id:'donate', icon:'fa-circle-dollar-to-slot', label:'Configurar Donaciones', desc:'Métodos de pago y metas' },
            { id:'about', icon:'fa-book-open', label:'Editar Nosotros', desc:'Historia, objetivos y video' },
            { id:'contact', icon:'fa-envelope', label:'Formulario de Contacto', desc:'Formspree endpoint y mensajes' },
            { id:'theme', icon:'fa-palette', label:'Personalizar Tema', desc:'Colores y apariencia' },
          ].map(link => `
            <div class="admin-dash-link" onclick="AdminPanel.showSection('${link.id}')">
              <div class="admin-dash-link-icon"><i class="fas ${link.icon}"></i></div>
              <div class="admin-dash-link-info">
                <strong>${link.label}</strong>
                <small>${link.desc}</small>
              </div>
              <i class="fas fa-chevron-right"></i>
            </div>
          `).join('')}
        </div>
      </div>
    </div>`;
  },

  // ═══ FIELD HELPERS ═══
  textField(label, key, value, opts = {}) {
    const type = opts.type || 'text';
    const preview = opts.preview && value ? `<div class="admin-img-preview"><img src="${this.esc(value)}" onerror="this.style.display='none'" loading="lazy"></div>` : '';
    return `<div class="admin-field ${opts.wide ? 'admin-field-wide' : ''}">
      <label>${label}</label>
      ${preview}
      <input type="${type}" name="${key}" value="${this.esc(value || '')}" class="admin-input" placeholder="${opts.placeholder || ''}">
    </div>`;
  },

  textareaField(label, key, value, opts = {}) {
    return `<div class="admin-field admin-field-wide">
      <label>${label}</label>
      <textarea name="${key}" class="admin-input" rows="${opts.rows || 3}" placeholder="${opts.placeholder || ''}">${this.esc(value || '')}</textarea>
    </div>`;
  },

  numberField(label, key, value) {
    return `<div class="admin-field">
      <label>${label}</label>
      <input type="number" name="${key}" value="${value || 0}" class="admin-input">
    </div>`;
  },

  colorField(label, key, value) {
    return `<div class="admin-field">
      <label>${label}</label>
      <div class="admin-color-pick">
        <input type="color" name="${key}" value="${value || '#2d6a4f'}">
        <input type="text" name="${key}" value="${value || '#2d6a4f'}" class="admin-input" style="flex:1;">
      </div>
    </div>`;
  },

  saveButton() {
    return `<button class="admin-save-btn" onclick="AdminPanel.saveSection()">
      <i class="fas fa-floppy-disk"></i> Guardar cambios
    </button>`;
  },

  sectionHeader(title, desc = '') {
    return `<div class="admin-section-header">
      <h2>${title}</h2>
      ${desc ? `<p class="admin-section-desc">${desc}</p>` : ''}
    </div>`;
  },

  cardStart(title = '') {
    return `<div class="admin-card">
      ${title ? `<div class="admin-card-header"><h4>${title}</h4></div>` : ''}
      <div class="admin-card-body">`;
  },

  cardEnd() {
    return `</div></div>`;
  },

  esc(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  },

  // ═══ SECTION RENDERERS ═══

  renderGeneral() {
    const s = this.config.site;
    return `<div class="admin-section">
      ${this.sectionHeader('🏠 Configuración General', 'Datos básicos del sitio')}
      <div class="admin-form-grid">
        ${this.textField('Nombre del sitio', 'site.name', s.name)}
        ${this.textField('Tagline', 'site.tagline', s.tagline)}
        ${this.textField('URL del logo', 'site.logo', s.logo, {preview: true})}
        ${this.textField('Google Maps URL', 'site.googleMapsUrl', s.googleMapsUrl)}
      </div>
      ${this.saveButton()}
    </div>`;
  },

  renderNavEditor() {
    const items = this.config.nav.map((item, i) => `
      <div class="admin-card">
        <div class="admin-card-header">
          <h4>#${i + 1} — ${this.esc(item.label)}</h4>
          <span class="admin-badge">${item.href}</span>
        </div>
        <div class="admin-card-body">
          <div class="admin-form-grid">
            ${this.textField('Etiqueta', `nav.${i}.label`, item.label)}
            ${this.textField('ID', `nav.${i}.id`, item.id)}
            ${this.textField('Href', `nav.${i}.href`, item.href)}
          </div>
        </div>
      </div>
    `).join('');

    return `<div class="admin-section">
      ${this.sectionHeader('📋 Navegación', 'Menú principal del sitio')}
      ${items}
      ${this.saveButton()}
    </div>`;
  },

  renderHeroEditor() {
    const h = this.config.hero;
    return `<div class="admin-section">
      ${this.sectionHeader('🎯 Hero', 'Sección principal de la landing')}
      <div class="admin-form-grid">
        ${this.textField('Título', 'hero.title', h.title)}
        ${this.textField('Imagen principal', 'hero.image', h.image, {preview: true})}
      </div>
      ${this.textareaField('Subtítulo', 'hero.subtitle', h.subtitle, {rows: 2})}
      ${this.textField('Imagen de fondo', 'hero.backgroundImage', h.backgroundImage, {preview: true})}
      <h4 style="margin-top:1.5rem;">Botones</h4>
      ${h.buttons.map((b, i) => this.cardStart(`Botón ${i + 1}`) + `
        <div class="admin-form-grid">
          ${this.textField('Texto', 'hero.buttons.' + i + '.text', b.text)}
          ${this.textField('Link', 'hero.buttons.' + i + '.href', b.href)}
        </div>
      ` + this.cardEnd()).join('')}
      ${this.saveButton()}
    </div>`;
  },

  renderStatsEditor() {
    const items = this.config.stats.map((s, i) => this.cardStart(`Estadística ${i + 1}`) + `
      <div class="admin-form-grid">
        ${this.numberField('Número objetivo', `stats.${i}.target`, s.target)}
        ${this.textField('Sufijo', `stats.${i}.suffix`, s.suffix)}
        ${this.textField('Etiqueta', `stats.${i}.label`, s.label)}
      </div>
    ` + this.cardEnd()).join('');

    return `<div class="admin-section">
      ${this.sectionHeader('📊 Estadísticas', 'Contadores animados del sitio')}
      ${items}
      ${this.saveButton()}
    </div>`;
  },

  renderHelpEditor() {
    const cards = this.config.helpCards.map((c, i) => this.cardStart(`Tarjeta ${i + 1}: ${this.esc(c.title)}`) + `
      <div class="admin-form-grid">
        ${this.textField('Título', `helpCards.${i}.title`, c.title)}
        ${this.textField('Icono (Font Awesome)', `helpCards.${i}.icon`, c.icon)}
        ${this.textField('Descripción', `helpCards.${i}.desc`, c.desc)}
        ${this.textField('Link', `helpCards.${i}.link`, c.link)}
      </div>
    ` + this.cardEnd()).join('');

    return `<div class="admin-section">
      ${this.sectionHeader('🆘 Cómo ayudar', 'Tarjetas de la sección de ayuda')}
      ${cards}
      ${this.saveButton()}
    </div>`;
  },

  renderAboutEditor() {
    const a = this.config.about;
    let html = `<div class="admin-section">
      ${this.sectionHeader('📖 Nosotros', 'Historia, problema y objetivos')}
      <div class="admin-form-grid">
        ${this.textField('Título', 'about.title', a.title)}
        ${this.textField('Imagen', 'about.image', a.image, {preview: true})}
      </div>
      ${this.textareaField('Subtítulo', 'about.subtitle', a.subtitle)}
      ${this.textField('Video URL (YouTube embed)', 'about.videoUrl', a.videoUrl)}`;

    a.sections.forEach((s, i) => {
      html += this.cardStart(s.title);
      s.paragraphs.forEach((p, j) => {
        html += this.textareaField(`Párrafo ${j + 1}`, `about.sections.${i}.paragraphs.${j}`, p);
      });
      html += this.cardEnd();
    });

    html += this.cardStart(a.objectivesTitle);
    a.objectives.forEach((o, i) => {
      html += this.textField(`Objetivo ${i + 1}`, `about.objectives.${i}`, o);
    });
    html += this.cardEnd();
    html += this.saveButton() + '</div>';
    return html;
  },

  renderAnimalsEditor() {
    const categories = ['adopcion', 'apadrinamiento'];
    let html = `<div class="admin-section">
      ${this.sectionHeader('🐾 Animales', 'Gestioná adopción y apadrinamiento')}
      <div class="admin-toolbar">
        <div class="admin-search">
          <i class="fas fa-search"></i>
          <input type="text" id="adminAnimalSearch" placeholder="Buscar animal..." class="admin-input">
        </div>
        <button id="addAnimalBtn" class="admin-btn admin-btn-accent">
          <i class="fas fa-plus"></i> Agregar animal
        </button>
      </div>`;

    categories.forEach(cat => {
      const data = this.config.animales[cat];
      const emoji = cat === 'adopcion' ? '🏠' : '🤝';
      html += `<h3 style="margin:1.5rem 0 .75rem;">${emoji} ${data.title} <span class="admin-badge">${data.items.length}</span></h3>
        <div class="admin-form-grid">
          ${this.textField('Título sección', `animales.${cat}.title`, data.title)}
          ${this.textField('Subtítulo', `animales.${cat}.subtitle`, data.subtitle)}
        </div>`;

      html += `<div class="admin-animals-grid">`;
      data.items.forEach((a, i) => {
        html += `<div class="admin-animal-card">
          <div class="admin-animal-preview">
            <img src="${this.esc(a.imagen)}" alt="${this.esc(a.nombre)}" loading="lazy"
                 onerror="this.src='assets/horse card.jpg'">
          </div>
          <div class="admin-animal-info">
            <div class="admin-animal-header">
              <h4>${this.esc(a.nombre)}</h4>
              <div class="admin-animal-actions-top">
                <span class="admin-badge admin-badge-type">${this.esc(a.tipo)}</span>
                <button class="admin-animal-delete" data-category="${cat}" data-index="${i}" title="Eliminar">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
            ${this.textField('Nombre', `animales.${cat}.items.${i}.nombre`, a.nombre)}
            ${this.textField('Tipo', `animales.${cat}.items.${i}.tipo`, a.tipo)}
            ${this.textareaField('Historia', `animales.${cat}.items.${i}.historia`, a.historia, {rows: 2})}
            ${this.textField('Imagen', `animales.${cat}.items.${i}.imagen`, a.imagen, {preview: true})}
            ${this.textField('Texto del botón', `animales.${cat}.items.${i}.accion`, a.accion)}
          </div>
        </div>`;
      });
      html += `</div>`;
    });

    html += this.saveButton() + '</div>';
    return html;
  },

  renderDonateEditor() {
    const d = this.config.donate;
    let html = `<div class="admin-section">
      ${this.sectionHeader('💰 Donar', 'Métodos de pago y metas')}
      <div class="admin-form-grid">
        ${this.textField('Título', 'donate.title', d.title)}
        ${this.numberField('% Progreso', 'donate.progressPercent', d.progressPercent)}
      </div>
      ${this.textareaField('Subtítulo', 'donate.subtitle', d.subtitle)}
      <div class="admin-form-grid">
        ${this.numberField('Monto actual ($)', 'donate.progressCurrent', d.progressCurrent)}
        ${this.numberField('Meta ($)', 'donate.progressGoal', d.progressGoal)}
      </div>

      <h4 style="margin-top:1.5rem;">Métodos de pago</h4>
      ${d.methods.map((m, i) => this.cardStart() + `
        <div class="admin-form-grid">
          ${this.textField('Icono (emoji)', `donate.methods.${i}.icon`, m.icon)}
          ${this.textField('Título', `donate.methods.${i}.title`, m.title)}
          ${this.textareaField('Descripción', `donate.methods.${i}.desc`, m.desc)}
        </div>
      ` + this.cardEnd()).join('')}
      ${this.saveButton()}
    </div>`;
    return html;
  },

  renderVolunteerEditor() {
    const v = this.config.volunteer;
    let html = `<div class="admin-section">
      ${this.sectionHeader('🙋 Voluntariado', 'Requisitos y enlaces')}
      <div class="admin-form-grid">
        ${this.textField('Título', 'volunteer.title', v.title)}
        ${this.textField('Video URL', 'volunteer.videoUrl', v.videoUrl)}
      </div>
      ${this.textareaField('Subtítulo', 'volunteer.subtitle', v.subtitle)}
      <div class="admin-form-grid">
        ${this.textField('YouTube URL', 'volunteer.youtubeUrl', v.youtubeUrl)}
        ${this.textField('Facebook URL', 'volunteer.facebookUrl', v.facebookUrl)}
        ${this.textField('Instagram URL', 'volunteer.instagramUrl', v.instagramUrl)}
      </div>
      ${this.cardStart('Requisitos')}
      ${v.requirements.map((r, i) => this.textField(`Requisito ${i + 1}`, `volunteer.requirements.${i}`, r)).join('')}
      ${this.cardEnd()}
      ${this.saveButton()}
    </div>`;
    return html;
  },

  renderContactEditor() {
    const c = this.config.contact;
    return `<div class="admin-section">
      ${this.sectionHeader('✉️ Contacto', 'Formulario y Formspree')}
      <div class="admin-form-grid">
        ${this.textField('Título', 'contact.title', c.title)}
        ${this.textField('Formspree Endpoint', 'contact.formspreeEndpoint', c.formspreeEndpoint)}
      </div>
      ${this.textareaField('Subtítulo', 'contact.subtitle', c.subtitle)}
      <div class="admin-form-grid">
        ${this.textField('Título éxito', 'contact.successTitle', c.successTitle)}
        ${this.textareaField('Mensaje éxito', 'contact.successText', c.successText)}
      </div>
      ${this.saveButton()}
    </div>`;
  },

  renderFooterEditor() {
    const f = this.config.footer;
    let html = `<div class="admin-section">
      ${this.sectionHeader('📌 Footer', 'Pie de página y redes')}
      ${this.cardStart('Información')}
      <div class="admin-form-grid">
        ${this.textField('Título', 'footer.about.title', f.about.title)}
        ${this.textField('Ubicación', 'footer.about.location', f.about.location)}
      </div>
      ${this.textareaField('Texto', 'footer.about.text', f.about.text)}
      ${this.textField('Copyright ({year} se reemplaza)', 'footer.copyright', f.copyright)}
      ${this.cardEnd()}

      ${this.cardStart('Enlaces')}
      ${f.links.map((l, i) => `
        <div class="admin-form-grid">
          ${this.textField('Label', `footer.links.${i}.label`, l.label)}
          ${this.textField('Href', `footer.links.${i}.href`, l.href)}
        </div>
      `).join('')}
      ${this.cardEnd()}

      ${this.cardStart('Redes Sociales')}
      ${f.social.items.map((s, i) => `
        <div class="admin-form-grid">
          ${this.textField('Plataforma', `footer.social.items.${i}.platform`, s.platform)}
          ${this.textField('URL', `footer.social.items.${i}.url`, s.url)}
          ${this.textField('Icono FA', `footer.social.items.${i}.icon`, s.icon)}
        </div>
      `).join('')}
      ${this.cardEnd()}
      ${this.saveButton()}
    </div>`;
    return html;
  },

  renderWhatsappEditor() {
    const w = this.config.whatsapp;
    return `<div class="admin-section">
      ${this.sectionHeader('💬 WhatsApp', 'Botón flotante de contacto')}
      <div class="admin-form-grid">
        ${this.textField('Número (con código país)', 'whatsapp.number', w.number, {placeholder: '5493511234567'})}
      </div>
      ${this.textareaField('Mensaje predeterminado', 'whatsapp.message', w.message)}
      ${this.saveButton()}
    </div>`;
  },

  renderThemeEditor() {
    const t = this.config.theme;
    return `<div class="admin-section">
      ${this.sectionHeader('🎨 Tema', 'Colores y apariencia')}
      <div class="admin-form-grid">
        ${this.colorField('Color primario', 'theme.colors.primary', t.colors.primary)}
        ${this.colorField('Color acento', 'theme.colors.accent', t.colors.accent)}
        ${this.colorField('Fondo claro', 'theme.colors.bgLight', t.colors.bgLight)}
        ${this.colorField('Fondo oscuro', 'theme.colors.bgDark', t.colors.bgDark)}
      </div>
      <p style="color:var(--text-light);font-size:.85rem;margin-top:.5rem;">
        💡 Los cambios de color se aplican al guardar y recargar. Usá los color pickers para seleccionar.
      </p>
      ${this.saveButton()}
    </div>`;
  },

  renderPasswordEditor() {
    return `<div class="admin-section">
      ${this.sectionHeader('🔑 Cambiar Contraseña', 'Protegé el acceso al panel admin')}
      <div class="admin-card">
        <div class="admin-card-body">
          <div class="admin-form-grid">
            <div class="admin-field">
              <label>Nueva contraseña</label>
              <div class="auth-input-wrap">
                <input type="password" id="newPassword" class="admin-input" placeholder="Mínimo 8 caracteres">
                <button type="button" class="auth-toggle-pw" onclick="AdminPanel.toggleNewPw()" tabindex="-1">
                  <i class="fas fa-eye"></i>
                </button>
              </div>
            </div>
            <div class="admin-field">
              <label>Confirmar contraseña</label>
              <input type="password" id="confirmPassword" class="admin-input" placeholder="Repetí la contraseña">
            </div>
          </div>
          <div id="passwordMsg" style="margin-top:.75rem;"></div>
          <button class="admin-save-btn" onclick="AdminPanel.doChangePassword()" style="margin-top:.5rem;">
            <i class="fas fa-key"></i> Cambiar contraseña
          </button>
        </div>
      </div>
    </div>`;
  },

  toggleNewPw() {
    const input = document.getElementById('newPassword');
    const icon = document.querySelector('#newPassword + .auth-toggle-pw i, .auth-input-wrap .auth-toggle-pw i');
    if (input && icon) {
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      icon.className = isPassword ? 'fas fa-eye-slash' : 'fas fa-eye';
    }
  },

  async doChangePassword() {
    const pwd = document.getElementById('newPassword')?.value;
    const confirm = document.getElementById('confirmPassword')?.value;
    const msg = document.getElementById('passwordMsg');

    if (!pwd || pwd.length < 8) {
      if (msg) msg.innerHTML = '<span style="color:#dc3545;">❌ La contraseña debe tener al menos 8 caracteres</span>';
      return;
    }
    if (pwd !== confirm) {
      if (msg) msg.innerHTML = '<span style="color:#dc3545;">❌ Las contraseñas no coinciden</span>';
      return;
    }

    await Auth.changePassword(pwd);
    if (msg) msg.innerHTML = '<span style="color:#52b788;">✅ Contraseña cambiada correctamente</span>';
    this.showToast('🔑 Contraseña actualizada', 'success');
  },

  // ═══ CRUD ═══

  saveSection() {
    const inputs = document.querySelectorAll('.admin-input:not(#adminAnimalSearch)');
    const colorInputs = document.querySelectorAll('.admin-color-pick input[type="color"]');
    const config = JSON.parse(JSON.stringify(this.config));

    // Procesar inputs normales
    inputs.forEach(input => {
      const name = input.name;
      let value = input.value;
      if (input.type === 'number') value = Number(value);
      this._setNested(config, name, value);
    });

    // Procesar color inputs
    colorInputs.forEach(input => {
      const name = input.name;
      // El color picker cambia el valor del input text hermano
      const textInput = input.nextElementSibling;
      if (textInput) {
        this._setNested(config, name, textInput.value);
      }
    });

    Store.save(config);
    this.config = config;
    this.showToast('✅ Cambios guardados correctamente', 'success');
    setTimeout(() => location.reload(), 1000);
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
    this.showToast('➕ Animal agregado a Adopción', 'info');
  },

  deleteAnimal(category, index) {
    if (!confirm(`¿Eliminar "${this.config.animales[category].items[index].nombre}"?\n\nEsta acción no se puede deshacer.`)) return;
    const config = Store.get();
    const name = config.animales[category].items[index].nombre;
    config.animales[category].items.splice(index, 1);
    Store.save(config);
    this.showSection('animals');
    this.showToast(`🗑 "${name}" eliminado`, 'warning');
  },

  // ═══ IMPORT/EXPORT ═══

  exportConfig() {
    Store.export();
    this.showToast('📥 Configuración exportada como JSON', 'success');
  },

  importConfig() {
    document.getElementById('importFile')?.click();
  },

  async handleImport(event) {
    try {
      await Store.import(event.target.files[0]);
      this.showToast('📤 Archivo importado. Recargando...', 'info');
      setTimeout(() => location.reload(), 800);
    } catch (err) {
      this.showToast('❌ Error: ' + err.message, 'error');
    }
  },

  // ═══ UTILS ═══

  _setNested(obj, path, value) {
    const keys = path.split('.');
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!(key in current)) current[key] = isNaN(keys[i + 1]) ? {} : [];
      current = current[key];
    }
    current[keys[keys.length - 1]] = value;
  },

  showToast(msg, type = 'info') {
    const container = document.getElementById('adminToastContainer');
    if (!container) return;
    const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
    const toast = document.createElement('div');
    toast.className = `admin-toast admin-toast-${type}`;
    toast.innerHTML = `${icons[type] || ''} ${msg}`;
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
};

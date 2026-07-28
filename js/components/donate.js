const DonateSection = {
  render() {
    const cfg = Store.get();
    const d = cfg.donate;

    const methods = d.methods.map(m => `
      <div class="donate-card fade-in">
        <div class="donate-icon">${m.icon}</div>
        <h3>${m.title}</h3>
        <p>${m.desc}</p>
      </div>
    `).join('');

    return `
      <section class="section" id="donar">
        <div class="container">
          <div class="section-title">
            <h2>${d.title}</h2>
            <p>${d.subtitle}</p>
          </div>
          <div class="donate-methods">${methods}</div>
          <div class="progress-bar-wrapper fade-in">
            <h3>${d.progressTitle}</h3>
            <div class="progress-bar">
              <div class="progress-fill" id="progressFill" style="width:0%"></div>
            </div>
            <div class="progress-info">
              <span><strong>$${d.progressCurrent.toLocaleString('es-AR')}</strong> recaudados</span>
              <span>Meta: <strong>$${d.progressGoal.toLocaleString('es-AR')}</strong></span>
            </div>
            <a href="${d.ctaButton.href}" class="btn btn-${d.ctaButton.style}">
              <i class="fas ${d.ctaButton.icon}"></i> ${d.ctaButton.text}
            </a>
          </div>
        </div>
      </section>
    `;
  },

  init() {
    setTimeout(() => {
      const bar = document.getElementById('progressFill');
      if (bar) bar.style.width = Store.get().donate.progressPercent + '%';
    }, 500);
  }
};

const VolunteerSection = {
  render() {
    const cfg = Store.get();
    const v = cfg.volunteer;

    const reqs = v.requirements.map(r => `<li>${r}</li>`).join('\n');

    return `
      <section class="section" id="voluntariado" style="background: var(--bg-alt);">
        <div class="container">
          <div class="section-title">
            <h2>${v.title}</h2>
            <p>${v.subtitle}</p>
          </div>
          <div class="volunteer-grid">
            <div class="fade-in">
              <div class="requirements-box">
                <h3>📋 Requisitos</h3>
                <ul>${reqs}</ul>
              </div>
              <div style="margin-top: 2rem;">
                <h3>${v.videoTitle}</h3>
                <div class="video-wrapper" style="margin-top: 1rem;">
                  <iframe src="${v.videoUrl}" title="Experiencias de voluntarios" allowfullscreen loading="lazy"></iframe>
                </div>
                <a href="${v.youtubeUrl}" target="_blank" rel="noopener" class="btn btn-outline" style="margin-top: 1rem;">
                  <i class="fab fa-youtube"></i> Ver más en YouTube
                </a>
              </div>
            </div>
            <div class="fade-in" style="text-align: center;">
              <div style="background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 2.5rem;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">🙋</div>
                <h3 style="font-size: var(--fs-2xl); margin-bottom: 1rem;">${v.ctaTitle}</h3>
                <p style="color: var(--text-light); margin-bottom: 1.5rem;">
                  Escribinos en nuestras redes un mensaje diciendo <strong>¡QUIERO SER VOLUNTARIO!</strong>
                </p>
                <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                  <a href="${v.facebookUrl}" target="_blank" rel="noopener" class="btn btn-primary">
                    <i class="fab fa-facebook-f"></i> Facebook
                  </a>
                  <a href="${v.instagramUrl}" target="_blank" rel="noopener" class="btn btn-accent">
                    <i class="fab fa-instagram"></i> Instagram
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }
};

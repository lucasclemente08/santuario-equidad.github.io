const AboutSection = {
  render() {
    const cfg = Store.get();
    const a = cfg.about;

    const paragraphs = a.sections.map(s => {
      const ps = s.paragraphs.map(p => `<p>${p}</p>`).join('\n');
      return `<h3>${s.title}</h3>\n${ps}`;
    }).join('\n');

    const objectives = a.objectives.map(o => `<li>${o}</li>`).join('\n');

    return `
      <section class="section" id="nosotros" style="background: var(--bg-alt);">
        <div class="container">
          <div class="section-title">
            <h2>${a.title}</h2>
            <p>${a.subtitle}</p>
          </div>
          <div class="about-grid">
            <div class="about-image fade-in">
              <img src="${a.image}" alt="Historia del Santuario Equidad"
                   onerror="this.src='${a.fallbackImage}'">
            </div>
            <div class="about-text fade-in">
              ${paragraphs}
              <div class="video-wrapper">
                <iframe src="${a.videoUrl}" title="Video Santuario Equidad" allowfullscreen loading="lazy"></iframe>
              </div>
              <h3>${a.objectivesTitle}</h3>
              <ul class="objectives-list">${objectives}</ul>
              <a href="${a.ctaButton.href}" class="btn btn-${a.ctaButton.style}">
                ${a.ctaButton.text} <i class="fas ${a.ctaButton.icon}"></i>
              </a>
            </div>
          </div>
        </div>
      </section>
    `;
  }
};

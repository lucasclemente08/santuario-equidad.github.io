const Footer = {
  render() {
    const cfg = Store.get();
    const f = cfg.footer;
    const year = new Date().getFullYear();

    const socialLinks = f.social.items.map(s =>
      `<a href="${s.url}" target="_blank" rel="noopener" aria-label="${s.platform}"><i class="fab ${s.icon}"></i></a>`
    ).join('');

    const footerLinks = f.links.map(l =>
      `<li><a href="${l.href}">${l.label}</a></li>`
    ).join('');

    return `
      <footer class="footer">
        <div class="container">
          <div class="footer-grid">
            <div class="footer-about">
              <h3>${f.about.title}</h3>
              <p>${f.about.text}</p>
              <p>${f.about.location}</p>
              <a href="${cfg.site.googleMapsUrl}" target="_blank" rel="noopener">
                Ver en Google Maps <i class="fas fa-map-marker-alt"></i>
              </a>
            </div>
            <div>
              <h3>Enlaces</h3>
              <ul class="footer-links">${footerLinks}</ul>
            </div>
            <div>
              <h3>${f.social.title}</h3>
              <div class="social-links">${socialLinks}</div>
            </div>
          </div>
          <div class="footer-bottom">
            <p>${f.copyright.replace('{year}', year)}</p>
          </div>
        </div>
      </footer>
    `;
  }
};

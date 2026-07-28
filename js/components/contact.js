const ContactSection = {
  render() {
    const cfg = Store.get();
    const c = cfg.contact;

    const options = c.fields.subject.options.map((opt, i) =>
      `<option value="${i === 0 ? '' : opt.toLowerCase()}">${opt}</option>`
    ).join('\n');

    return `
      <section class="section" id="contacto">
        <div class="container">
          <div class="section-title">
            <h2>${c.title}</h2>
            <p>${c.subtitle}</p>
          </div>
          <div class="contact-wrapper fade-in">
            <div class="contact-form" id="contactFormContainer">
              <form id="contactForm" action="${c.formspreeEndpoint}" method="POST">
                <div class="form-group">
                  <label for="name">${c.fields.name.label}</label>
                  <input type="text" name="name" id="name" placeholder="Tu nombre" ${c.fields.name.required ? 'required' : ''}>
                </div>
                <div class="form-group">
                  <label for="email">${c.fields.email.label}</label>
                  <input type="email" name="email" id="email" placeholder="tu@email.com" ${c.fields.email.required ? 'required' : ''}>
                </div>
                <div class="form-group">
                  <label for="subject">${c.fields.subject.label}</label>
                  <select name="subject" id="subject">${options}</select>
                </div>
                <div class="form-group">
                  <label for="message">${c.fields.message.label}</label>
                  <textarea name="message" id="message" placeholder="Escribí tu mensaje..." ${c.fields.message.required ? 'required' : ''}></textarea>
                </div>
                <div class="form-checkbox">
                  <input type="checkbox" name="notifications" id="notifications">
                  <label for="notifications">${c.fields.notifications.label}</label>
                </div>
                <div class="form-actions">
                  <button type="submit" class="btn btn-primary"><i class="fas fa-paper-plane"></i> Enviar</button>
                  <button type="reset" class="btn btn-outline"><i class="fas fa-eraser"></i> Limpiar</button>
                </div>
              </form>
              <div class="form-success" id="formSuccess">
                <i class="fas fa-check-circle"></i>
                <h3>${c.successTitle}</h3>
                <p>${c.successText}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  init() {
    const form = document.getElementById('contactForm');
    const success = document.getElementById('formSuccess');
    if (!form) return;

    form.onsubmit = async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...'; }
      try {
        const formData = new FormData(form);
        await fetch(form.action, { method: 'POST', body: formData, headers: { 'Accept': 'application/json' } });
      } catch (err) {}
      form.style.display = 'none';
      success?.classList.add('show');
      return false;
    };
  }
};

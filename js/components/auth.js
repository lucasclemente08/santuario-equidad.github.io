
// ═══════════════════════════════════════════
// AUTH — Login seguro para panel admin
// SHA-256 + salt + sessionStorage
// ═══════════════════════════════════════════

const Auth = {
  SESSION_KEY: 'admin_session',
  // Contraseña por defecto: "Santuario2024!" (cambiable desde admin)
  DEFAULT_HASH: null, // se inicializa abajo

  async init() {
    // Hash de la contraseña default: "Santuario2024!" con salt fijo
    this.DEFAULT_HASH = await this._hash('Santuario2024!');
  },

  isAuthenticated() {
    const session = sessionStorage.getItem(this.SESSION_KEY);
    if (!session) return false;
    try {
      const data = JSON.parse(session);
      // Sesión expira en 4 horas
      return (Date.now() - data.timestamp) < 4 * 60 * 60 * 1000;
    } catch { return false; }
  },

  async login(password) {
    const cfg = Store.get();
    const storedHash = cfg.admin?.passwordHash || this.DEFAULT_HASH || await this._hash('Santuario2024!');
    const inputHash = await this._hash(password);

    if (inputHash === storedHash) {
      sessionStorage.setItem(this.SESSION_KEY, JSON.stringify({
        timestamp: Date.now()
      }));
      return true;
    }
    return false;
  },

  logout() {
    sessionStorage.removeItem(this.SESSION_KEY);
    window.location.hash = '#home';
    window.location.reload();
  },

  async changePassword(newPassword) {
    const cfg = Store.get();
    if (!cfg.admin) cfg.admin = {};
    cfg.admin.passwordHash = await this._hash(newPassword);
    Store.save(cfg);
  },

  async _hash(password) {
    const salt = 'santuario_equidad_salt_2024';
    const msgBuffer = new TextEncoder().encode(password + salt);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  },

  // ── Login Screen ──
  renderLogin(errorMsg = '') {
    return `
      <div class="auth-overlay">
        <div class="auth-card">
          <div class="auth-logo">
            <img src="${Store.get().site.logo}" alt="Logo" onerror="this.style.display='none'">
            <h1>⚙️ Panel Admin</h1>
          </div>
          <form id="loginForm" class="auth-form" onsubmit="return false;">
            <div class="auth-field">
              <label><i class="fas fa-lock"></i> Contraseña</label>
              <div class="auth-input-wrap">
                <input type="password" id="adminPassword" placeholder="Ingresá la contraseña" autofocus>
                <button type="button" class="auth-toggle-pw" onclick="Auth.togglePassword()" tabindex="-1">
                  <i class="fas fa-eye"></i>
                </button>
              </div>
            </div>
            ${errorMsg ? `<div class="auth-error">${errorMsg}</div>` : ''}
            <button type="submit" class="auth-submit" onclick="Auth.handleLogin()">
              <i class="fas fa-arrow-right-to-bracket"></i> Ingresar
            </button>
          </form>
          <p class="auth-footer">Santuario Equidad — Panel de Administración</p>
        </div>
      </div>
    `;
  },

  togglePassword() {
    const input = document.getElementById('adminPassword');
    const icon = document.querySelector('.auth-toggle-pw i');
    if (input.type === 'password') {
      input.type = 'text';
      icon.className = 'fas fa-eye-slash';
    } else {
      input.type = 'password';
      icon.className = 'fas fa-eye';
    }
  },

  async handleLogin() {
    const password = document.getElementById('adminPassword').value;
    const btn = document.querySelector('.auth-submit');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verificando...';

    // Pequeño delay anti brute-force
    await new Promise(r => setTimeout(r, 600));

    const ok = await Auth.login(password);
    if (ok) {
      document.querySelector('.auth-overlay')?.remove();
      AdminPanel.init();
    } else {
      const main = document.getElementById('adminMain');
      if (main) main.innerHTML = Auth.renderLogin('❌ Contraseña incorrecta');
      else {
        // Re-render todo el login
        const overlay = document.querySelector('.auth-overlay');
        if (overlay) overlay.outerHTML = Auth.renderLogin('❌ Contraseña incorrecta');
      }
    }
  },

  // Manejar Enter en el input
  initLoginEvents() {
    document.getElementById('adminPassword')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') Auth.handleLogin();
    });
  }
};

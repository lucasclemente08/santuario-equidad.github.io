// ═══════════════════════════════════════════
// STORE — Fuente de datos de la aplicación
// Prioridad: localStorage > DEFAULT_CONFIG
// ═══════════════════════════════════════════

const Store = {
  STORAGE_KEY: 'santuario_equidad_config',

  // Obtener config actual (localStorage o default)
  get() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge con default para asegurar que nuevas keys existan
        return this._deepMerge(DEFAULT_CONFIG, parsed);
      }
    } catch (e) {
      console.warn('Error reading config from localStorage, using defaults');
    }
    return JSON.parse(JSON.stringify(DEFAULT_CONFIG));
  },

  // Guardar config completa
  save(config) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
      console.error('Error saving config:', e);
    }
  },

  // Resetear a defaults
  reset() {
    localStorage.removeItem(this.STORAGE_KEY);
  },

  // Exportar como JSON descargable
  export() {
    const config = this.get();
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'santuario-equidad-config.json';
    a.click();
    URL.revokeObjectURL(url);
  },

  // Importar desde archivo JSON
  import(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const config = JSON.parse(e.target.result);
          this.save(config);
          resolve(config);
        } catch (err) {
          reject(new Error('Archivo JSON inválido'));
        }
      };
      reader.onerror = () => reject(new Error('Error al leer el archivo'));
      reader.readAsText(file);
    });
  },

  // Deep merge helper
  _deepMerge(target, source) {
    const result = JSON.parse(JSON.stringify(target));
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this._deepMerge(result[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    return result;
  }
};

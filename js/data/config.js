// ═══════════════════════════════════════════
// CONFIGURACIÓN CENTRAL — Santuario Equidad
// Modificá este archivo o usá el panel admin
// ═══════════════════════════════════════════

const DEFAULT_CONFIG = {
  // ── Sitio ──
  site: {
    name: "Santuario Equidad",
    tagline: "Santuario de equinos en Argentina",
    logo: "assets/logo.svg",
    favicon: "assets/logo.svg",
    lang: "es",
    googleMapsUrl: "https://www.google.com/maps/place/Santuario+Equino+EQUIDAD/@-30.6951357,-64.8459897,15z",
    year: 2022
  },

  // ── Navegación ──
  nav: [
    { id: "home", label: "Inicio", href: "#home" },
    { id: "nosotros", label: "Nosotros", href: "#nosotros" },
    { id: "donar", label: "Donar", href: "#donar" },
    { id: "apadrinar", label: "Apadrinar", href: "#apadrinar" },
    { id: "voluntariado", label: "Voluntariado", href: "#voluntariado" },
    { id: "noticias", label: "Noticias", href: "#noticias" },
    { id: "contacto", label: "Contacto", href: "#contacto" }
  ],

  // ── Hero ──
  hero: {
    title: "Somos un santuario de equinos sustituidos de la tracción a sangre en Argentina",
    subtitle: "Nuestra misión es ayudar a los animales que nos necesitan. Rescatamos, cuidamos y damos una nueva vida llena de paz y dignidad.",
    image: "assets/horse.png",
    backgroundImage: "assets/hero-donate.jpg",
    buttons: [
      { text: "Saber más", href: "#nosotros", icon: "fa-arrow-right", style: "accent" },
      { text: "Donar", href: "#donar", icon: "fa-heart", style: "outline" }
    ]
  },

  // ── Stats ──
  stats: [
    { target: 160, suffix: "+", label: "Caballos rescatados" },
    { target: 312, suffix: " ha", label: "Hectáreas de santuario" },
    { target: 12, suffix: "", label: "Años de trabajo" },
    { target: 250, suffix: "+", label: "Animales en el santuario" }
  ],

  // ── Help Cards ──
  helpCards: [
    { icon: "fa-handshake-simple", title: "Voluntariado", desc: "Sé parte del equipo de voluntariado", link: "#voluntariado", external: false },
    { icon: "fa-hand-holding-dollar", title: "Donaciones", desc: "Hacé una donación a la fundación", link: "#donar", external: false },
    { icon: "fa-paw", title: "Apadrinamiento", desc: "Apadriná un animal", link: "#apadrinar", external: false },
    { icon: "fa-bullhorn", title: "Difundí", desc: "Compartí nuestras publicaciones", link: "https://www.instagram.com/santuarioequidad/", external: true }
  ],

  // ── About / Nosotros ──
  about: {
    title: "Nosotros",
    subtitle: "Nuestra misión arrancó hace ya varios años y desde el primer día no hemos parado de intentar cambiarles la vida a los animales.",
    image: "assets/history.png",
    fallbackImage: "assets/horse-donate.jpg",
    sections: [
      {
        title: "Nuestra Historia",
        paragraphs: [
          "En 2013, la Fundación Franz Weber (FFW) creó el santuario Equidad con 10 hectáreas en San Marcos Sierras, en la Argentina Central, para combatir esta calamidad que todavía está muy extendida en América Latina.",
          "En la primavera de 2021, la FFW adquirió una propiedad más aislada y de mayor tamaño —312 hectáreas— con prados verdes, bosques, pastos de montaña y un río: el paraíso perfecto de paz, belleza y libertad para los animales."
        ]
      },
      {
        title: "El Problema",
        paragraphs: [
          "Se parten el lomo en los peligrosos barrancos de las calles latinoamericanas. En míseras condiciones, empujados y golpeados por sus propietarios, estos recogen basura, remolcan viejos carros en mal estado, sobrecargados con montañas insoportables de basura y objetos voluminosos."
        ]
      }
    ],
    videoUrl: "https://www.youtube.com/embed/zEMb91KDDl8",
    objectivesTitle: "Nuestros Objetivos",
    objectives: [
      "Desarrollo sostenible y cuidado del santuario e infraestructura, para poder seguir trayendo a más caballos.",
      "Colaboración con las autoridades para la incautación y salvación de animales maltratados.",
      "Colaboración con institutos de formación para la instrucción y sensibilización de la población.",
      "Elaboración de informes como modelo pionero en la construcción de otros santuarios similares."
    ],
    ctaButton: { text: "Hacer una donación", href: "#donar", icon: "fa-heart", style: "primary" }
  },

  // ── Animales ──
  animales: {
    adopcion: {
      title: "Adoptar",
      subtitle: "Cambiale la vida a un animal",
      id: "adoptar",
      items: [
        { nombre: "Isa", tipo: "perro", historia: "Isa es una perra que llegó al santuario con sus dos cachorras. Hasta el momento ninguna de ellas ha encontrado aún la familia que se merecen.", imagen: "assets/isa.png", accion: "Adoptar" },
        { nombre: "Nanta", tipo: "caballo", historia: "Cuando encontramos a Nanta estaba con un cuadro muy delicado, no comía ni tomaba agua por sus propios medios. La llevamos de urgencia para que pueda recibir atención médica.", imagen: "assets/nanta.png", accion: "Adoptar" },
        { nombre: "Boris", tipo: "perro", historia: "Boris es un cachorro de aproximadamente 7 meses. Cuando lo encontramos estaba caminando al costado de la ruta, y no hace falta desarrollar el peligro que implica ese contexto para cualquier animal.", imagen: "assets/dog card.png", accion: "Adoptar" },
        { nombre: "Ella", tipo: "gato", historia: "Como son tan pequeñas aún no las hemos castrado, por eso la adopción es con compromiso de castración. Si vivís en Córdoba y querés ser su familia para siempre.", imagen: "assets/catCard.png", accion: "Adoptar" },
        { nombre: "Tauro", tipo: "perro", historia: "Cuando encontramos a Tauro estaba en una caja con sus otros tres hermanos, que habían tirado en una acequia. Por fortuna ese día no habían abierto las compuertas, de lo contrario podrían haberse ahogado.", imagen: "assets/tauro.png", accion: "Adoptar" }
      ]
    },
    apadrinamiento: {
      title: "Apadrinar",
      subtitle: "Apadriná un animal y acompañalo en su nueva vida",
      id: "apadrinar",
      items: [
        { nombre: "Laura", tipo: "caballo", historia: "Antes de vivir en el santuario, Laura vivía en el ex zoológico de Colón, provincia de Buenos Aires. Su vida cambió radicalmente gracias a las gestiones de los activistas de Cerremos El Zoo y a la Municipalidad de Colón.", imagen: "assets/laura (1).png", accion: "Apadrinar" },
        { nombre: "Flor", tipo: "caballo", historia: "Flor llegó al santuario en 2014 luego de ser rescatada de uno de los incontables incendios que sufre la provincia de Córdoba. Con solo un mes de vida logró sobrevivir a una tragedia, cambiando para siempre su destino.", imagen: "assets/flor.jfif", accion: "Apadrinar" },
        { nombre: "Misky", tipo: "llama", historia: "Misky es una de las llamas que en 2018 llegó al santuario desde el Ecoparque de Buenos Aires, quienes nos seleccionaron entre diferentes espacios para que las llamas puedan disfrutar de una vida lejos del cautiverio.", imagen: "assets/llama.png", accion: "Apadrinar" },
        { nombre: "Chocolate", tipo: "llama", historia: "Chocolate llegó al santuario en 2018 junto a otras llamas. Fue seleccionado nuestro espacio para que puedan disfrutar de una vida en semilibertad, desarrollando todos sus comportamientos naturales.", imagen: "assets/chocolate.jfif", accion: "Apadrinar" },
        { nombre: "Felipe", tipo: "caballo", historia: "Felipe llegó junto a su compañera Fabiana en 2017. Nos eligieron como destino para darles una vida donde pudieran desarrollar todos sus comportamientos naturales. En la foto lo pueden ver disfrutando y recorriendo el monte a su voluntad.", imagen: "assets/Felipe.jfif", accion: "Apadrinar" },
        { nombre: "Rogelio", tipo: "vaca", historia: "Rogelio es un torito que disfruta y comparte sus días con sus amigos y amigas, todas sobrevivientes de la industria cárnica. Nos explota el pecho de alegría al verlo tan independiente y feliz.", imagen: "assets/rogelio.jpg", accion: "Apadrinar" }
      ]
    },
    adopcionMessage: "💚 Si vivís en Córdoba y sentís que querés compartir tu vida con ellos, no dudes en escribirnos por privado. Si se te complica adoptarlos pero querés hacer algo lindo por ellos, podés compartir la publicación en tus historias.",
    instagramUrl: "https://www.instagram.com/santuarioequidad/",
    fallbackImage: "assets/horse card.jpg"
  },

  // ── Donar ──
  donate: {
    title: "Donar",
    subtitle: "Donar hace que ayudar a nuestros animales sea más sencillo. Necesitamos cubrir gastos básicos.",
    methods: [
      { icon: "💳", title: "Tarjeta de crédito", desc: "Podés donar con tarjeta de crédito de forma segura." },
      { icon: "📱", title: "Mercado Pago", desc: "Doná a través de Mercado Pago. Rápido y simple." },
      { icon: "🏦", title: "Transferencia bancaria", desc: "Podés donar mediante transferencia bancaria directa." }
    ],
    progressTitle: "💰 Objetivo de recaudación mensual",
    progressPercent: 65,
    progressCurrent: 195000,
    progressGoal: 300000,
    ctaButton: { text: "Quiero donar", href: "#contacto", icon: "fa-hand-holding-heart", style: "accent" }
  },

  // ── Voluntariado ──
  volunteer: {
    title: "Voluntariado",
    subtitle: "Formá parte de nuestro equipo y colaborá con el santuario. Hay posiciones de voluntariado abiertas todo el año.",
    requirements: [
      "Ser mayor de 18 años",
      "Tener buena actitud y voluntad",
      "Disponer de 15 días, sin excepción, para trabajar en las tareas diarias y el cuidado de los animales"
    ],
    videoTitle: "🎥 Experiencias de voluntarios",
    videoUrl: "https://www.youtube.com/embed/FKnqI_jFw_U",
    youtubeUrl: "https://www.youtube.com/channel/UC6ISluyfSqt8AAE6wCAWhEA",
    ctaTitle: "¡Quiero ser Voluntario!",
    ctaText: "Escribinos en nuestras redes un mensaje diciendo **¡QUIERO SER VOLUNTARIO!**",
    facebookUrl: "https://www.facebook.com/SantuarioEquidad",
    instagramUrl: "https://www.instagram.com/santuarioequidad/"
  },

  // ── Contacto ──
  contact: {
    title: "Contactanos",
    subtitle: "Si deseas contactarnos, llena el formulario y nos pondremos en contacto contigo.",
    formspreeEndpoint: "https://formspree.io/f/xwpvqdrb",
    fields: {
      name: { label: "Nombre *", required: true },
      email: { label: "Email *", required: true },
      subject: {
        label: "Asunto",
        options: ["Seleccioná un motivo", "Voluntariado", "Donación", "Adopción / Apadrinamiento", "Otro"]
      },
      message: { label: "Mensaje *", required: true },
      notifications: { label: "¿Desea recibir notificaciones sobre la fundación?" }
    },
    successTitle: "¡Mensaje enviado!",
    successText: "Gracias por contactarnos. Te responderemos a la brevedad."
  },

  // ── Noticias / Foro ──
  noticias: {
    title: "Noticias",
    subtitle: "Enterate de las últimas novedades del santuario",
    items: [
      {
        id: 1,
        title: "¡Rescatamos 5 caballos más!",
        date: "2024-03-15",
        author: "Santuario Equidad",
        category: "rescates",
        content: "Gracias al aviso de vecinos de la zona, pudimos rescatar a 5 caballos que estaban siendo utilizados para tracción a sangre en condiciones deplorables. Ya están en el santuario recibiendo atención veterinaria.",
        image: "assets/horse-donate.jpg",
        instagramUrl: "https://www.instagram.com/p/C4abc123EXAMPLE/",
        tags: ["rescate", "caballos"]
      },
      {
        id: 2,
        title: "Nueva campaña de voluntariado 2024",
        date: "2024-02-20",
        author: "Santuario Equidad",
        category: "voluntariado",
        content: "Abrimos las inscripciones para voluntariado 2024. Buscamos personas comprometidas que quieran vivir una experiencia única ayudando a los animales. ¡Anotate!",
        image: "assets/horse-volunteer.jpg",
        instagramUrl: "",
        tags: ["voluntariado", "2024"]
      },
      {
        id: 3,
        title: "Meta de donaciones alcanzada 🎉",
        date: "2024-01-10",
        author: "Santuario Equidad",
        category: "donaciones",
        content: "Gracias a su increíble apoyo, alcanzamos la meta de recaudación para construir el nuevo establo. 40 caballos tendrán un lugar más cómodo para descansar.",
        image: "assets/horse card.jpg",
        instagramUrl: "https://www.instagram.com/p/C4def456EXAMPLE/",
        tags: ["donaciones", "logros"]
      }
    ],
    categories: ["todas", "rescates", "voluntariado", "donaciones", "eventos", "animales"]
  },

  // ── Footer ──
  footer: {
    about: {
      title: "Santuario Equidad",
      text: "Somos un santuario de equinos sustituidos de la tracción a sangre en Argentina. Nuestra misión es ayudar a los animales que nos necesitan.",
      location: "📍 Cruz del Eje, Córdoba, Argentina"
    },
    links: [
      { label: "Nosotros", href: "#nosotros" },
      { label: "Donar", href: "#donar" },
      { label: "Apadrinar", href: "#apadrinar" },
      { label: "Voluntariado", href: "#voluntariado" },
      { label: "Contacto", href: "#contacto" }
    ],
    social: {
      title: "Seguinos",
      items: [
        { platform: "facebook", icon: "fa-facebook-f", url: "https://www.facebook.com/SantuarioEquidad" },
        { platform: "instagram", icon: "fa-instagram", url: "https://www.instagram.com/santuarioequidad/" },
        { platform: "youtube", icon: "fa-youtube", url: "https://www.youtube.com/channel/UC6ISluyfSqt8AAE6wCAWhEA" }
      ]
    },
    copyright: "© {year} Santuario Equidad. Hecho con ❤️ para los animales."
  },

  // ── WhatsApp ──
  whatsapp: {
    number: "5493511234567",
    message: "Hola Santuario Equidad, quiero ayudar!"
  },

  // ── Tema ──
  theme: {
    defaultMode: "auto",
    colors: {
      primary: "#2d6a4f",
      accent: "#f0a500",
      bgLight: "#fffcf2",
      bgDark: "#121212"
    }
  }
};

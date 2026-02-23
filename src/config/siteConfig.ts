export interface SiteConfig {
  firmName: string
  firmSlogan: string
  firmDescription: string
  founderName: string
  founderTitle: string
  founderBio: string
  yearsExperience: number
  contact: {
    phone: string
    phoneDisplay: string
    email: string
    address: string
    city: string
    country: string
    officeHours: string
    whatsappNumber?: string
    googleMapsEmbedUrl: string
  }
  seo: {
    siteTitle: string
    titleTemplate: string
    defaultDescription: string
    locale: string
  }
  social: {
    facebook?: string
    instagram?: string
    linkedin?: string
    twitter?: string
  }
  navigation: {
    items: Array<{
      label: string
      href: string
      children?: Array<{ label: string; href: string }>
    }>
  }
  hero: {
    headline: string
    subheadline: string
    ctaText: string
    ctaHref: string
  }
  services: Array<{
    slug: string
    title: string
    shortDescription: string
    fullDescription: string
    icon: string
  }>
  team: Array<{
    name: string
    title: string
    bio: string
    specialties: string[]
    imageUrl?: string
    bookingSlug?: string
  }>
  legal: {
    privacyLastUpdated: string
    termsLastUpdated: string
  }
}

export const siteConfig: SiteConfig = {
  firmName: 'EstéticaApp',
  firmSlogan: 'Tu belleza, nuestra ciencia y arte',
  firmDescription: 'Plataforma líder en gestión de clínicas estéticas de lujo. Especializados en seguimiento de pacientes y agendamiento premium.',
  founderName: 'Dra. Valentina Arboleda',
  founderTitle: 'Directora Médica & Especialista en Estética',
  founderBio: 'Con más de 12 años de trayectoria, la Dra. Arboleda ha liderado la innovación en tratamientos no invasivos, enfocándose en resultados naturales y armonía facial. Su visión combina la precisión médica con la visión artística de la belleza.',
  yearsExperience: 12,

  contact: {
    phone: '+573000000000',
    phoneDisplay: '+57 300 000 0000',
    email: 'contacto@esteticaapp.com',
    address: 'Calle de la Belleza #123',
    city: 'Medellín',
    country: 'Colombia',
    officeHours: 'Lunes a Viernes: 8:00 AM - 7:00 PM',
    whatsappNumber: '+573000000000',
    googleMapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15864.846569202302!2d-75.5714392!3d6.2346747!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e4428dfb80fad05%3A0x421374a4b5b997c2!2zTWVkZWxsw61uLCBBbnRpb3F1aWE!5e0!3m2!1ses!2sco!4v1700000000000!5m2!1ses!2sco',
  },

  seo: {
    siteTitle: 'EstéticaApp | Gestión Premium de Clínicas Estéticas',
    titleTemplate: '%s | EstéticaApp',
    defaultDescription: 'Gestiona tu clínica estética con la mejor tecnología: agenda, pacientes, historial clínico y seguimientos en un solo lugar.',
    locale: 'es_CO',
  },

  social: {
    facebook: 'https://facebook.com/esteticaapp',
    instagram: 'https://instagram.com/esteticaapp',
    linkedin: 'https://linkedin.com/company/esteticaapp',
  },

  navigation: {
    items: [
      { label: 'Inicio', href: '/' },
      { label: 'Servicios', href: '/servicios' },
      { label: 'Equipo', href: '/equipo' },
      { label: 'Contacto', href: '/contacto' },
    ],
  },

  hero: {
    headline: 'Realzamos tu belleza natural con ciencia y arte',
    subheadline: 'Tratamientos estéticos de vanguardia con seguimiento personalizado para resultados excepcionales y duraderos.',
    ctaText: 'Agendar Consulta',
    ctaHref: '/contacto',
  },

  services: [
    {
      slug: 'armonizacion-facial',
      title: 'Armonización Facial',
      shortDescription: 'Equilibrio y proporción para tu rostro mediante técnicas avanzadas no invasivas.',
      fullDescription: 'Procedimiento personalizado que combina diferentes rellenos y toxinas para mejorar la estética facial sin cirugía.',
      icon: 'sparkles',
    },
    {
      slug: 'acido-hialuronico',
      title: 'Ácido Hialurónico',
      shortDescription: 'Hidratación profunda y volumen natural para labios y pómulos.',
      fullDescription: 'Tratamientos de rejuvenecimiento y voluminización con los mejores productos del mercado.',
      icon: 'syringe',
    },
    {
      slug: 'botox-premium',
      title: 'Botox Premium',
      shortDescription: 'Suaviza líneas de expresión manteniendo la naturalidad de tu gesto.',
      fullDescription: 'Aplicación experta de toxina botulínica para prevenir y tratar arrugas dinámicas.',
      icon: 'face-smile',
    },
  ],

  team: [
    {
      name: 'Dra. Valentina Arboleda',
      title: 'Directora Médica & Especialista en Estética',
      bio: 'Líder en tratamientos de armonización facial con más de una década de experiencia en el sector premium.',
      specialties: ['Armonización Facial', 'Bioestimuladores', 'Dermatología Estética'],
      bookingSlug: 'valentina-arboleda',
    },
    {
      name: 'Dr. Alejandro Marín',
      title: 'Especialista en Rejuvenecimiento',
      bio: 'Experto en técnicas avanzadas de aplicación de ácido hialurónico y toxina botulínica para resultados naturales.',
      specialties: ['Labios', 'Pómulos', 'Toxina Botulínica'],
      bookingSlug: 'alejandro-marin',
    },
  ],

  legal: {
    privacyLastUpdated: '2024-01-01',
    termsLastUpdated: '2024-01-01',
  },
}

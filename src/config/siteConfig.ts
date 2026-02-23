export interface SiteConfig {
  firmName: string
  firmSlogan: string
  firmDescription: string
  contact: {
    phone: string
    email: string
    address: string
    whatsappNumber?: string
  }
  seo: {
    siteTitle: string
    titleTemplate: string
    defaultDescription: string
    locale: string
  }
}

export const siteConfig: SiteConfig = {
  firmName: 'EstéticaApp',
  firmSlogan: 'Tu belleza, nuestra ciencia y arte',
  firmDescription: 'Plataforma líder en gestión de clínicas estéticas de lujo. Especializados en seguimiento de pacientes y agendamiento premium.',

  contact: {
    phone: '+57 300 000 0000',
    email: 'contacto@esteticaapp.com',
    address: 'Calle de la Belleza #123, Medellín, Colombia',
    whatsappNumber: '+57 300 000 0000',
  },

  seo: {
    siteTitle: 'EstéticaApp | Gestión Premium de Clínicas Estéticas',
    titleTemplate: '%s | EstéticaApp',
    defaultDescription: 'Gestiona tu clínica estética con la mejor tecnología: agenda, pacientes, historial clínico y seguimientos en un solo lugar.',
    locale: 'es_CO',
  },
}

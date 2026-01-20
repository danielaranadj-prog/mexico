import { defineCollection, z } from 'astro:content';

// 1. Colección: Destinos (V3 - Optimizado para CRO)
const destinosCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    img: z.string(),
    desc: z.string(),
    historia: z.string(),

    // ========== V3: CHECKLIST DE SUPERVIVENCIA ==========
    checklist: z.array(z.object({
      icono: z.string(),
      titulo: z.string(),
      emoji: z.string(),
      detalle: z.string(),
      cta: z.string().optional(),
      ctaLink: z.string().optional(),
      ctaRecomendado: z.boolean().optional(),
    })).optional(),

    // ========== V3: BARRIOS (con Vibra) ==========
    barrios: z.array(z.object({
      nombre: z.string(),
      vibra: z.string(),
      idealPara: z.string(),
      imagen: z.string().optional(),
      colorTag: z.string().optional(),
    })).optional(),

    // ========== V3: TOP EXPERIENCIAS (Fusionado) ==========
    experiencias: z.array(z.object({
      titulo: z.string(),
      icono: z.string(),
      tag: z.string(),
      tagColor: z.string(),
      descripcion: z.string(),
      cta: z.string().optional(),
      ctaLink: z.string().optional(),
    })).optional(),

    // ========== V3: GASTRONOMÍA ==========
    gastronomia: z.array(z.object({
      categoria: z.string(),
      lugares: z.array(z.object({
        nombre: z.string(),
        nota: z.string().optional(),
        precio: z.string(),
        link: z.string().optional(),
      })),
    })).optional(),

    // ========== V3: TRANSPORTE (mejorado) ==========
    transporte: z.object({
      aeropuerto: z.object({
        nombre: z.string(),
        distancia: z.string(),
        opciones: z.array(z.object({
          metodo: z.string(),
          tiempo: z.string(),
          precio: z.string(),
          detalle: z.string().optional(),
          link: z.string().optional(),
        })),
      }),
    }).optional(),

    // ========== V3: MAPA ==========
    mapa: z.object({
      centro: z.string(),
      zoom: z.number(),
    }).optional(),

    // ========== V3: LEAD MAGNET (mejorado) ==========
    leadMagnet: z.object({
      titulo: z.string(),
      subtitulo: z.string().optional(),
      descripcion: z.string(),
      archivo: z.string(),
      beneficios: z.array(z.string()).optional(),
      imagen: z.string().optional(),
    }).optional(),

    // ========== V3: PREMIUM GUIDE ==========
    premiumGuide: z.object({
      titulo: z.string(),
      subtitulo: z.string(),
      beneficios: z.array(z.string()),
      precioOriginal: z.string(),
      precioOferta: z.string(),
      moneda: z.string(),
      link: z.string(),
    }).optional(),

    // FAQs
    faqs: z.array(z.object({
      pregunta: z.string(),
      respuesta: z.string(),
    })).optional(),

    // Legacy fields (para compatibilidad)
    secciones: z.array(z.object({
      icon: z.string(),
      label: z.string(),
      text: z.string(),
    })).optional(),

    dashboard: z.array(z.object({
      label: z.string(),
      value: z.string(),
      icon: z.string(),
    })).optional(),

    zonas: z.array(z.object({
      nombre: z.string(),
      tipo: z.string(),
      descripcion: z.string(),
    })).optional(),

    ctas: z.array(z.object({
      titulo: z.string(),
      descripcion: z.string(),
      boton: z.string(),
      link: z.string(),
      color: z.string().optional().default('gold'),
    })).optional(),

    tours: z.array(z.object({
      titulo: z.string(),
      precio: z.string(),
      duracion: z.string(),
      link: z.string(),
      imagen: z.string().optional(),
    })).nullable().optional(),

    actividades: z.array(z.object({
      nombre: z.string(),
      icono: z.string(),
      descripcion: z.string(),
      link: z.string().optional(),
    })).optional(),

    atracciones: z.array(z.object({
      nombre: z.string(),
      zona: z.string(),
      descripcion: z.string(),
      imagen: z.string().optional(),
      gratis: z.boolean().optional(),
      precio: z.string().optional(),
      link: z.string().optional(),
    })).optional(),

    escapadas: z.array(z.object({
      nombre: z.string(),
      distancia: z.string(),
      tiempo: z.string(),
      descripcion: z.string(),
      imagen: z.string().optional(),
      link: z.string().optional(),
    })).optional(),
  }),
});

// 2. Colección: Blog
const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    description: z.string().max(160, "La descripción debe ser corta para SEO"),
    image: z.object({
      url: z.string(),
      alt: z.string()
    }),
    author: z.string().default('Instante Trips Team'),
    tags: z.array(z.string()),
    lang: z.enum(['es', 'en']),
    isSecurityAlert: z.boolean().default(false).optional(),
  }),
});

// 3. Exportamos ambas colecciones
export const collections = {
  'destinos': destinosCollection,
  'blog': blogCollection,
};
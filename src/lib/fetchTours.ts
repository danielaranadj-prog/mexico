/**
 * fetchTours.ts
 * Helper para leer tours desde Firestore en build time
 * Usado por tours.astro
 */

import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBdsu65Voj8en9u_7eL5q0YRFuCC7fUYWA",
    authDomain: "instantetrips-editor.firebaseapp.com",
    projectId: "instantetrips-editor",
};

export interface Tour {
    id: string;
    pais: string;
    ciudad: string;
    titulo: string;
    precio: string;
    duracion: string;
    imagen: string;
    linkAfiliado: string;
    activo: boolean;
}

export interface ToursData {
    argentina: Tour[];
    espana: Tour[];
    mexico: Tour[];
}

// Cache para evitar múltiples llamadas durante el build
let cachedTours: ToursData | null = null;

// Valores por defecto (tours actuales hardcoded como fallback)
const DEFAULT_TOURS: ToursData = {
    argentina: [
        { id: "tango-cena", pais: "argentina", ciudad: "buenos-aires", titulo: "Tour de Tango & Cena Show", precio: "US$ 80", duracion: "4 horas", imagen: "https://images.unsplash.com/photo-1543167822-04c9955767f4?auto=format&fit=crop&w=600&q=80", linkAfiliado: "https://www.civitatis.com/es/buenos-aires/cena-tango-buenos-aires/?aid=12345", activo: true },
        { id: "delta-tigre", pais: "argentina", ciudad: "buenos-aires", titulo: "Navegación Delta del Tigre", precio: "US$ 45", duracion: "Medio día", imagen: "https://images.unsplash.com/photo-1534234828563-0aa7cbed99b9?auto=format&fit=crop&w=600&q=80", linkAfiliado: "https://www.civitatis.com/es/buenos-aires/excursion-tigre-delta/?aid=12345", activo: true },
        { id: "boca-juniors", pais: "argentina", ciudad: "buenos-aires", titulo: "Experiencia Boca Juniors", precio: "US$ 50", duracion: "3 horas", imagen: "https://images.unsplash.com/photo-1626025437642-0b05076ca301?auto=format&fit=crop&w=600&q=80", linkAfiliado: "https://www.civitatis.com/es/buenos-aires/tour-la-boca-san-telmo/?aid=12345", activo: true },
        { id: "minitrekking", pais: "argentina", ciudad: "el-calafate", titulo: "Minitrekking Perito Moreno", precio: "US$ 250", duracion: "Día completo", imagen: "https://images.unsplash.com/photo-1518182170546-0766ce6fec56?auto=format&fit=crop&w=600&q=80", linkAfiliado: "https://www.civitatis.com/es/el-calafate/minitrekking-glaciar-perito-moreno/?aid=12345", activo: true },
        { id: "todo-glaciares", pais: "argentina", ciudad: "el-calafate", titulo: "Navegación Todo Glaciares", precio: "US$ 180", duracion: "Día completo", imagen: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80", linkAfiliado: "https://www.civitatis.com/es/el-calafate/paseo-barco-glaciares/?aid=12345", activo: true },
        { id: "estancia-cristina", pais: "argentina", ciudad: "el-calafate", titulo: "Estancia Cristina 4x4", precio: "US$ 150", duracion: "Día completo", imagen: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=600&q=80", linkAfiliado: "https://www.civitatis.com/es/el-calafate/excursion-estancia-cristina/?aid=12345", activo: true },
        { id: "fitz-roy", pais: "argentina", ciudad: "el-chalten", titulo: "Trekking Guiado Fitz Roy", precio: "US$ 90", duracion: "10 horas", imagen: "https://images.unsplash.com/photo-1589553416260-f586c8f1514f?auto=format&fit=crop&w=600&q=80", linkAfiliado: "https://www.civitatis.com/es/el-chalten/trekking-fitz-roy/?aid=12345", activo: true },
        { id: "rafting-vueltas", pais: "argentina", ciudad: "el-chalten", titulo: "Rafting Río de las Vueltas", precio: "US$ 60", duracion: "4 horas", imagen: "https://images.unsplash.com/photo-1530866495561-507c9faab2ed?auto=format&fit=crop&w=600&q=80", linkAfiliado: "https://www.civitatis.com/es/el-chalten/rafting-rio-vueltas/?aid=12345", activo: true },
        { id: "gran-aventura", pais: "argentina", ciudad: "iguazu", titulo: "Gran Aventura (Gomón)", precio: "US$ 70", duracion: "2 horas", imagen: "https://images.unsplash.com/photo-1582234032483-29479b18752c?auto=format&fit=crop&w=600&q=80", linkAfiliado: "https://www.civitatis.com/es/cataratas-iguazu/cataratas-argentina/?aid=12345", activo: true },
        { id: "lado-brasileno", pais: "argentina", ciudad: "iguazu", titulo: "Tour Lado Brasileño", precio: "US$ 45", duracion: "Medio día", imagen: "https://images.unsplash.com/photo-1534069873406-80512803b9b0?auto=format&fit=crop&w=600&q=80", linkAfiliado: "https://www.civitatis.com/es/cataratas-iguazu/cataratas-brasil/?aid=12345", activo: true },
        { id: "bodegas-lujan", pais: "argentina", ciudad: "mendoza", titulo: "Tour Bodegas Luján", precio: "US$ 110", duracion: "Día completo", imagen: "https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?auto=format&fit=crop&w=600&q=80", linkAfiliado: "https://www.civitatis.com/es/mendoza/tour-bodega-mendoza/?aid=12345", activo: true },
        { id: "alta-montana", pais: "argentina", ciudad: "mendoza", titulo: "Alta Montaña", precio: "US$ 65", duracion: "Día completo", imagen: "https://images.unsplash.com/photo-1621257492476-c4d370150993?auto=format&fit=crop&w=600&q=80", linkAfiliado: "https://www.civitatis.com/es/mendoza/excursion-alta-montana/?aid=12345", activo: true },
        { id: "canal-beagle", pais: "argentina", ciudad: "ushuaia", titulo: "Navegación Canal Beagle", precio: "US$ 70", duracion: "3 horas", imagen: "https://images.unsplash.com/photo-1548291673-30541797c552?auto=format&fit=crop&w=600&q=80", linkAfiliado: "https://www.civitatis.com/es/ushuaia/paseo-barco-canal-beagle/?aid=12345", activo: true },
        { id: "laguna-esmeralda", pais: "argentina", ciudad: "ushuaia", titulo: "Trekking Laguna Esmeralda", precio: "US$ 80", duracion: "6 horas", imagen: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=600&q=80", linkAfiliado: "https://www.civitatis.com/es/ushuaia/trekking-laguna-esmeralda/?aid=12345", activo: true },
    ],
    espana: [],
    mexico: [
         { id: "tepic-city-tour", pais: "mexico", ciudad: "tepic", titulo: "City Tour Histórico Tepic", precio: "MXN 300", duracion: "3 horas", imagen: "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?auto=format&fit=crop&w=600&q=80", linkAfiliado: "#", activo: true },
         { id: "santa-maria-oro", pais: "mexico", ciudad: "tepic", titulo: "Laguna de Santa María del Oro", precio: "MXN 800", duracion: "6 horas", imagen: "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?auto=format&fit=crop&w=600&q=80", linkAfiliado: "#", activo: true },
    ]
};

export async function fetchTours(): Promise<ToursData> {
    // Retornar cache si existe
    if (cachedTours) {
        return cachedTours;
    }

    try {
        const existingApps = getApps();
        const appName = 'tours-fetch';
        let app = existingApps.find(a => a.name === appName);

        if (!app) {
            app = initializeApp(firebaseConfig, appName);
        }

        const db = getFirestore(app);
        const docRef = doc(db, 'config', 'tours');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            cachedTours = {
                argentina: data.argentina || DEFAULT_TOURS.argentina,
                espana: data.espana || [],
                mexico: data.mexico || []
            };

            // Si Firestore está vacío para argentina, usar defaults
            if (cachedTours.argentina.length === 0) {
                cachedTours.argentina = DEFAULT_TOURS.argentina;
            }
             // Si Firestore está vacío para mexico, usar defaults
             if (cachedTours.mexico.length === 0) {
                cachedTours.mexico = DEFAULT_TOURS.mexico;
            }

            return cachedTours;
        }

        console.warn('[fetchTours] Documento config/tours no encontrado, usando valores por defecto');
        cachedTours = DEFAULT_TOURS;
        return cachedTours;

    } catch (error) {
        console.error('[fetchTours] Error:', error);
        return DEFAULT_TOURS;
    }
}

// Helper para obtener tours de un país específico
export async function getToursByCountry(country: 'argentina' | 'espana' | 'mexico'): Promise<Tour[]> {
    const tours = await fetchTours();
    return tours[country] || [];
}

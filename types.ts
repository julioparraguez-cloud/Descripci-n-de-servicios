
export interface Tramite {
  id: string;
  titulo: string;
  descripcion: string;
  requisitos: string[];
  enlace: {
    texto: string;
    url: string;
  };
}

export interface Programa {
  id: string;
  titulo: string;
  publico: string[];
  tipo: string;
  modalidad: string;
  estado?: 'últimos cupos';
  resumen: {
    costo: string;
    cupos: number;
    fechas: string;
  };
  descripcionCompleta: string;
  temario: string[];
  monitor: string;
  ubicacion: string;
  icono: string;
}

export interface Noticia {
  id: string;
  titulo: string;
  resumen: string;
  esDestacado: boolean;
  imagenUrl: string;
}

export interface JuntaVecinal {
  id: string;
  nombre: string;
  sector: string;
  directorio: string;
  contacto: string;
}

export interface FondoConcursable {
  id: string;
  nombre: string;
  estado: 'Abierto' | 'Cerrado';
  basesUrl: string;
}

export interface ConcursoPublico {
  id: string;
  titulo: string;
  descripcion: string;
  plazo: string;
  basesUrl: string;
}

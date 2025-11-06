
import type { Tramite, Programa, Noticia, JuntaVecinal, FondoConcursable, ConcursoPublico } from '../types';

const tramites: Tramite[] = [
  { id: '1', titulo: 'Permiso de Circulación', descripcion: 'Renovación anual del permiso para circular en vehículos motorizados.', requisitos: ['Revisión Técnica al día', 'Seguro Obligatorio (SOAP)', 'No tener multas impagas'], enlace: { texto: 'Pagar en Línea', url: '#' } },
  { id: '2', titulo: 'Derechos de Aseo Domiciliario', descripcion: 'Pago trimestral por el servicio de recolección de basura.', requisitos: ['Rol de la propiedad'], enlace: { texto: 'Pagar en Línea', url: '#' } },
  { id: '3', titulo: 'Patente Comercial', descripcion: 'Obtención o renovación de la patente para locales comerciales.', requisitos: ['Iniciación de actividades SII', 'Contrato de arriendo o título de dominio', 'Informe de factibilidad'], enlace: { texto: 'Ver Requisitos', url: '#' } },
  { id: '4', titulo: 'Inscripción en Registro Social de Hogares', descripcion: 'Postula para ser parte del registro que te permite acceder a beneficios sociales.', requisitos: ['Cédula de identidad', 'Comprobante de domicilio'], enlace: { texto: 'Descargar Formulario', url: '#' } },
];

const programas: Programa[] = [
  { id: 'p1', titulo: 'Taller de Alfabetización Digital para Adultos Mayores', publico: ['Adultos Mayores'], tipo: 'Taller', modalidad: 'Presencial', estado: 'últimos cupos', resumen: { costo: 'Gratuito', cupos: 5, fechas: 'Lunes y Miércoles, 10:00 - 12:00' }, descripcionCompleta: 'Aprende a usar tu smartphone y computador para comunicarte con tu familia y realizar trámites.', temario: ['Uso de WhatsApp', 'Navegación por internet', 'Correo electrónico'], monitor: 'Juan Pérez', ubicacion: 'Centro Comunitario El Sol', icono: 'laptop' },
  { id: 'p2', titulo: 'Curso de Emprendimiento Juvenil', publico: ['Jóvenes'], tipo: 'Curso', modalidad: 'Online', resumen: { costo: 'Gratuito', cupos: 30, fechas: '01/08/2024 - 30/09/2024' }, descripcionCompleta: 'Desarrolla tu idea de negocio con herramientas de marketing, finanzas y gestión.', temario: ['Modelo Canvas', 'Marketing Digital', 'Finanzas para Pymes'], monitor: 'Ana Rodriguez', ubicacion: 'Online', icono: 'rocket' },
  { id: 'p3', titulo: 'Apoyo Psicológico para Mujeres Jefas de Hogar', publico: ['Mujer', 'Familias'], tipo: 'Apoyo', modalidad: 'Híbrido', resumen: { costo: 'Gratuito', cupos: 20, fechas: 'Inscripciones abiertas' }, descripcionCompleta: 'Espacio de contención y herramientas para el manejo del estrés y la ansiedad.', temario: ['Técnicas de relajación', 'Manejo de emociones', 'Redes de apoyo'], monitor: 'Ps. Carla Soto', ubicacion: 'CESFAM Central / Online', icono: 'heart' },
  { id: 'p4', titulo: 'Subsidio de Agua Potable', publico: ['Familias'], tipo: 'Subsidio', modalidad: 'Presencial', estado: 'últimos cupos', resumen: { costo: 'Postulación', cupos: 100, fechas: 'Postulaciones hasta el 15/08' }, descripcionCompleta: 'Subsidio que cubre una parte del consumo mensual de agua potable.', temario: ['No aplica'], monitor: 'Departamento Social', ubicacion: 'Oficina de Partes Municipal', icono: 'droplet' },
];

const noticias: Noticia[] = [
  { id: 'n1', titulo: 'Exitosa jornada de vacunación contra la influenza', resumen: 'Más de 2.000 vecinos se acercaron a los puntos de vacunación dispuestos por el municipio.', esDestacado: true, imagenUrl: 'https://picsum.photos/400/300?random=1' },
  { id: 'n2', titulo: 'Nuevos horarios para el retiro de basura domiciliaria', resumen: 'A partir del próximo mes, se implementarán nuevos horarios de recolección en los sectores norte y sur.', esDestacado: true, imagenUrl: 'https://picsum.photos/400/300?random=2' },
  { id: 'n3', titulo: 'Abiertas las inscripciones para la corrida familiar', resumen: 'Participa en la tradicional corrida familiar de Fiestas Patrias. ¡Inscríbete ya!', esDestacado: true, imagenUrl: 'https://picsum.photos/400/300?random=3' },
  { id: 'n4', titulo: 'Municipio inaugura nueva área de juegos infantiles', resumen: 'La plaza central ahora cuenta con un renovado espacio para los más pequeños.', esDestacado: false, imagenUrl: 'https://picsum.photos/400/300?random=4' },
];

const juntasVecinales: JuntaVecinal[] = [
    { id: 'jv1', nombre: 'Junta de Vecinos "El Progreso"', sector: 'Norte', directorio: 'Presidente: Mario Rojas', contacto: 'jjvv.progreso@email.com' },
    { id: 'jv2', nombre: 'Junta de Vecinos "Villa Las Flores"', sector: 'Sur', directorio: 'Presidenta: Luisa Jimenez', contacto: 'jjvv.lasflores@email.com' },
];

const fondosConcursables: FondoConcursable[] = [
    { id: 'fc1', nombre: 'Fondo de Desarrollo Vecinal (FONDECO) 2024', estado: 'Abierto', basesUrl: '#' },
    { id: 'fc2', nombre: 'Fondo de Protección Ambiental', estado: 'Cerrado', basesUrl: '#' },
];

const concursosPublicos: ConcursoPublico[] = [
    { id: 'cp1', titulo: 'Concurso Público: Arquitecto para SECPLAN', descripcion: 'Se busca profesional para la Secretaría de Planificación Comunal.', plazo: '30/08/2024', basesUrl: '#' },
    { id: 'cp2', titulo: 'Concurso Público: Asistente Social para DIDECO', descripcion: 'Profesional para la Dirección de Desarrollo Comunitario.', plazo: '15/08/2024', basesUrl: '#' },
];

// Mimics Firestore's onSnapshot for real-time updates.
export const onSnapshot = <T>(collection: string, callback: (data: T[]) => void) => {
  let data: any[] = [];
  switch (collection) {
    case 'tramites':
      data = tramites;
      break;
    case 'programas':
      data = programas;
      break;
    case 'noticias':
        data = noticias;
        break;
    case 'juntasDeVecinos':
        data = juntasVecinales;
        break;
    case 'fondosConcursables':
        data = fondosConcursables;
        break;
    case 'concursos':
        data = concursosPublicos;
        break;
  }
  // Immediately call the callback with the mock data.
  callback(data as T[]);
  
  // Return a dummy unsubscribe function
  return () => {};
};

// Mimics fetching a single document
export const getDoc = async <T>(collection: string, id: string): Promise<T | undefined> => {
    let data: any[] = [];
    switch (collection) {
        case 'programas':
            data = programas;
            break;
        // add other collections if needed
    }
    const doc = data.find(item => item.id === id);
    return Promise.resolve(doc as T | undefined);
}

export const getCollections = async (collectionNames: string[]): Promise<Record<string, any[]>> => {
    const collections: Record<string, any[]> = {};
    if (collectionNames.includes('tramites')) collections['tramites'] = tramites;
    if (collectionNames.includes('programas')) collections['programas'] = programas;
    return collections;
}

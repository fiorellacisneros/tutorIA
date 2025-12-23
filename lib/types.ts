export type TipoIncidencia = 'ausencia' | 'tardanza' | 'conducta' | 'academica' | 'positivo';
export type TipoDerivacion = 'ninguna' | 'director' | 'psicologia' | 'enfermeria' | 'coordinacion' | 'orientacion';
export type SubtipoConducta = 'agresion' | 'falta_respeto' | 'interrupcion' | 'desobediencia' | 'otra';
export type SubtipoPositivo = 'ayuda_companero' | 'participacion' | 'liderazgo' | 'creatividad' | 'otro';
export type Gravedad = 'grave' | 'moderada' | 'leve';

export interface Incidencia {
  id: string;
  studentName: string;
  tipo: TipoIncidencia;
  subtipo?: SubtipoConducta | SubtipoPositivo; // Subtipo si es conducta o positivo
  gravedad: Gravedad; // Gravedad de la incidencia
  descripcion: string;
  fecha: string;
  profesor: string;
  tutor?: string; // Tutor que reporta
  lugar?: string; // Lugar donde se generó la incidencia
  timestamp: number;
  derivacion?: TipoDerivacion; // Tipo de derivación
  resuelta?: boolean; // Si ya fue resuelta
  fechaResolucion?: string; // Fecha en que se resolvió
  resueltaPor?: string; // Quién la resolvió
}

export interface Nota {
  id: string;
  studentName: string;
  materia: string;
  periodo: string; // "Q1", "Q2", "Q3", "Q4"
  nota: number;
  fecha: string;
  profesor: string;
  comentario?: string;
}

export interface EstudianteInfo {
  nombre: string;
  grado: string;
  seccion: string;
  edad?: number;
  fechaNacimiento?: string;
  fotoPerfil?: string; // URL de la foto de perfil o data URL
  contacto?: {
    telefono?: string;
    email?: string;
    tutor?: string;
  };
  asistencias?: number;
  ausencias?: number;
  tardanzas?: number;
}

export interface Tutor {
  id: string;
  nombre: string;
  email?: string;
  telefono?: string;
}

export interface ReporteIA {
  report: string;
  timestamp: string;
  demo?: boolean;
  note?: string;
  originalError?: string;
  truncated?: boolean; // Indica si el reporte fue cortado por límite de tokens
}

// Nuevos tipos para asistencia por clase
export type DiaSemana = 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes';
export type EstadoAsistencia = 'presente' | 'tardanza' | 'ausente';

export interface Clase {
  id: string;
  nombre: string; // Ej: Matemáticas
  grado: string;  // Ej: 3ro
  seccion: string; // Ej: A
  profesor: string; // Nombre del profesor asignado
  dias: DiaSemana[]; // Días en los que ocurre la clase
  periodos: number[]; // Periodos posibles (1..n)
}

export interface RegistroAsistenciaClase {
  id: string;
  fecha: string; // YYYY-MM-DD
  dia: DiaSemana;
  claseId: string;
  grado: string;
  seccion: string;
  profesor: string; // redundante para fácil consulta
  periodo: number;
  lugar?: string;
  entries: Record<string, EstadoAsistencia>; // clave: nombre del estudiante
  timestamp: number;
}


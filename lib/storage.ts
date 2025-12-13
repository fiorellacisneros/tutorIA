import { Incidencia, Nota, EstudianteInfo, TipoDerivacion, Tutor } from './types';

const STORAGE_KEY = 'tutoria_incidencias';
const NOTAS_STORAGE_KEY = 'tutoria_notas';
const ESTUDIANTES_STORAGE_KEY = 'tutoria_estudiantes';
const TUTORES_STORAGE_KEY = 'tutoria_tutores';

export function getIncidencias(): Incidencia[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
}

export function saveIncidencias(incidencias: Incidencia[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(incidencias));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

export function addIncidencia(incidencia: Omit<Incidencia, 'id' | 'timestamp'>): Incidencia {
  const incidencias = getIncidencias();
  const newIncidencia: Incidencia = {
    ...incidencia,
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    timestamp: Date.now(),
  };
  incidencias.push(newIncidencia);
  saveIncidencias(incidencias);
  return newIncidencia;
}

export function getIncidenciasByStudent(studentName: string): Incidencia[] {
  const incidencias = getIncidencias();
  return incidencias
    .filter(inc => inc.studentName.toLowerCase().includes(studentName.toLowerCase()))
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
}

export function getIncidenciasByDateRange(fechaInicio: string, fechaFin: string): Incidencia[] {
  const incidencias = getIncidencias();
  const inicio = new Date(fechaInicio).getTime();
  const fin = new Date(fechaFin).getTime();
  
  return incidencias
    .filter(inc => {
      const fechaInc = new Date(inc.fecha).getTime();
      return fechaInc >= inicio && fechaInc <= fin;
    })
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
}

export function getIncidenciasDerivadas(tipoDerivacion?: TipoDerivacion): Incidencia[] {
  const incidencias = getIncidencias();
  return incidencias
    .filter(inc => {
      const tieneDerivacion = inc.derivacion && inc.derivacion !== 'ninguna';
      const noResuelta = !inc.resuelta;
      const coincideTipo = !tipoDerivacion || inc.derivacion === tipoDerivacion;
      return tieneDerivacion && noResuelta && coincideTipo;
    })
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
}

export function marcarIncidenciaResuelta(id: string, resueltaPor: string = 'Director'): void {
  const incidencias = getIncidencias();
  const index = incidencias.findIndex(inc => inc.id === id);
  if (index !== -1) {
    incidencias[index].resuelta = true;
    incidencias[index].fechaResolucion = new Date().toISOString().split('T')[0];
    incidencias[index].resueltaPor = resueltaPor;
    saveIncidencias(incidencias);
  }
}

export function getListaEstudiantes(): Array<{ nombre: string; totalIncidencias: number; ultimaIncidencia: string }> {
  const incidencias = getIncidencias();
  const estudiantesMap = new Map<string, { incidencias: Incidencia[] }>();
  
  incidencias.forEach(inc => {
    if (!estudiantesMap.has(inc.studentName)) {
      estudiantesMap.set(inc.studentName, { incidencias: [] });
    }
    estudiantesMap.get(inc.studentName)!.incidencias.push(inc);
  });
  
  return Array.from(estudiantesMap.entries())
    .map(([nombre, data]) => {
      const incidenciasOrdenadas = data.incidencias.sort((a, b) => 
        new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
      );
      return {
        nombre,
        totalIncidencias: data.incidencias.length,
        ultimaIncidencia: incidenciasOrdenadas[0]?.fecha || '',
      };
    })
    .sort((a, b) => a.nombre.localeCompare(b.nombre));
}

export function getIncidenciasCompletasByStudent(studentName: string): Incidencia[] {
  const incidencias = getIncidencias();
  return incidencias
    .filter(inc => inc.studentName === studentName)
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
}

// Funciones para Notas
export function getNotas(): Nota[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(NOTAS_STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error reading notas from localStorage:', error);
    return [];
  }
}

export function saveNotas(notas: Nota[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(NOTAS_STORAGE_KEY, JSON.stringify(notas));
  } catch (error) {
    console.error('Error saving notas to localStorage:', error);
  }
}

export function getNotasByStudent(studentName: string): Nota[] {
  const notas = getNotas();
  return notas
    .filter(nota => nota.studentName === studentName)
    .sort((a, b) => {
      const periodoOrder = { 'Q1': 1, 'Q2': 2, 'Q3': 3, 'Q4': 4 };
      const periodoDiff = (periodoOrder[a.periodo as keyof typeof periodoOrder] || 0) - 
                          (periodoOrder[b.periodo as keyof typeof periodoOrder] || 0);
      if (periodoDiff !== 0) return periodoDiff;
      return a.materia.localeCompare(b.materia);
    });
}

// Funciones para Información de Estudiantes
export function getEstudiantesInfo(): EstudianteInfo[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(ESTUDIANTES_STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error reading estudiantes info from localStorage:', error);
    return [];
  }
}

export function saveEstudiantesInfo(estudiantes: EstudianteInfo[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ESTUDIANTES_STORAGE_KEY, JSON.stringify(estudiantes));
  } catch (error) {
    console.error('Error saving estudiantes info to localStorage:', error);
  }
}

export function getEstudianteInfo(nombre: string): EstudianteInfo | null {
  const estudiantes = getEstudiantesInfo();
  return estudiantes.find(e => e.nombre === nombre) || null;
}

export function getEstudiantesByGrado(grado?: string): EstudianteInfo[] {
  const estudiantes = getEstudiantesInfo();
  if (!grado) return estudiantes;
  return estudiantes.filter(e => e.grado === grado);
}

export function seedInitialData(): void {
  if (typeof window === 'undefined') return;
  
  const existing = getIncidencias();
  if (existing.length > 0) return; // Ya hay datos
  
  const seedData: Incidencia[] = [
    {
      id: '1',
      studentName: 'Juan Pérez',
      tipo: 'ausencia',
      descripcion: 'No asistió a clase',
      fecha: '2024-12-02',
      profesor: 'Prof. García',
      tutor: 'Prof. García',
      lugar: 'Aula 301',
      timestamp: new Date('2024-12-02').getTime(),
      derivacion: 'director',
      resuelta: false,
    },
    {
      id: '2',
      studentName: 'Juan Pérez',
      tipo: 'ausencia',
      descripcion: 'Falta sin justificar',
      fecha: '2024-12-09',
      profesor: 'Prof. García',
      tutor: 'Prof. García',
      lugar: 'Aula 301',
      timestamp: new Date('2024-12-09').getTime(),
      derivacion: 'psicologia',
      resuelta: false,
    },
    {
      id: '3',
      studentName: 'Juan Pérez',
      tipo: 'positivo',
      subtipo: 'ayuda_companero',
      descripcion: 'Ayudó a compañero en matemáticas',
      fecha: '2024-12-05',
      profesor: 'Prof. López',
      tutor: 'Prof. López',
      lugar: 'Aula 205',
      timestamp: new Date('2024-12-05').getTime(),
      derivacion: 'ninguna',
    },
    {
      id: '4',
      studentName: 'María López',
      tipo: 'academica',
      descripcion: 'No entregó tarea de ciencias',
      fecha: '2024-12-03',
      profesor: 'Prof. Fernández',
      tutor: 'Prof. Fernández',
      lugar: 'Aula 102',
      timestamp: new Date('2024-12-03').getTime(),
      derivacion: 'coordinacion',
      resuelta: false,
    },
    {
      id: '5',
      studentName: 'María López',
      tipo: 'academica',
      descripcion: 'Tarea incompleta',
      fecha: '2024-12-10',
      profesor: 'Prof. Fernández',
      tutor: 'Prof. Fernández',
      lugar: 'Aula 102',
      timestamp: new Date('2024-12-10').getTime(),
      derivacion: 'ninguna',
    },
    {
      id: '6',
      studentName: 'Carlos Ruiz',
      tipo: 'positivo',
      subtipo: 'participacion',
      descripcion: 'Excelente participación en clase',
      fecha: '2024-12-08',
      profesor: 'Prof. Torres',
      tutor: 'Prof. Torres',
      lugar: 'Aula 401',
      timestamp: new Date('2024-12-08').getTime(),
      derivacion: 'ninguna',
    },
    {
      id: '7',
      studentName: 'Carlos Ruiz',
      tipo: 'conducta',
      subtipo: 'interrupcion',
      descripcion: 'Interrumpió clase repetidamente',
      fecha: '2024-12-11',
      profesor: 'Prof. Torres',
      tutor: 'Prof. Torres',
      lugar: 'Aula 401',
      timestamp: new Date('2024-12-11').getTime(),
      derivacion: 'psicologia',
      resuelta: false,
    },
  ];
  
  saveIncidencias(seedData);
  
  // Seed datos de estudiantes (más estudiantes por grado)
  const estudiantesInfo: EstudianteInfo[] = [
    // 1ro Grado
    { nombre: 'Ana García', grado: '1ro', seccion: 'A', edad: 12, contacto: { tutor: 'Pedro García' } },
    { nombre: 'Luis Martínez', grado: '1ro', seccion: 'A', edad: 12, contacto: { tutor: 'Carmen Martínez' } },
    { nombre: 'Sofía Rodríguez', grado: '1ro', seccion: 'B', edad: 12, contacto: { tutor: 'Miguel Rodríguez' } },
    // 2do Grado
    { nombre: 'María López', grado: '2do', seccion: 'A', edad: 13, contacto: { tutor: 'Carlos López' } },
    { nombre: 'Diego Fernández', grado: '2do', seccion: 'A', edad: 13, contacto: { tutor: 'Laura Fernández' } },
    { nombre: 'Valentina Torres', grado: '2do', seccion: 'B', edad: 13, contacto: { tutor: 'Roberto Torres' } },
    // 3ro Grado
    { nombre: 'Juan Pérez', grado: '3ro', seccion: 'A', edad: 14, contacto: { tutor: 'María Pérez' } },
    { nombre: 'Isabella Sánchez', grado: '3ro', seccion: 'A', edad: 14, contacto: { tutor: 'Jorge Sánchez' } },
    { nombre: 'Mateo González', grado: '3ro', seccion: 'B', edad: 14, contacto: { tutor: 'Patricia González' } },
    // 4to Grado
    { nombre: 'Carlos Ruiz', grado: '4to', seccion: 'A', edad: 15, contacto: { tutor: 'Ana Ruiz' } },
    { nombre: 'Camila Herrera', grado: '4to', seccion: 'A', edad: 15, contacto: { tutor: 'Fernando Herrera' } },
    { nombre: 'Sebastián Morales', grado: '4to', seccion: 'B', edad: 15, contacto: { tutor: 'Diana Morales' } },
    // 5to Grado
    { nombre: 'Natalia Jiménez', grado: '5to', seccion: 'A', edad: 16, contacto: { tutor: 'Alberto Jiménez' } },
    { nombre: 'Andrés Castro', grado: '5to', seccion: 'A', edad: 16, contacto: { tutor: 'Mónica Castro' } },
  ];
  
  saveEstudiantesInfo(estudiantesInfo);
  
  // Seed datos de tutores
  const tutoresData: Tutor[] = [
    { id: 't1', nombre: 'Prof. García', email: 'garcia@colegio.edu', telefono: '+1234567890' },
    { id: 't2', nombre: 'Prof. López', email: 'lopez@colegio.edu', telefono: '+1234567891' },
    { id: 't3', nombre: 'Prof. Fernández', email: 'fernandez@colegio.edu', telefono: '+1234567892' },
    { id: 't4', nombre: 'Prof. Torres', email: 'torres@colegio.edu', telefono: '+1234567893' },
    { id: 't5', nombre: 'Prof. Martínez', email: 'martinez@colegio.edu', telefono: '+1234567894' },
    { id: 't6', nombre: 'Prof. Ramírez', email: 'ramirez@colegio.edu', telefono: '+1234567895' },
  ];
  
  saveTutores(tutoresData);
  
  // Seed notas dummy
  const notasData: Nota[] = [
    // Juan Pérez
    { id: 'n1', studentName: 'Juan Pérez', materia: 'Matemáticas', periodo: 'Q1', nota: 85, fecha: '2024-10-15', profesor: 'Prof. López', comentario: 'Buen desempeño' },
    { id: 'n2', studentName: 'Juan Pérez', materia: 'Matemáticas', periodo: 'Q2', nota: 78, fecha: '2024-11-20', profesor: 'Prof. López', comentario: 'Necesita mejorar' },
    { id: 'n3', studentName: 'Juan Pérez', materia: 'Ciencias', periodo: 'Q1', nota: 92, fecha: '2024-10-18', profesor: 'Prof. Fernández', comentario: 'Excelente' },
    { id: 'n4', studentName: 'Juan Pérez', materia: 'Ciencias', periodo: 'Q2', nota: 88, fecha: '2024-11-22', profesor: 'Prof. Fernández' },
    { id: 'n5', studentName: 'Juan Pérez', materia: 'Lengua', periodo: 'Q1', nota: 75, fecha: '2024-10-20', profesor: 'Prof. García' },
    { id: 'n6', studentName: 'Juan Pérez', materia: 'Lengua', periodo: 'Q2', nota: 80, fecha: '2024-11-25', profesor: 'Prof. García' },
    // María López
    { id: 'n7', studentName: 'María López', materia: 'Matemáticas', periodo: 'Q1', nota: 90, fecha: '2024-10-15', profesor: 'Prof. López', comentario: 'Muy buena' },
    { id: 'n8', studentName: 'María López', materia: 'Matemáticas', periodo: 'Q2', nota: 88, fecha: '2024-11-20', profesor: 'Prof. López' },
    { id: 'n9', studentName: 'María López', materia: 'Ciencias', periodo: 'Q1', nota: 65, fecha: '2024-10-18', profesor: 'Prof. Fernández', comentario: 'Requiere apoyo' },
    { id: 'n10', studentName: 'María López', materia: 'Ciencias', periodo: 'Q2', nota: 70, fecha: '2024-11-22', profesor: 'Prof. Fernández' },
    { id: 'n11', studentName: 'María López', materia: 'Lengua', periodo: 'Q1', nota: 95, fecha: '2024-10-20', profesor: 'Prof. García', comentario: 'Destacada' },
    { id: 'n12', studentName: 'María López', materia: 'Lengua', periodo: 'Q2', nota: 93, fecha: '2024-11-25', profesor: 'Prof. García' },
    // Carlos Ruiz
    { id: 'n13', studentName: 'Carlos Ruiz', materia: 'Matemáticas', periodo: 'Q1', nota: 82, fecha: '2024-10-15', profesor: 'Prof. López' },
    { id: 'n14', studentName: 'Carlos Ruiz', materia: 'Matemáticas', periodo: 'Q2', nota: 85, fecha: '2024-11-20', profesor: 'Prof. López', comentario: 'Mejorando' },
    { id: 'n15', studentName: 'Carlos Ruiz', materia: 'Ciencias', periodo: 'Q1', nota: 88, fecha: '2024-10-18', profesor: 'Prof. Fernández' },
    { id: 'n16', studentName: 'Carlos Ruiz', materia: 'Ciencias', periodo: 'Q2', nota: 90, fecha: '2024-11-22', profesor: 'Prof. Fernández', comentario: 'Excelente progreso' },
    { id: 'n17', studentName: 'Carlos Ruiz', materia: 'Lengua', periodo: 'Q1', nota: 79, fecha: '2024-10-20', profesor: 'Prof. García' },
    { id: 'n18', studentName: 'Carlos Ruiz', materia: 'Lengua', periodo: 'Q2', nota: 81, fecha: '2024-11-25', profesor: 'Prof. García' },
  ];
  
  saveNotas(notasData);
}


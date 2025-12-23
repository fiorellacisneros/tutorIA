// test_filtro_tutor.js
// Prueba automática para el filtro por nombre de tutor en estudiantes

const { getEstudiantesInfo } = require('./lib/storage');

// Simular filtro por nombre de tutor
function filtrarPorTutor(nombreTutor) {
  const estudiantes = getEstudiantesInfo();
  return estudiantes.filter(est => est.tutor && est.tutor.toLowerCase().includes(nombreTutor.toLowerCase()));
}

// Cambia el nombre aquí por un tutor real de tus datos
const nombreTutor = 'García';
const resultado = filtrarPorTutor(nombreTutor);
console.log(`Estudiantes encontrados para el tutor '${nombreTutor}':`);
console.log(resultado.map(e => e.nombre));

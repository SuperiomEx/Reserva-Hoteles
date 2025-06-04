const fs = require('fs');
const pkg = require('./package.json');

function checkSection(sectionName) {
  const section = pkg[sectionName];
  if (!section) return;
  for (const [name, version] of Object.entries(section)) {
    if (!version || typeof version !== 'string' || version.trim() === '') {
      console.log(`❌ ${sectionName} → paquete "${name}" tiene versión inválida: "${version}"`);
    }
  }
}

// Lista de secciones donde npm espera “nombre”:“versión”
const SECCIONES = [
  'dependencies',
  'devDependencies',
  'peerDependencies',
  'optionalDependencies',
  'bundleDependencies',
  'bundledDependencies',
];

console.log('🔎 Comprobando posibles versiones vacías o malformadas en package.json...');
SECCIONES.forEach(checkSection);
console.log('✅ Revisión completada.');

// Cliente HTTP de k6 para llamar a la API.
import http from 'k6/http';
// Helpers de k6 para validar respuestas y pausar entre iteraciones.
import { check, sleep } from 'k6';

// URL base configurable para apuntar a otro entorno sin cambiar el script.
const baseUrl = __ENV.BASE_URL || 'http://localhost:3001';

// Configuración de carga: 20 usuarios virtuales durante 20 segundos.
export const options = {
  vus: 20,
  duration: '20s',
};

export default function () {
  // Consulta el catálogo completo de productos.
  const res = http.get(`${baseUrl}/products`);

  // Verifica que la API responda correctamente.
  check(res, {
    'status 200': (r) => r.status === 200,
  });

  // Espera breve para simular una cadencia de usuario más realista.
  sleep(1);
}

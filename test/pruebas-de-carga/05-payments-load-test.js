// Cliente HTTP de k6 para simular la recepción de notificaciones de pago.
import http from 'k6/http';
// Helpers de k6 para validar respuestas y pausar entre iteraciones.
import { check, sleep } from 'k6';

// URL base configurable para ejecutar la prueba contra otro entorno.
const baseUrl = __ENV.BASE_URL || 'http://localhost:3001';

// Configuración de carga para el webhook de pagos.
export const options = {
  vus: 5,
  duration: '10s',
};

export default function () {
  // Usa el webhook real de pagos, que responde 200 incluso cuando no hay paymentId.
  const res = http.post(`${baseUrl}/payments/webhook`, JSON.stringify({}), {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Verifica que el webhook responda correctamente y confirme la recepción.
  check(res, {
    'payments webhook responds': (r) => r.status === 200 || r.status === 201,
    'webhook received flag returned': (r) => r.json('received') === true,
  });

  // Pequeña pausa entre iteraciones para mantener una carga estable.
  sleep(1);
}

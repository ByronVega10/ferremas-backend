/*
  Descripcion:
  Esta prueba crea un usuario temporal y luego hace login con carga,
  para probar un flujo real de acceso sin usar cuentas fijas.
  El objetivo es comprobar que el endpoint de login funciona estable
  aunque varias solicitudes lleguen al mismo tiempo.

  Resultado esperado:
  El endpoint /auth/login debe responder 200 o 201 y devolver access_token
  en cada iteración durante todo el tiempo que dura la carga.
  No deberían aparecer respuestas inválidas ni errores de consistencia.
*/

// Cliente HTTP de k6 para registrar y autenticar usuarios.
import http from 'k6/http';
// Helpers de k6 para validar respuestas y pausar entre iteraciones.
import { check, sleep } from 'k6';

// URL base configurable para ejecutar la prueba contra otro entorno.
const baseUrl = __ENV.BASE_URL || 'http://localhost:3001';

// Encabezados JSON reutilizables para los requests de autenticación.
const jsonHeaders = {
  headers: {
    'Content-Type': 'application/json',
  },
};

// Configuración de carga para el login.
export const options = {
  vus: 10,
  duration: '15s',
};

function createUniqueEmail() {
  return `k6-auth-${Date.now()}-${Math.floor(Math.random() * 1000000)}@test.local`; 
}

// Prepara un usuario real para que la prueba no dependa de credenciales fijas.
export function setup() {
  const email = createUniqueEmail();
  const password = '123456';

  // Registra el usuario de prueba y crea su carrito asociado.
  const registerResponse = http.post(
    `${baseUrl}/auth/register`,
    JSON.stringify({
      name: 'K6',
      lastname: 'Auth',
      email,
      password,
    }),
    jsonHeaders,
  );

  if (registerResponse.status !== 200 && registerResponse.status !== 201) {
    throw new Error(`No se pudo registrar el usuario de prueba: ${registerResponse.status}`);
  }

  const registerBody = registerResponse.json();

  return {
    email,
    password,
    userId: registerBody.user.id,
  };
}

export default function (data) {
  // Reutiliza las credenciales creadas en setup para probar el login real.
  const payload = JSON.stringify({
    email: data.email,
    password: data.password,
  });

  // Envía la solicitud de login al endpoint correcto.
  const res = http.post(`${baseUrl}/auth/login`, payload, jsonHeaders);

  // Valida que el login responda con éxito y entregue un token.
  check(res, {
    'login status 201 or 200': (r) => r.status === 200 || r.status === 201,
    'access token returned': (r) => !!r.json('access_token'),
  });

  // Espera breve para mantener la carga controlada.
  sleep(1);
}

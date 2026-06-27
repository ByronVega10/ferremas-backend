/*
  Descripcion:
  Esta prueba prepara un usuario con sesión iniciada y carrito con productos,
  y después ejecuta el checkout para completar el flujo de compra.
  Busca validar la parte más importante del proceso, que es crear la orden
  cuando el cliente ya decidió finalizar su compra.

  Resultado esperado:
  El endpoint /orders/checkout debe responder 200 o 201 y devolver orderId,
  sin errores de autorización ni problemas en la creación de la orden.
  Cada iteración debe terminar con una orden válida registrada por el backend.
*/

// Cliente HTTP de k6 para crear órdenes mediante checkout.
import http from 'k6/http';
// Helpers de k6 para validar respuestas y pausar entre iteraciones.
import { check, sleep } from 'k6';

// URL base configurable para ejecutar la prueba contra otro entorno.
const baseUrl = __ENV.BASE_URL || 'http://localhost:3001';

// Encabezados JSON reutilizables para requests autenticados.
const jsonHeaders = {
  headers: {
    'Content-Type': 'application/json',
  },
};

// Configuración de carga para el checkout de órdenes.
export const options = {
  vus: 8,
  duration: '15s',
};

function createUniqueEmail() {
  return `k6-orders-${Date.now()}-${Math.floor(Math.random() * 1000000)}@test.local`;
}

// Prepara un usuario con carrito lleno para que checkout tenga contexto real.
export function setup() {
  const email = createUniqueEmail();
  const password = '123456';

  // Registra el usuario de prueba; el backend crea su carrito automáticamente.
  const registerResponse = http.post(
    `${baseUrl}/auth/register`,
    JSON.stringify({
      name: 'K6',
      lastname: 'Orders',
      email,
      password,
    }),
    jsonHeaders,
  );

  if (registerResponse.status !== 200 && registerResponse.status !== 201) {
    throw new Error(`No se pudo registrar el usuario de prueba: ${registerResponse.status}`);
  }

  // Autentica al usuario para obtener el JWT que exige el checkout.
  const loginResponse = http.post(
    `${baseUrl}/auth/login`,
    JSON.stringify({ email, password }),
    jsonHeaders,
  );

  if (loginResponse.status !== 200 && loginResponse.status !== 201) {
    throw new Error(`No se pudo iniciar sesión para la prueba de órdenes: ${loginResponse.status}`);
  }

  // Obtiene un producto existente para poder llenar el carrito.
  const productsResponse = http.get(`${baseUrl}/products`);

  if (productsResponse.status !== 200) {
    throw new Error(`No se pudo leer el catálogo de productos: ${productsResponse.status}`);
  }

  const products = productsResponse.json();

  if (!Array.isArray(products) || products.length === 0) {
    throw new Error('No hay productos disponibles para la prueba de órdenes');
  }

  // Agrega un producto al carrito para que el checkout tenga contenido.
  const addToCartResponse = http.post(
    `${baseUrl}/cart/add`,
    JSON.stringify({
      userId: registerResponse.json('user.id'),
      productId: products[0].id,
      quantity: 1,
    }),
    jsonHeaders,
  );

  if (addToCartResponse.status !== 200 && addToCartResponse.status !== 201) {
    throw new Error(`No se pudo preparar el carrito de órdenes: ${addToCartResponse.status}`);
  }

  return {
    token: loginResponse.json('access_token'),
  };
}

export default function (data) {
  // Llama al endpoint real de checkout con el JWT del usuario preparado en setup.
  const res = http.post(`${baseUrl}/orders/checkout`, null, {
    headers: {
      Authorization: `Bearer ${data.token}`,
    },
  });

  // El checkout debe responder con éxito cuando el carrito tiene productos.
  check(res, {
    'checkout response 200 or 201': (r) => r.status === 200 || r.status === 201,
    'order id returned': (r) => !!r.json('orderId'),
  });

  // Pausa breve para distribuir la carga.
  sleep(1);
}

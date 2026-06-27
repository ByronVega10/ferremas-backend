/*
  Descripcion:
  Esta prueba crea un usuario temporal, busca un producto real del catálogo
  y lo agrega al carrito para simular una acción común de compra.
  Se usa carga concurrente para ver si el módulo de carrito aguanta bien
  cuando varias operaciones de agregado ocurren al mismo tiempo.

  Resultado esperado:
  El endpoint /cart/add debe responder 200 o 201 y devolver el id del item,
  mostrando que el producto se agregó correctamente al carrito.
  El servicio debe mantener la misma estructura de respuesta en todas las vueltas.
*/

// Cliente HTTP de k6 para agregar productos al carrito.
import http from 'k6/http';
// Helpers de k6 para validar respuestas y pausar entre iteraciones.
import { check, sleep } from 'k6';

// URL base configurable para ejecutar la prueba contra otro entorno.
const baseUrl = __ENV.BASE_URL || 'http://localhost:3001';

// Encabezados JSON reutilizables para los requests del carrito.
const jsonHeaders = {
  headers: {
    'Content-Type': 'application/json',
  },
};

// Configuración de carga para el carrito.
export const options = {
  vus: 15,
  duration: '20s',
};

function createUniqueEmail() {
  return `k6-cart-${Date.now()}-${Math.floor(Math.random() * 1000000)}@test.local`;
}

// Prepara un usuario y toma un producto real del catálogo para no depender de IDs fijos.
export function setup() {
  const email = createUniqueEmail();
  const password = '123456';

  // Registra el usuario de prueba; el backend crea su carrito automáticamente.
  const registerResponse = http.post(
    `${baseUrl}/auth/register`,
    JSON.stringify({
      name: 'K6',
      lastname: 'Cart',
      email,
      password,
    }),
    jsonHeaders,
  );

  if (registerResponse.status !== 200 && registerResponse.status !== 201) {
    throw new Error(`No se pudo registrar el usuario de prueba: ${registerResponse.status}`);
  }

  // Obtiene el catálogo para usar un producto existente.
  const productsResponse = http.get(`${baseUrl}/products`);

  if (productsResponse.status !== 200) {
    throw new Error(`No se pudo leer el catálogo de productos: ${productsResponse.status}`);
  }

  const products = productsResponse.json();

  if (!Array.isArray(products) || products.length === 0) {
    throw new Error('No hay productos disponibles para la prueba de carrito');
  }

  return {
    userId: registerResponse.json('user.id'),
    productId: products[0].id,
    quantity: 1,
  };
}

export default function (data) {
  // Construye el payload con un usuario y producto reales.
  const payload = JSON.stringify({
    userId: data.userId,
    productId: data.productId,
    quantity: data.quantity,
  });

  // Agrega el producto al carrito usando el endpoint correcto.
  const res = http.post(`${baseUrl}/cart/add`, payload, jsonHeaders);

  // Valida que el carrito acepte la operación correctamente.
  check(res, {
    'cart response 200 or 201': (r) => r.status === 200 || r.status === 201,
    'cart item returned': (r) => !!r.json('id'),
  });

  // Pequeña pausa entre iteraciones para evitar un patrón demasiado artificial.
  sleep(1);
}

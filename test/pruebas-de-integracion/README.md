# Pruebas de integración

Estas pruebas validan la lógica principal de los servicios del backend en aislamiento, usando mocks de Prisma y de dependencias externas como MercadoPago.

## Qué valida esta suite

Las pruebas cubren estos flujos:

1. `auth.integration.spec.ts`: registro de usuario e inicio de sesión.
2. `cart.integration.spec.ts`: creación del carrito, agregado de productos y cálculo de subtotal.
3. `orders.integration.spec.ts`: checkout y consulta de órdenes.
4. `payments.integration.spec.ts`: creación de pago y procesamiento del webhook.
5. `products.integration.spec.ts`: listado, búsqueda y operaciones básicas de productos.

## Requisitos

- Tener Node.js instalado.
- Tener las dependencias instaladas con `npm install`.
- No es necesario levantar el backend ni la base de datos para esta suite, porque los servicios usan mocks en memoria.

## Comandos importantes

Desde la raíz del proyecto puedes ejecutar toda la suite con cualquiera de estos comandos:

```bash
npm run test:integracion
```

```bash
npx jest --config ./test/jest-integration.json --runInBand
```

## Ejecutar un archivo puntual

Si quieres correr solo un spec, usa el archivo directamente:

```bash
npx jest --config ./test/jest-integration.json --runInBand test/pruebas-de-integracion/auth.integration.spec.ts
```

## Validaciones básicas

Antes de asumir que una prueba falló por la lógica del servicio, revisa lo siguiente:

- Que el spec esté dentro de `test/pruebas-de-integracion/` y termine en `.spec.ts`.
- Que `test/jest-integration.json` siga apuntando a `test/pruebas-de-integracion/**/*.spec.ts`.
- Que los mocks de Prisma incluyan los métodos que usa el servicio.
- Que los datos mockeados respeten lo que espera cada servicio.
- Que, en pagos, el mock de MercadoPago devuelva `init_point`.

## Notas

- Estas pruebas no hacen llamadas reales al backend HTTP.
- Están pensadas para validar la lógica de los servicios de NestJS sin depender de la red.
- Si agregas un nuevo servicio, crea un archivo `.spec.ts` separado siguiendo el mismo patrón.

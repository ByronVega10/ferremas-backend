# Pruebas de carga con k6

Estas pruebas cargan endpoints reales de la API de FERREMAS con datos de prueba creados en tiempo de ejecución.

## Que valida esta suite

Las pruebas miden que los endpoints respondan correctamente bajo carga y que el flujo basico de la API se mantenga funcional cuando varias iteraciones se ejecutan en paralelo.

## Requisitos

- Tener k6 instalado.
- Tener el backend corriendo, por defecto en `http://localhost:3001`.
- Tener la base de datos con datos validos para que existan productos y se puedan crear usuarios de prueba.
- Si vas a probar en otro ambiente, definir `BASE_URL` con la URL correcta.

	Ejemplo:

	```bash
	$env:BASE_URL="https://api.tu-dominio.com"
	k6 run test/pruebas-de-carga/01-products-load-test.js
	```

## Comandos importantes

Desde la raiz del proyecto puedes correr cualquier script con `k6 run`:

```bash
k6 run test/pruebas-de-carga/01-products-load-test.js
```

Para apuntar a otro backend desde PowerShell:

```bash
$env:BASE_URL="http://localhost:3001"
k6 run test/pruebas-de-carga/02-auth-load-test.js
```

Para ejecutar una prueba puntual con otra URL base:

```bash
$env:BASE_URL="http://localhost:3001"
k6 run test/pruebas-de-carga/04-orders-load-test.js
```

## Pruebas incluidas

1. `01-products-load-test.js`: consulta el catalogo de productos con carga continua.
2. `02-auth-load-test.js`: registra un usuario temporal e inicia sesion para validar el login.
3. `03-cart-load-test.js`: crea un usuario temporal y agrega un producto real al carrito.
4. `04-orders-load-test.js`: crea usuario, login, carrito y ejecuta checkout con JWT.
5. `05-payments-load-test.js`: llama al webhook de pagos y valida que reciba la notificacion.

## Validaciones basicas

Antes de asumir que una prueba falló, revisa lo siguiente:

- Que k6 este instalado y accesible desde la terminal.
- Que el backend este levantado y respondiendo en la URL esperada.
- Que `BASE_URL` apunte al entorno correcto si no usas localhost.
- Que la API tenga productos disponibles para que las pruebas de carrito y orden puedan usar un producto real.
- Que el usuario temporal se pueda registrar sin chocar con un correo existente.
- Que el webhook de pagos responda con el formato esperado por la prueba.

## Detalle de ejecucion

Las pruebas de auth, carrito y orden crean sus propios datos en tiempo de ejecucion para evitar depender de IDs fijos o credenciales hardcodeadas.

El script de pagos prueba el webhook real de la API, por lo que no necesita frontend ni una pasarela real para validar la respuesta basica del endpoint.

## Notas

- Los scripts usan comentarios en el codigo para explicar cada bloque.
- Puedes cambiar `BASE_URL` sin editar los archivos de prueba.
- Si agregas una nueva prueba, sigue el mismo patron y deja el archivo dentro de `test/pruebas-de-carga/`.

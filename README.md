# 🛠️ FERREMAS E-Commerce

Sistema E-Commerce Full Stack desarrollado para FERREMAS, permitiendo la gestión de productos, categorías, autenticación de usuarios, carrito de compras, órdenes de compra e integración con pasarela de pagos Mercado Pago.

---

# 🚀 Demo

### Frontend

https://ferremas-frontend.vercel.app

### Backend API

https://ferremas-backend-04w4.onrender.com

### Swagger

https://ferremas-backend-04w4.onrender.com/api

---

# 📌 Características principales

El sistema permite:

### Clientes

* Registro de usuarios
* Inicio de sesión mediante JWT
* Visualización de productos
* Filtrado por categorías
* Visualización de precios en:

  * Pesos Chilenos (CLP)
  * Dólares Estadounidenses (USD)
  * Euros (EUR)
* Carrito de compras
* Checkout
* Pago mediante Mercado Pago Sandbox
* Historial de órdenes

### Administradores

* Gestión de productos
* Crear productos
* Editar productos
* Eliminar productos
* Gestión de categorías
* Acceso protegido mediante Roles

---

# 🏗 Arquitectura

El proyecto está desarrollado bajo una arquitectura modular basada en NestJS.

Backend

NestJS

↓

Módulos

↓

Prisma ORM

↓

PostgreSQL (Render)

Frontend

NextJS

↓

Context API

↓

Axios

↓

Backend API

---

# Tecnologías utilizadas

## Backend

NestJS 11

TypeScript

Prisma ORM

PostgreSQL

JWT

Passport

Swagger

Mercado Pago SDK

Class Validator

Axios

---

## Frontend

Next.js 15

React

TailwindCSS

Axios

Context API

JWT Decode

---

## Base de Datos

PostgreSQL

Render Database

---

## Deploy

Frontend

Vercel

Backend

Render

Base de datos

Render PostgreSQL

---

# 📂 Estructura Backend

```text
src

auth
cart
categories
exchange
orders
payments
products
users
prisma

app.module.ts
main.ts
```

Cada módulo posee:

Controller

Service

DTO

Module

---

# 🔐 Autenticación

El sistema utiliza:

JWT

Passport

Roles

Roles disponibles:

CUSTOMER

ADMIN

Ejemplo Token:

```json
{
"userId":1,
"email":"admin@test.cl",
"role":"ADMIN"
}
```

Endpoints protegidos requieren:

```text
Bearer TOKEN
```

---

# 🛒 Flujo de Compra

Usuario inicia sesión

↓

Agrega productos

↓

Carrito

↓

Checkout

↓

Se crea Order

↓

Mercado Pago

↓

Webhook

↓

Actualización Stock

↓

Order → PAID

---

# 💳 Integración Mercado Pago

Se utiliza:

MercadoPago SDK v2

Sandbox Environment

Características:

Checkout Pro

Webhook

Notificaciones automáticas

Actualización de stock

---

# 🌎 Conversión de Divisas

FERREMAS permite visualizar precios en:

CLP

USD

EUR

Endpoints:

```http
GET /exchange/usd

GET /exchange/euro
```

Utilidad:

Visualización internacional

Comparación de precios

Experiencia de usuario

---

# 📖 Swagger

Swagger se encuentra disponible en:

```text
/ api
```

Incluye:

JWT Authentication

DTO Examples

Request Bodies

Response Examples

Descriptions

Protected Endpoints

---

# 🗄 Base de Datos

ORM:

Prisma

Migraciones:

Prisma Migrate

Seed:

```bash
npx prisma db seed
```

Incluye:

3 Categorías

6 Productos

---

# ⚙ Variables de entorno

Backend

```env

DATABASE_URL=

JWT_SECRET=

MERCADOPAGO_ACCESS_TOKEN=

FRONTEND_URL=

BACKEND_URL=

PORT=3001

```

Frontend

```env

NEXT_PUBLIC_API_URL=

```

---

# 🚀 Instalación Local

## Backend

Instalar dependencias

```bash
npm install
```

Generar Prisma Client

```bash
npx prisma generate
```

Crear tablas

```bash
npx prisma db push
```

Poblar Base de Datos

```bash
npx prisma db seed
```

Ejecutar proyecto

```bash
npm run start:dev
```

Swagger

```text
http://localhost:3001/api
```

---

## Frontend

Instalar dependencias

```bash
npm install
```

Ejecutar

```bash
npm run dev
```

Aplicación

```text
http://localhost:3000
```

---

# 📌 Mejoras Futuras

Panel Administrativo

Subida de imágenes a Cloudinary

Descuentos dinámicos

Favoritos

Búsqueda avanzada

Paginación

Dashboard Analytics

Correos transaccionales

Dockerización

CI/CD con GitHub Actions

---

# 👨‍💻 Autor

Byron Vega

Proyecto académico desarrollado para FERREMAS.

2026

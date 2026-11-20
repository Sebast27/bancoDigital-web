# 🏦 Banco Digital - Full Stack App

Aplicación bancaria completa (Home Banking) que simula un entorno de Core Banking real, con procesamiento asíncrono, separación de roles y una interfaz de usuario premium.

## 🚀 Demo en Vivo
- **Frontend (Vercel):** [https://tu-link-de-vercel.app](https://tu-link-de-vercel.app)
- **Backend API (Render):** [https://bancodigital-app.onrender.com/api/docs](https://bancodigital-app.onrender.com/api/docs)

*(Nota: El backend usa el plan gratuito de Render, por lo que puede tardar ~40 segundos en "despertar" tras un periodo de inactividad).*

## 📸 Capturas de Pantalla
*(Aquí debes subir las fotos que me enviaste: El Dashboard oscuro, el Panel de Control de Admin, el Formulario de Transferencias paso a paso).*
<!-- Ejemplo: -->
<!-- ![Login](ruta-a-tu-imagen.png) -->

## 🛠️ Tecnologías y Arquitectura

**Frontend:**
- React 18 + TypeScript + Vite
- Tailwind CSS (Diseño responsivo y moderno)
- TanStack Query (Manejo de estado asíncrono y Polling)
- React Router v6 (Rutas protegidas por roles)
- Sonner (Notificaciones Toast)

**Backend:**
- NestJS + TypeScript (Arquitectura Hexagonal)
- PostgreSQL + Prisma ORM
- Redis + BullMQ (Colas y Workers asíncronos)
- JWT (Autenticación con Access y Refresh Tokens)
- Swagger (Documentación de API)

## ✨ Características Principales
- **Roles separados:** Cliente (transacciones) y Administrador/Auditor (aprobación de depósitos, gestión de cuentas).
- **Asincronía real:** Transferencias, depósitos y generación de PDFs se procesan en segundo plano con BullMQ. El frontend usa polling para actualizar el estado sin recargar la página.
- **Seguridad:** Rutas protegidas en el frontend y validaciones estrictas con Guards y DTOs en el backend.
- **Generación de PDF:** Estados de cuenta generados en el servidor y previsualizados en el navegador.

## 🔐 Credenciales de Prueba
- **Usuario (Cliente):** `user@test.com` / `Password123!`
- **Administrador:** `admin@test.com` / `Admin123!`
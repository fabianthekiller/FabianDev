# Rosal Motos - Sistema de Inventario

Sistema moderno de gestión de inventario implementado con Next.js 14.2.26 y MongoDB.

## Requisitos Previos

- Docker Desktop instalado y en ejecución
- Node.js versión 18 o superior
- npm o yarn como gestor de paquetes

## Configuración Inicial

### 1. Preparación del Entorno

Clonar el repositorio e ingresar al directorio:
```bash
git clone <url-del-repositorio>
cd FabianDev
```

### 2. Inicialización de Servicios Docker

Levantar los contenedores necesarios:
```bash
docker-compose up -d
```

Este comando iniciará:
- MongoDB (puerto 27017) - Base de datos principal
- Servicio Carbone (puerto 4000) - Generación de reportes

### 3. Configuración del Proyecto Next.js

Instalar dependencias:
```bash
cd inventario
npm install   # o yarn install
```

### 4. Variables de Entorno

Crear archivo `.env.local` en el directorio `inventario`:
```env
MONGODB_URI=mongodb://fabian:moto2025@localhost:27017/MOTOINVENTARIO
```

## Ejecución

### Desarrollo Local

```bash
npm run dev   # o yarn dev
```

Acceder a: `http://localhost:3000`

## Información de Servicios

### MongoDB
- URL: `localhost:27017`
- Usuario: `fabian`
- Base de datos: `MOTOINVENTARIO`
- Credenciales configuradas en docker-compose.yml

### Carbone
- URL: `http://localhost:4000`
- Autenticación desactivada en desarrollo

## Solución de Problemas

Si encuentra problemas de conexión:
1. Verificar que Docker esté ejecutándose
2. Comprobar que los puertos 27017 y 4000 estén disponibles
3. Revisar logs: `docker-compose logs`

## Exposición a Internet con Tailscale

### Configuración de Tailscale Funnel

1. Instalar Tailscale:
```bash
curl -fsSL https://tailscale.com/install.sh | sh
```

2. Iniciar sesión:
```bash
tailscale up
```

3. Habilitar Funnel para el servicio:
```bash
tailscale funnel 3000
```

El servicio estará disponible en:
`https://<your-tailscale-name>.ts.net`

### Notas de Seguridad
- Asegurarse de tener las políticas de ACL configuradas
- Monitorear el tráfico entrante
- Considerar límites de ancho de banda


## Autenticación y Seguridad

### Auth.js Integration

El sistema utiliza Auth.js para gestionar la autenticación:
- Login seguro con credenciales
- Protección de rutas mediante middleware
- Manejo de sesiones de usuario

### Middleware de Protección

Las rutas protegidas utilizan middleware personalizado:
```typescript
// Ejemplo de uso en rutas API
export { withAuth } from '@/middleware/auth'
```

### Rutas Protegidas
- `/dashboard/*` - Requiere autenticación
- `/api/*` - Validación de sesión
- `/admin/*` - Requiere rol de administrador

### Sesiones
- Duración: 24 horas
- Almacenamiento seguro en MongoDB
- Renovación automática al usar la aplicación
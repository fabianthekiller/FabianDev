# Rosal Motos - Sistema de Inventario por Fabian Guamanga

Sistema moderno de gestión de inventario implementado con Next.js 14.2.26 y MongoDB.
## Acceso en Vivo

El sistema está actualmente desplegado y accesible en:

[https://server.tail115826.ts.net/](https://server.tail115826.ts.net/)


## Credenciales

Correo:

fabiandev@gmail.com

Contraseña:

Choco23


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

### Configuración Inicial de Tailscale

1. Instalar Tailscale en el servidor:
```bash
curl -fsSL https://tailscale.com/install.sh | sh
```

2. Autenticar el nodo:
```bash
tailscale up
```

### Configuración de Tailscale Funnel

Tailscale Funnel es un servicio que permite exponer servicios HTTP/HTTPS de forma segura a Internet.

1. Habilitar Funnel para el puerto 3000:
```bash
tailscale funnel 3000
```

2. Verificar estado del Funnel:
```bash
tailscale funnel status
```

3. Para múltiples servicios:
```bash
tailscale funnel --https=443 3000 4000 27017
```

### DNS y Dominios

- El servicio será accesible en: `https://<hostname>.ts.net`
- Configurar DNS personalizado (opcional):
```bash
tailscale set --hostname=rosalmotos
```

### Seguridad y Control de Acceso

1. Configurar ACLs en la consola de Tailscale:
```hcl
{
    "acls": [
        {"action": "accept", "users": ["*"], "ports": ["*:3000"]}
    ]
}
```

2. Restricción por dominios:
```bash
tailscale funnel 3000 --allow-domains=rosalmotos.com
```

### Monitoreo y Logs

1. Ver conexiones activas:
```bash
tailscale netcheck
```

2. Monitorear tráfico:
```bash
tailscale status --json
```

### Comandos Útiles

```bash
# Detener Funnel
tailscale funnel reset

# Reconfigurar nodo
tailscale up --reset

# Ver estado detallado
tailscale status --active
```

### Troubleshooting

1. Problemas de conexión:
```bash
tailscale diagnose
```

2. Verificar puertos:
```bash
sudo lsof -i :3000
```

3. Logs del sistema:
```bash
sudo journalctl -u tailscaled
```



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


## Documentación API - Postman

### Registro de Usuario
```http
POST /api/registeruser
Host: https://server.tail115826.ts.net
Content-Type: application/json
apikey: {{API_KEY}}

{
    "name": "Usuario Prueba",
    "email": "usuario@test.com",
    "password": "contraseña123"
}
```


## Arquitectura de la Aplicación

### Server Actions vs APIs Tradicionales

En este proyecto utilizamos Server Actions de Next.js 14 por varias razones:

1. **Seguridad Mejorada**
   - Validación de datos en el servidor
   - No exposición de endpoints API públicos
   - Protección automática contra CSRF

2. **Mejor Rendimiento**
   - Eliminación de la capa API adicional
   - Reducción de la latencia de red
   - Optimización automática de caché

3. **Desarrollo Simplificado**
   - Menos código boilerplate
   - Tipado directo entre cliente y servidor
   - Manejo de errores más intuitivo

### APIs Externas

Sin embargo, mantenemos endpoints API tradicionales para:

1. **Servicio de PDFs (Carbone)**
```typescript
POST /api/pdf/generate
Content-Type: application/json
Authorization: Bearer {{token}}

{
    "template": "factura",
    "data": {
        // datos para el PDF
    }
}
```

2. **Integración con Servicios Externos**
   - Autenticación de terceros
   - Webhooks
   - Servicios que requieren endpoints HTTP

### Ejemplo de Server Action vs API

**Server Action:**
```typescript
// actions/motocicleta/crud.ts
"use server"
export async function crearMoto(data: MotoData) {
    // Validación y procesamiento directo
    return await prisma.motocicleta.create({ data })
}
```

**API Tradicional:**
```typescript
// api/pdf/route.ts
export async function POST(req: Request) {
    const data = await req.json()
    const pdf = await generatePDF(data)
    return new Response(pdf, {
        headers: { 'Content-Type': 'application/pdf' }
    })
}
```

### Ventajas de Este Enfoque Híbrido

- **Server Actions**: Para operaciones CRUD y lógica de negocio principal
- **APIs**: Para servicios específicos que requieren endpoints HTTP
- **Mejor Separación de Responsabilidades**
- **Mayor Flexibilidad para Integraciones**

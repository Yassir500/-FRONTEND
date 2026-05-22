# Frontend DSS404 TATSU

Frontend React con autenticación JWT, consumo de API Laravel y gestión de sesiones.

## 🚀 Inicio Rápido

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
```bash
cp .env.example .env.local
```

Edita `.env.local`:
```
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=DSS404 TATSU
```

### 3. Iniciar servidor de desarrollo
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 📁 Estructura del Proyecto

```
src/
├── pages/              # Páginas (Login, Register, Dashboard)
├── components/         # Componentes reutilizables
├── context/           # Context API (Autenticación)
├── services/          # Servicios de API
├── hooks/             # Custom hooks
├── interceptors/      # Interceptors de Axios
└── index.css          # Estilos globales
```

## 🔐 Características

- ✅ **Autenticación JWT**: Login y registro con validaciones en tiempo real
- ✅ **Persistencia de Sesión**: Token y usuario almacenados en localStorage
- ✅ **Rutas Protegidas**: ProtectedRoute redirige a login si no está autenticado
- ✅ **Interceptors**: Token automático en headers, manejo de errores 401/403/422
- ✅ **Validaciones**: Email, contraseña en tiempo real
- ✅ **Manejo de Errores**: Alertas para errores del servidor

## 🔗 Integración con API Laravel

### Endpoints esperados:
- `POST /api/login` - Iniciar sesión
- `POST /api/register` - Crear cuenta
- `POST /api/logout` - Cerrar sesión
- `GET /api/profile` - Obtener perfil del usuario

### Respuesta esperada de login:
```json
{
  "user": {
    "id": 1,
    "nombre": "Juan",
    "email": "juan@example.com",
    "rol": "usuario"
  },
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

## 📦 Scripts disponibles

- `npm run dev` - Inicia servidor de desarrollo
- `npm run build` - Build para producción
- `npm run preview` - Vista previa del build

## 🛠️ Tecnologías

- React 18
- React Router DOM 6
- Axios
- Vite
- Context API

## 📝 Notas de Configuración

El proxy en `vite.config.js` permite llamadas a `/api/...` que se redirigen a `http://localhost:8000/...`

## 🚨 Troubleshooting

**Error CORS**: Asegúrate que Laravel tenga CORS configurado en `config/cors.php`:
```php
'allowed_origins' => ['http://localhost:5173'],
```

**Token no se envía**: Verifica que el token esté en localStorage y que los interceptors estén bien configurados.

## 📧 API Key Validation

Las validaciones incluyen:
- Email: formato válido
- Contraseña: mínimo 8 caracteres en registro, 6 en login
- Nombre: no vacío

---

**Desarrollado con ❤️ para DSS404 TATSU**

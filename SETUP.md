# 🚀 CONFIGURACIÓN RÁPIDA - Frontend React

## Paso 1: Abrir la carpeta frontend en VS Code

```bash
# En terminal, desde c:\xampp\htdocs
cd frontend
```

## Paso 2: Instalar dependencias

```bash
npm install
```

## Paso 3: Crear archivo de entorno

```bash
# Copiar el archivo de ejemplo
copy .env.example .env.local

# O crea .env.local con:
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=DSS404 TATSU
```

## Paso 4: Iniciar servidor de desarrollo

```bash
npm run dev
```

Abre en el navegador: **http://localhost:5173**

---

## 📋 Qué se incluyó

✅ **Autenticación**
- Login con validaciones de email y contraseña
- Registro con confirmación de contraseña
- Persistencia de sesión en localStorage

✅ **Seguridad**
- Rutas protegidas (ProtectedRoute)
- Interceptors de Axios para agregar token JWT
- Manejo de errores 401, 403, 422

✅ **Servicios API**
- `authService` - login, register, logout, getProfile
- `productoService` - CRUD de productos
- `pedidoService` - CRUD de pedidos

✅ **UI/UX**
- Alertas de error y éxito
- Validaciones en tiempo real
- Estilos básicos CSS

---

## 🔗 Endpoints esperados en tu API Laravel

Asegúrate que tu backend tenga:

```
POST   /api/login              → retorna { user, token }
POST   /api/register           → retorna { user, token }
POST   /api/logout             → sin params
GET    /api/profile            → retorna { user }
```

**CORS debe permitir `http://localhost:5173`**

---

## 📁 Estructura completa

```
frontend/
├── src/
│   ├── pages/
│   │   ├── Login.jsx          ← Página de login
│   │   ├── Register.jsx       ← Página de registro
│   │   ├── Dashboard.jsx      ← Página principal protegida
│   │   └── NotFound.jsx       ← Error 404
│   ├── components/
│   │   ├── ProtectedRoute.jsx ← Rutas privadas
│   │   ├── PublicRoute.jsx    ← Rutas públicas
│   │   ├── ErrorAlert.jsx
│   │   └── SuccessAlert.jsx
│   ├── context/
│   │   └── AuthContext.jsx    ← Autenticación global
│   ├── services/
│   │   ├── api.js             ← Config de Axios
│   │   ├── authService.js     ← Calls de auth
│   │   ├── productoService.js
│   │   └── pedidoService.js
│   ├── hooks/
│   │   └── useAuth.js         ← Hook personalizado
│   ├── interceptors/
│   │   └── axiosInterceptors.js ← Token + errores
│   ├── App.jsx
│   └── main.jsx
├── vite.config.js
├── package.json
└── index.html
```

---

## 🧪 Pruebas

1. Ve a **http://localhost:5173/login**
2. Intenta crear una cuenta
3. Si el backend está corriendo, debería funcionar
4. Se guardará el token y redirigirá al dashboard

---

## ⚠️ IMPORTANTE

**Antes de hacer npm install, abre la carpeta en VS Code:**

```bash
# Opción 1: Desde terminal
code frontend

# Opción 2: Archivo → Abrir carpeta → selecciona frontend
```

Luego en la terminal de VS Code:
```bash
npm install
```

---

**¡Listo! Tu frontend está 100% separado del backend Laravel** 🎉

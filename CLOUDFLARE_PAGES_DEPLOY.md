# Despliegue en Cloudflare Pages

Esta guia deja el frontend Angular de ATLAS listo como sitio estatico en Cloudflare Pages. El backend no se despliega en Pages; debe estar disponible por Cloudflare Tunnel en `https://api.tudominio.com`.

## Configuracion de Cloudflare Pages

- Framework preset: Angular
- Production branch: `main`
- Root directory: raiz del repositorio (`ATLAS_APPWEB`)
- Build command: `npm run build`
- Build output directory: `dist/atlas-frontend/browser`
- Node version recomendada: Node.js 22.12.0

El directorio de salida correcto es el que contiene `index.html`. En este proyecto, despues del build de produccion, Cloudflare debe publicar `dist/atlas-frontend/browser`.

## Backend esperado

- Desarrollo: `http://localhost:8080`
- Produccion: `https://api.tudominio.com`

Los servicios HTTP usan `environment.apiUrl` con soporte para configuracion runtime mediante `public/config.json`. Si `config.json` deja `apiUrl` vacio, la app usa el valor del environment correspondiente.

## Pasos de despliegue

1. Confirmar que el build local compile:

   ```bash
   npm ci
   npm run build
   ```

2. Hacer commit y push a GitHub:

   ```bash
   git status
   git add angular.json package.json public/config.json public/_redirects src/environments/environment.ts src/environments/environment.prod.ts src/index.prod.html CLOUDFLARE_PAGES_DEPLOY.md
   git commit -m "Prepare Angular frontend for Cloudflare Pages"
   git push origin main
   ```

3. Entrar a Cloudflare.
4. Ir a Workers & Pages.
5. Seleccionar Create application.
6. Elegir Pages.
7. Elegir Connect to Git.
8. Seleccionar el repositorio del frontend ATLAS.
9. Configurar:

   - Framework preset: Angular
   - Production branch: `main`
   - Root directory: raiz del proyecto
   - Build command: `npm run build`
   - Build output directory: `dist/atlas-frontend/browser`
   - Node version: 22.12.0

   Si Cloudflare no permite elegir la version desde el preset, configurar la variable de entorno `NODE_VERSION=22.12.0`.

10. Guardar con Save and Deploy.

## Verificacion

Despues del deploy:

1. Abrir la URL `.pages.dev`.
2. Probar login.
3. Navegar por las rutas internas, por ejemplo `/login`, `/dashboard`, `/admin/usuarios` y `/admin/politicas`.
4. Recargar directamente rutas internas como `/login` o `/dashboard`.
5. Abrir DevTools -> Network.
6. Confirmar que las llamadas de produccion vayan a `https://api.tudominio.com`.
7. Confirmar que `GET /api/roles` funcione.
8. Confirmar que las rutas de politicas funcionen:

   - `GET /api/politicas`
   - `GET /api/politicas/rol/{rolId}`
   - `POST /api/politicas/rol/{rolId}/asignar`
   - `DELETE /api/politicas/rol/{rolId}/desasignar/{politicaId}`

## Rutas SPA

Cloudflare Pages necesita el archivo `_redirects` para que Angular Router funcione al recargar rutas internas. Este proyecto lo ubica en:

```text
public/_redirects
```

Contenido esperado:

```text
/* /index.html 200
```

Angular copia `public/_redirects` al output final, por lo que debe existir en:

```text
dist/atlas-frontend/browser/_redirects
```

## Errores comunes

- Pantalla blanca: revisar errores en Console, version de Node y que el build output directory sea `dist/atlas-frontend/browser`.
- 404 al recargar rutas internas: revisar que exista `public/_redirects` y que tambien aparezca en el output final.
- Build output directory incorrecto: Cloudflare debe apuntar a la carpeta que contiene `index.html`, no solo a `dist/atlas-frontend`.
- Falta `_redirects`: Angular no aplicara el rewrite SPA en Pages.
- Error CORS: habilitar en el backend el origen de Cloudflare Pages, por ejemplo `https://tu-sitio.pages.dev` y el dominio final.
- Error 401/403 por token: revisar expiracion, almacenamiento del token y headers enviados.
- API URL incorrecta: confirmar que produccion llame a `https://api.tudominio.com`.
- Backend apagado: verificar que el servicio backend este activo en la computadora remota.
- Cloudflare Tunnel caido: revisar que el tunnel este conectado y enrute hacia el puerto correcto del backend.

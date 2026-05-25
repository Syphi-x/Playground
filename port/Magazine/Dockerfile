# ─── Etapa 1: Build ───────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias primero (caché eficiente)
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar el resto del proyecto
COPY . .

# Construir la app para producción
RUN npm run build

# ─── Etapa 2: Servidor ────────────────────────────────────────────────────────
FROM nginx:alpine

# Copiar los archivos compilados al servidor web
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

# Nginx se inicia automáticamente
CMD ["nginx", "-g", "daemon off;"]

FROM node:18-alpine

# Habilita pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Crea directorio de trabajo
WORKDIR /app

# Clona shallow del repositorio directamente
RUN apk add --no-cache git \
    && git clone --depth=1 -b Fran https://github.com/DevelopmentUDG/ScrumPlanner.git /app

# Instala dependencias (usa el lockfile clonado)
RUN pnpm install

# Expón el puerto Vite
EXPOSE 5173

# Ejecuta Vite en modo dev y accesible
CMD ["pnpm", "dev", "--host", "0.0.0.0"]

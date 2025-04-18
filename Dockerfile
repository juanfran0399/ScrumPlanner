FROM node:18-alpine

# Habilita pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Directorio de trabajo
WORKDIR /app

# Copia archivos necesarios
COPY pnpm-lock.yaml package.json ./

# Instala dependencias
RUN pnpm install

# Copia el resto del código
COPY . .

# Expone el puerto de Vite dev server
EXPOSE 5173

# Comando para iniciar el servidor de desarrollo
CMD ["pnpm", "dev", "--host", "0.0.0.0"]



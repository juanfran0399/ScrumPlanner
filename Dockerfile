FROM node:18-alpine

# Habilita pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copia solo los archivos necesarios para instalar deps (usa cache si no cambian)
COPY package.json pnpm-lock.yaml ./

# Instala deps primero
RUN pnpm install

# Ahora sí copia todo el código
COPY . .

# Expón el puerto Vite
EXPOSE 5173

# Ejecuta Vite en modo dev y accesible
CMD ["pnpm", "dev", "--host", "0.0.0.0"]

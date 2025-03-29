FROM node:18

WORKDIR /app

ENV PORT=5173

# Copiar solo archivos esenciales para optimizar la caché
COPY package.json pnpm-lock.yaml ./

# Instalar pnpm globalmente y asegurarse de que se use correctamente
RUN  npm install -g pnpm

# Instalar dependencias con hoisting para evitar errores de TypeScript
RUN pnpm install --frozen-lockfile --shamefully-hoist

# Copiar el resto de los archivos
COPY . .

# Construir la aplicación
RUN pnpm build

# Exponer el puerto (sin variables de entorno)
EXPOSE 5173

# Iniciar la aplicación en modo preview
CMD ["pnpm", "preview", "--host"]

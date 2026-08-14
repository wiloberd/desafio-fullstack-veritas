FROM node:22-alpine3.20

RUN apk update && apk upgrade --no-cache

WORKDIR /app

# Instala as dependências
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# Copia o código fonte
COPY . .

# Cria o .env a partir do arquivo de exemplo
RUN cp .env.example .env

EXPOSE 5173

# Roda o Vite expondo para a rede do Docker
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
FROM golang:1.26-alpine

# Instala o compilador C necessário para o driver do SQLite
RUN apk update && apk upgrade --no-cache && \
    apk add --no-cache gcc musl-dev

WORKDIR /app

# Baixa as dependências do Go
COPY go.mod go.sum ./
RUN go mod download

# Copia todo o código para o contêiner
COPY . .

# Cria o .env a partir do arquivo de exemplo
RUN cp .env.example .env

EXPOSE 8080

# Roda o servidor diretamente no modo de desenvolvimento
CMD ["go", "run", "./cmd/server/main.go"]
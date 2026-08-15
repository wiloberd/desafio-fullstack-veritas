# Mini Kanban — Desafio Técnico Veritas
Mini Kanban de tarefas desenvolvido com React e Go como desafio técnico para processo seletivo em desenvolvimento Full Stack.


## Tecnologias

- **Frontend:** React, JavaScript, CSS3
- **Backend:** Go (Golang)
- **Versionamento:** Git

## ## Instruções para executar a Aplicação com Docker (Recomendado)

O projeto foi totalmente conteinerizado para facilitar a avaliação, garantindo que o frontend (React/Vite) e o backend (Go) rodem perfeitamente sem a necessidade de instalar as linguagens na máquina local.

### Pré-requisitos
* [Docker](https://www.docker.com/get-started)
* Docker Compose

### Passo a Passo
1. Clone o repositório:
  - git clone <url-do-seu-repositorio>
  - cd desafio-fullstack-veritas

**Obs: Importante!** Se esta é a primeira vez que você está executando o projeto na sua maquina usando Docker, copie o banco SQLite (kanban.db) base para que a pasta de volume possa carregar os dados iniciais. Usando o seu terminal, execute o comando:

**No Linux ou macOS:**
- cp kanban.db data/kanban.db

**No Windows (CMD ou PowerShell)**
- copy kanban.db data\kanban.db

2. Suba a infraestrutura:
  - docker-compose up --build

3. Acesse a aplicação:
  - Frontend (Interface): http://localhost:5173
  - Backend (API): http://localhost:8080

**Nota sobre Persistência de Dados:** O banco de dados SQLite utilizado pelo backend está configurado com um bind mount. Isso significa que os dados (suas tarefas criadas) serão salvos na pasta ./backend/data da sua máquina e não serão perdidos ao reiniciar os contêineres.


## Instruções para Rodar a Aplicação loalmente

### 1. Pré-requisitos
Certifique-se de ter instalado em sua máquina:
- [Node.js](https://nodejs.org/) (versão 19 ou superior)
- [Go](https://go.dev/) (versão 1.26 ou superior)

### 2.Frontend:

#### Navegue até o diretório do Frontend (cd frontend):
Instale as dependências:
- npm install

Inicie o servidor:
- npm run dev

### 3. Backend:
#### Configurando o Banco de Dados de Teste (Opcional)
Para facilitar a avaliação e testes da API, este repositório inclui um banco de dados SQLite pré-populado na raiz do projeto (`kanban.db`). 

Para utilizá-lo, você precisa copiar o arquivo para dentro da pasta `data`, pois é o local padrão que a aplicação utiliza para persistência.

Execute os comandos abaixo no terminal, na raiz do projeto `backend`:

**No Linux ou macOS:**
- cp kanban.db data/kanban.db

**No Windows (CMD ou PowerShell)**
- copy kanban.db data\kanban.db

#### Navegue até o diretório do (cd backend):

Crie o arquivo de variáveis (Caso necessário, ajuste a porta PORT no arquivo .env):
- cp .env.example .env (no LInux ou macOS) 
- copy .env.example .env (CMD ou PowerShell) 

Instale as dependências:
- go mod tidy

Inicie o servidor:
- go run ./cmd/server
O servidor iniciará por padrão em http://localhost:8080

## Funcionalidades

- Criar tarefas com validação de campos
- Editar título e descrição de tarefas existentes
- Excluir tarefas com confirmação de segurança nativa (`window.confirm`)
- Alterar status das tarefas (A Fazer, Em Progresso, Concluído)
- Visualizar e gerenciar tarefas organizadas por colunas


## Decisões Técnicas
### 1.Frontend: React

- **Abstração modular da lista de tarefas (`TaskList` / `TaskListItem`):** Encapsulamento da lógica de mapeamento e alternância entre visualização e edição, garantindo o princípio DRY e código limpo nas colunas.

- **Validação desacoplada em utilitário puro (`utils/taskValidationsFields`):** Separação entre a interface e as regras de validação de formulários, facilitando a manutenção e a criação de testes unitários.

- **UX minimalista com expansão sob demanda:** Uso do evento de foco (onFocus) e CSS nativo (field-sizing: content com max-height no textarea) para controlar a expansão dos campos, otimizando o espaço visual das colunas e a experiência da interface.

- **Validação de campos em JavaScript puro (Zero Dependências):** Implementação das regras em utils/taskValidationsFields de forma nativa, mantendo a aplicação leve e evitando a inclusão prematura de bibliotecas de formulários (como Yup ou Formik).

- **Confirmação nativa para ações destrutivas (`Zero-dependency Feedback`):**
  Uso do `window.confirm` do navegador para confirmação de exclusão de tarefas, prevenindo ações acidentais pelo usuário sem a necessidade de adicionar bibliotecas pesadas de Modal/Toast.


### 2. Backend

- **Arquitetura modular em camadas simples (cmd/, configs/, internal/):** Organização inspirada no Standard Go Project Layout, separando o ponto de entrada (cmd/server), configurações de ambiente (configs/), roteamento (server/), manipuladores HTTP (handler/) e modelos de dados (model/).

- **Gerenciamento de Estado Concorrente com Mutex (sync.Mutex):** Utilização de sync.Mutex para proteger a manipulação e o incremento de ID das tarefas em memória, prevenindo Race Conditions em acessos simultâneos à API.

- **Middleware CORS Nativo:** Implementação de cabeçalhos HTTP para liberação de Cross-Origin Resource Sharing (CORS), permitindo requisições seguras vindas do Frontend React.

- **Respostas JSON Padronizadas e Validações de Payload:** Tratamento de erros HTTP (400 Bad Request, 404 Not Found, 500 Internal Server Error) com payloads e estruturas em JSON usando struct tags (json:"id", json:"title", etc.).


#### Decisões de Design e Arquitetura da API

* **Uso de DTOs (Data Transfer Objects):** Separação estrita entre os modelos de persistência (`model.Task`) e os contratos de entrada HTTP (`dto.CreateTaskInput` e `dto.UpdateTaskInput`).
* **Segurança e Imutabilidade com `DisallowUnknownFields`:** O decodificador JSON rejeita estritamente payloads com propriedades não mapeadas (ex: tentativas de injetar `id` no corpo da requisição), retornando erros 400 descritivos com os campos esperados (`expected_fields`).
* **Ciclo de Vida Determinístico:** Tarefas criadas via `POST /api/tasks` nascem obrigatoriamente com o status `todo` atribuído pelo backend, centralizando a regra de negócio e evitando inconsistências de estado no momento da criação.
* **REST Semântico:** Identificadores únicos (`id`) são manipulados exclusivamente via parâmetros de rota na URL (`/api/tasks/{id}`) para operações de consulta, atualização e exclusão.


## Limitações conhecidas
### 1.Frontend: React

- **Responsividade e Ajustes de Layout:**
  A interface foi desenvolvida prioritariamente para resoluções padrão de desktop. Necessita de ajustes de CSS (Media Queries, Flexbox/Grid e escala tipográfica relativa) para garantir um comportamento responsivo completo em múltiplos tamanhos de tela (notebooks menores, monitores ultrawide e dispositivos móveis).

### 2. Backend

- **Cobertura Inicial de Testes Automatizados:** Foram implementados apenas testes unitários/de integração primários para os componentes críticos.

- **Ampliação da Cobertura de Testes Automatizados:** Implementar testes unitários para a camada de manipuladores de rotas (`httptest`).


## Melhorias futuras

### 1.Frontend: React
- Aprimorar a responsividade da interface.
- Refinar o comportamento de expansão e recolhimento dos componentes de listagem e atualizações de tarefas.
- Adicionar feedback visual para operações de criação, edição, exclusão e alteração de status.
- Substituir os avisos nativos do navegador por componentes visuais customizados (Toast notifications ou Modais estilizados com CSS).

### 2. Backend

- **Gerenciamento de Logging por Ambiente:** Substituir o pacote padrão `log` por um logger estruturado (como `zap` ou `slog` nativo do Go) para alterar o nível de log (Debug, Info, Error) e o destino da saída (console vs. arquivo) dependendo do ambiente (`ENV=development` ou `production`).


### Segurança e Configurações Globais (Middleware)

A API utiliza um **Middleware de Cabeçalhos Globais** customizado para interceptar e tratar requisições HTTP antes que elas alcancem os *handlers* da regra de negócio. As principais responsabilidades dessa camada incluem:

*   **CORS Dinâmico:** Gerenciamento rigoroso das políticas de *Cross-Origin Resource Sharing* (CORS). A origem permitida não é "hardcoded", sendo lida diretamente da variável de ambiente `CORS_ALLOWED_ORIGINS`. 

*   **Tratamento Otimizado de Preflight (OPTIONS):** O middleware intercepta globalmente as requisições `OPTIONS` disparadas pelos navegadores, respondendo imediatamente com o status correto (permitindo o fluxo seguro) sem que essa requisição transite desnecessariamente pela lógica dos controladores.

*   **Isolamento de Responsabilidades:** Ao centralizar a injeção de cabeçalhos de segurança e métodos permitidos no roteador principal, os *handlers* (`TaskHandler`) mantêm-se limpos, enxutos e focados exclusivamente na manipulação das entidades do domínio.
# Mini Kanban — Desafio Técnico Veritas
Mini Kanban de tarefas desenvolvido com React e Go como desafio técnico para processo seletivo em desenvolvimento Full Stack.


## Tecnologias

- **Frontend:** React, JavaScript, CSS3
- **Backend:** Go (Golang)
- **Versionamento:** Git


## Instruções para Rodar a Aplicação

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
#### Navegue até o diretório do (cd backend):

Crie o arquivo de variáveis (Caso necessário, ajuste a porta PORT no arquivo .env):
- cp .env.example .env

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
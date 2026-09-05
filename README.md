# Finance App API

API desenvolvida para o controle de finanças pessoais. Ela permite o gerenciamento de ganhos, gastos e investimentos, além do cálculo de saldo e organização financeira dos usuários. Desenvolvida para a cadeira de Integrar Interfaces com Serviços Web do curso de Sistemas de Informação na UNIFACISA.

## Equipe

- Miguel Alves
- Danilo Santos
- Gutemberg Filho
- Vinicius Sátiro

## Tecnologias

- **Node.js** & Express.js – backend e rotas
- **MongoDB** – banco de dados NoSQL com Mongoose ODM
- **Mongoose** – ODM para integração com MongoDB
- **GraphQL** – API query language com Apollo Server
- **Docker** – containerização da aplicação
- **Zod** – validação de dados
- **JWT (JSON Web Token)** – autenticação com access e refresh tokens
- **bcrypt** – hash seguro de senhas
- **Jest & Supertest** – testes automatizados
- **Swagger** – documentação interativa da API REST

## Rodando o projeto

```bash
# Crie o arquivo contendo as variáveis de ambiente
cp .env.example .env

# Instale as dependências
npm install

# Inicie os serviços com Docker
docker compose up -d

# Rode o backend
npm run start:dev
```

O servidor estará disponível em `http://localhost:8080`

## Autenticação

A autenticação é baseada em **JWT** e funciona tanto para REST quanto para GraphQL.

**Access Token**: token de curta duração (15 minutos) enviado no cabeçalho da requisição HTTP `Authorization` no formato `Bearer <token>`. Usado para autenticar e autorizar o acesso às rotas protegidas.

**Refresh Token**: token de longa duração (30 dias) utilizado para obter um novo Access Token quando este expira, garantindo uma experiência de uso contínua sem necessidade de novo login.

## APIs Disponíveis

### REST API

A API REST fornece endpoints para gerenciar usuários e transações:

**Usuários:**

- `POST /api/users` – Registrar novo usuário
- `POST /api/users/auth/login` – Fazer login
- `POST /api/users/auth/refresh-token` – Renovar access token
- `GET /api/users/me` – Obter dados do usuário autenticado
- `PATCH /api/users/me` – Atualizar dados do usuário
- `DELETE /api/users/me` – Deletar usuário
- `GET /api/users/me/balance` – Obter saldo do usuário

**Transações:**

- `POST /api/transactions/me` – Criar nova transação
- `GET /api/transactions/me` – Listar transações do usuário
- `PATCH /api/transactions/:id` – Atualizar transação
- `DELETE /api/transactions/:id` – Deletar transação

### GraphQL API

A API GraphQL está disponível em `http://localhost:8080/graphql` e oferece queries e mutations para toda a funcionalidade:

**Queries:**

```graphql
query {
    me {
        id
        first_name
        last_name
        email
        createdAt
        updatedAt
    }

    balance(from: "2024-01-01", to: "2024-12-31") {
        earnings
        expenses
        investments
        balance
    }

    transactions(from: "2024-01-01", to: "2024-12-31") {
        id
        name
        amount
        type
        date
    }

    transaction(id: "transaction-id") {
        id
        name
        amount
        type
        date
    }
}
```

**Mutations:**

```graphql
mutation {
    register(
        input: {
            first_name: "João"
            last_name: "Silva"
            email: "joao@example.com"
            password: "senha123"
        }
    ) {
        id
        email
        tokens {
            accessToken
            refreshToken
        }
    }

    login(input: { email: "joao@example.com", password: "senha123" }) {
        id
        email
        tokens {
            accessToken
            refreshToken
        }
    }

    createTransaction(
        input: {
            name: "Salário"
            amount: "5000.00"
            type: EARNING
            date: "2024-01-15"
        }
    ) {
        id
        name
        amount
        type
        date
    }
}
```

## Banco de Dados

### MongoDB

A aplicação utiliza **MongoDB** como banco de dados. Duas instâncias são configuradas via Docker Compose:

- **mongodb** (porta 27017) – Ambiente de desenvolvimento
- **mongodb-test** (porta 27018) – Ambiente de testes

### Collections

**Users:**

```
{
  id: String (UUID),
  first_name: String,
  last_name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

**Transactions:**

```
{
  id: String (UUID),
  user_id: String (indexed),
  name: String,
  amount: String (decimal stored as string),
  type: String (EARNING, EXPENSE, INVESTMENT),
  date: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Testes automatizados

A aplicação conta tanto com **testes de integração** quanto com **testes e2e**, testando as principais funcionalidades do sistema e alcançando uma cobertura de mais de **90%**.

Para rodar, basta utilizar o comando:

```bash
npm run test          # Executa testes uma vez
npm run test:watch   # Executa testes em modo watch
npm run test:coverage # Executa testes e gera relatório de cobertura
```

## Documentação com Swagger

A documentação completa da API REST pode ser acessada em `http://localhost:8080/docs`

## Estrutura do Projeto

```
src/
├── adapters/           # Adaptadores (JWT, bcrypt, UUID)
├── controllers/        # Controladores (camada de apresentação)
├── database/          # Configuração de conexão MongoDB
├── errors/            # Classes de erro customizadas
├── factories/         # Factory Pattern para dependency injection
├── graphql/           # Schema e resolvers GraphQL
├── middlewares/       # Middlewares Express (autenticação)
├── models/            # Schemas Mongoose
├── repositories/      # Repository Pattern (acesso a dados)
├── routes/            # Rotas REST e GraphQL
├── schemas/           # Validação com Zod
├── tests/             # Fixtures e helpers de testes
├── use-cases/         # Lógica de negócio isolada
└── utils/             # Utilidades (decimal, formatação)
```

## Design Pattenrs

A aplicação segue os seguintes padrões de projeto:

- **Factory Pattern** – Injeção de dependências via factories
- **Repository Pattern** – Abstração da camada de dados
- **Use Case Pattern** – Lógica de negócio isolada e testável
- **Adapter Pattern** – Integração com serviços externos

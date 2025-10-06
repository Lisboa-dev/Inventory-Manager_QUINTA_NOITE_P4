# Inventory-Manager_QUINTA_NOITE_P4
API para gerenciamento de estoque para avalição do professor Douglas da diciplina de Tópicos especiais de TI. Turma de 2025.2, Noite, Quinta. Aluno Matheus Lira Lisboa.

## Documentação da API (Swagger)

A API expõe a documentação interativa via Swagger UI.

- URL da documentação: `/docs`
- Especificação JSON: `/docs.json`

### Como executar localmente

1. Configure as variáveis de ambiente (arquivo `.env`):
   - `DATABASE_URL` para o PostgreSQL
   - `JWT_SECRET` para assinar/verificar tokens
2. Suba o banco de dados (opcional via Docker):
   ```bash
   npm run db:image
   ```
3. Gere o cliente Prisma e aplique o schema:
   ```bash
   npm run prisma:migrate
   ```
4. Rode em desenvolvimento:
   ```bash
   npm run dev
   ```
### Segurança (JWT)

Algumas rotas são protegidas e exigem Bearer Token JWT no header `Authorization`.

No Swagger, clique em "Authorize" e informe `Bearer <seu_token>`.

### Endpoints principais

- `POST /users`: cria usuário
- `POST /users/login`: login
- `GET /users/{id}`: obter usuário (autenticado)
- `GET/POST/PUT/DELETE /produtos` e `/produtos/{id}` (autenticado)
- `GET/POST/PUT/DELETE /lotes` e `/lotes/{id}` (autenticado)
- `GET/POST/PUT/DELETE /generos` e `/generos/{id}` (autenticado)

Consulte detalhes de corpo, parâmetros e respostas em `/docs`.

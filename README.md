# 📝 Aplicação Web Full-Stack - Lista de Tarefas

Aplicação web full-stack conteinerizada para gerenciamento de tarefas.

## 🏗️ Arquitetura

- **Frontend**: HTML/CSS/JavaScript + Nginx
- **Backend**: FastAPI (Python) + MongoDB + Redis
- **Infraestrutura**: Docker Compose

## 🚀 Como Executar

```bash
# Clone e entre no diretório
cd webapp_fullstack

# Execute a aplicação
docker-compose up --build

# Acesse: http://localhost:3000
```

## 📁 Estrutura

```
webapp_fullstack/
├── backend/          # API FastAPI + MongoDB + Redis
├── frontend/         # Interface web
├── docker-compose.yml
└── README.md
```

## 🔧 Funcionalidades

- ✅ Listar tarefas (com cache Redis)
- ✅ Adicionar novas tarefas
- ✅ Deletar tarefas
- ✅ Interface responsiva
- ✅ Monitoramento de saúde dos serviços

## 🌐 Endpoints

- `GET /tasks` - Lista tarefas
- `POST /tasks` - Cria tarefa
- `DELETE /tasks/{id}` - Remove tarefa
- `GET /health` - Status dos serviços

## 🐳 Comandos Docker

```bash
docker-compose up --build    # Iniciar
docker-compose down          # Parar
docker-compose logs          # Ver logs
```

## 🔧 Configurações

### Variáveis de Ambiente
As seguintes variáveis podem ser configuradas no `docker-compose.yml`:

- `MONGODB_URI`: URI de conexão com MongoDB
- `REDIS_URI`: URI de conexão com Redis
- `MONGO_INITDB_DATABASE`: Nome do banco de dados

### Portas
- Frontend: 3000
- Backend: 5000
- MongoDB: 27017
- Redis: 6379

## 🚀 Comandos Úteis

```bash
# Iniciar aplicação
docker-compose up --build

# Executar em background
docker-compose up -d --build

# Parar aplicação
docker-compose down

# Parar e remover volumes
docker-compose down -v

# Rebuild de um serviço específico
docker-compose up --build backend

# Ver logs em tempo real
docker-compose logs -f
```

## 🔒 Segurança

- CORS configurado para permitir comunicação entre frontend e backend
- Validação de entrada com Pydantic
- Headers de segurança no nginx
- Escape de HTML no frontend para prevenir XSS

## 📊 Performance

- Cache Redis com TTL de 60 segundos para consultas de listagem
- Invalidação automática do cache ao criar/deletar tarefas
- Compressão e cache de arquivos estáticos no nginx
- Conexões persistentes com MongoDB e Redis

## 🐛 Troubleshooting

### Problemas Comuns

1. **Porta já em uso**:
   ```bash
   # Verificar processos usando as portas
   sudo lsof -i :3000
   sudo lsof -i :5000
   ```

2. **Erro de conexão com MongoDB**:
   ```bash
   # Verificar logs do MongoDB
   docker-compose logs database
   ```

3. **Erro de conexão com Redis**:
   ```bash
   # Verificar logs do Redis
   docker-compose logs cache
   ```

4. **Frontend não carrega**:
   ```bash
   # Verificar logs do frontend
   docker-compose logs frontend
   ```

## 📝 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor, abra uma issue ou pull request.

---

**Desenvolvido com ❤️ usando Docker, FastAPI, MongoDB e Redis** 
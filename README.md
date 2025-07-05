# 📝 Aplicação Web Full-Stack - Lista de Tarefas

Aplicação web full-stack conteinerizada para gerenciamento de tarefas com **proxy reverso Nginx**.

## 🏗️ Arquitetura

- **Frontend**: HTML/CSS/JavaScript + Nginx (com proxy reverso)
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
├── frontend/         # Interface web + Nginx (proxy reverso)
├── docker-compose.yml
└── README.md
```

## 🔧 Funcionalidades

- ✅ Listar tarefas (com cache Redis)
- ✅ Adicionar novas tarefas
- ✅ Deletar tarefas
- ✅ Interface responsiva
- ✅ Monitoramento de saúde dos serviços
- ✅ **Proxy reverso Nginx** - Acesso centralizado via porta 3000

## 🌐 Endpoints

- `GET /api/tasks` - Lista tarefas
- `POST /api/tasks` - Cria tarefa
- `DELETE /api/tasks/{id}` - Remove tarefa
- `GET /api/health` - Status dos serviços

## 🔄 Proxy Reverso

A aplicação utiliza **Nginx como proxy reverso** com as seguintes configurações:

- **Acesso unificado**: Toda comunicação via porta 3000
- **Segurança**: Backend não exposto externamente
- **Performance**: Cache de arquivos estáticos
- **Headers**: Configuração automática de CORS e segurança

### Configuração do Proxy:
```nginx
location /api/ {
    proxy_pass http://backend:5000/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

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
- **Frontend + Proxy**: 3000 (único ponto de acesso)
- Backend: 5000 (apenas interno)
- MongoDB: 27017 (apenas interno)
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

- **Proxy reverso**: Backend não exposto externamente
- CORS configurado para permitir comunicação entre frontend e backend
- Validação de entrada com Pydantic
- Headers de segurança no nginx
- Escape de HTML no frontend para prevenir XSS

## 📊 Performance

- Cache Redis com TTL de 60 segundos para consultas de listagem
- Invalidação automática do cache ao criar/deletar tarefas
- Compressão e cache de arquivos estáticos no nginx
- Conexões persistentes com MongoDB e Redis
- **Proxy reverso**: Redução de latência e melhor gerenciamento de conexões

## 🐛 Troubleshooting

### Problemas Comuns

1. **Porta já em uso**:
   ```bash
   # Verificar processos usando a porta
   sudo lsof -i :3000
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

5. **Erro de proxy reverso**:
   ```bash
   # Verificar logs do Nginx
   docker-compose logs frontend
   # Verificar se o backend está rodando
   docker-compose logs backend
   ```

## 📝 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor, abra uma issue ou pull request.

---

**Desenvolvido com ❤️ usando Docker, FastAPI, MongoDB, Redis e Nginx Proxy Reverso** 
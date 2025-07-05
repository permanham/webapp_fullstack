from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pymongo import MongoClient
import redis
import os
import json
from typing import List

app = FastAPI(title="Tasks API", version="1.0.0")

# Configurar CORS para permitir requisições do frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelo Pydantic para tarefas
class Task(BaseModel):
    descricao: str

class TaskResponse(BaseModel):
    id: str
    descricao: str

# Configurações de conexão
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://database:27017/tasks")
REDIS_URI = os.getenv("REDIS_URI", "redis://cache:6379")

# Conexões
mongo_client = MongoClient(MONGODB_URI)
db = mongo_client.tasks
tasks_collection = db.tasks

redis_client = redis.from_url(REDIS_URI)

@app.get("/")
async def root():
    return {"message": "Tasks API is running!"}

@app.get("/tasks", response_model=List[TaskResponse])
async def list_tasks():
    """Lista todas as tarefas, usando Redis como cache"""
    try:
        # Tentar buscar do cache primeiro
        cached_tasks = redis_client.get("tasks_list")
        if cached_tasks:
            print("Retornando tarefas do cache Redis")
            return json.loads(cached_tasks)
        
        # Se não estiver no cache, buscar do MongoDB
        tasks = list(tasks_collection.find({}))
        tasks_with_id = []
        for task in tasks:
            task_id = str(task["_id"])
            tasks_with_id.append({"id": task_id, "descricao": task["descricao"]})
        
        # Salvar no cache por 60 segundos
        redis_client.setex("tasks_list", 60, json.dumps(tasks_with_id))
        print("Tarefas buscadas do MongoDB e salvas no cache")
        
        return tasks_with_id
    except Exception as e:
        print(f"Erro ao listar tarefas: {e}")
        raise HTTPException(status_code=500, detail="Erro interno do servidor")

@app.post("/tasks", response_model=TaskResponse)
async def create_task(task: Task):
    """Cria uma nova tarefa"""
    try:
        # Inserir no MongoDB
        result = tasks_collection.insert_one({"descricao": task.descricao})
        
        # Invalidar cache
        redis_client.delete("tasks_list")
        print("Cache invalidado após criar nova tarefa")
        
        return {"id": str(result.inserted_id), "descricao": task.descricao}
    except Exception as e:
        print(f"Erro ao criar tarefa: {e}")
        raise HTTPException(status_code=500, detail="Erro interno do servidor")

@app.delete("/tasks/{task_id}")
async def delete_task(task_id: str):
    """Deleta uma tarefa pelo ID"""
    try:
        from bson import ObjectId
        
        # Verificar se o ID é válido
        if not ObjectId.is_valid(task_id):
            raise HTTPException(status_code=400, detail="ID de tarefa inválido")
        
        # Deletar do MongoDB
        result = tasks_collection.delete_one({"_id": ObjectId(task_id)})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Tarefa não encontrada")
        
        # Invalidar cache
        redis_client.delete("tasks_list")
        print("Cache invalidado após deletar tarefa")
        
        return {"message": "Tarefa deletada com sucesso"}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Erro ao deletar tarefa: {e}")
        raise HTTPException(status_code=500, detail="Erro interno do servidor")

@app.get("/health")
async def health_check():
    """Verifica a saúde dos serviços"""
    try:
        # Verificar MongoDB
        mongo_client.admin.command('ping')
        mongo_status = "OK"
    except:
        mongo_status = "ERROR"
    
    try:
        # Verificar Redis
        redis_client.ping()
        redis_status = "OK"
    except:
        redis_status = "ERROR"
    
    return {
        "status": "healthy",
        "mongodb": mongo_status,
        "redis": redis_status
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000) 
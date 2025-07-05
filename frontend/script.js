const API_URL = 'http://localhost:5000';

// Elementos do DOM
const taskList = document.getElementById('task-list');
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const statusElement = document.getElementById('status');
const loadingElement = document.getElementById('loading');

// Função para mostrar mensagens de status
function showStatus(message, type = 'info') {
    statusElement.textContent = message;
    statusElement.className = `status ${type}`;
}

// Função para mostrar/esconder loading
function toggleLoading(show) {
    if (show) {
        loadingElement.classList.add('show');
    } else {
        loadingElement.classList.remove('show');
    }
}

// Função para criar elemento de tarefa
function createTaskElement(task) {
    const li = document.createElement('li');
    li.innerHTML = `
        <span class="task-text">${escapeHtml(task.descricao)}</span>
        <button class="delete-btn" onclick="deleteTask('${task.id}')">🗑️</button>
    `;
    return li;
}

// Função para escapar HTML (prevenir XSS)
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Função para carregar tarefas
async function carregarTarefas() {
    try {
        toggleLoading(true);
        showStatus('Carregando tarefas...');
        
        const response = await fetch(`${API_URL}/tasks`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const tarefas = await response.json();
        
        // Limpar lista atual
        taskList.innerHTML = '';
        
        if (tarefas.length === 0) {
            taskList.innerHTML = '<div class="empty-state">Nenhuma tarefa encontrada. Adicione sua primeira tarefa!</div>';
        } else {
            tarefas.forEach(tarefa => {
                const li = createTaskElement(tarefa);
                taskList.appendChild(li);
            });
        }
        
        showStatus(`✅ ${tarefas.length} tarefa(s) carregada(s)`, 'success');
        
    } catch (error) {
        console.error('Erro ao carregar tarefas:', error);
        showStatus('❌ Erro ao carregar tarefas. Verifique se o backend está rodando.', 'error');
        taskList.innerHTML = '<div class="empty-state">Erro ao carregar tarefas. Tente novamente.</div>';
    } finally {
        toggleLoading(false);
    }
}

// Função para adicionar tarefa
async function adicionarTarefa(descricao) {
    try {
        showStatus('Adicionando tarefa...');
        
        const response = await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ descricao: descricao.trim() })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const novaTarefa = await response.json();
        
        // Adicionar à lista
        const li = createTaskElement(novaTarefa);
        taskList.appendChild(li);
        
        // Remover mensagem de estado vazio se existir
        const emptyState = taskList.querySelector('.empty-state');
        if (emptyState) {
            emptyState.remove();
        }
        
        showStatus('✅ Tarefa adicionada com sucesso!', 'success');
        
        // Limpar input
        taskInput.value = '';
        
    } catch (error) {
        console.error('Erro ao adicionar tarefa:', error);
        showStatus('❌ Erro ao adicionar tarefa. Tente novamente.', 'error');
    }
}

// Função para deletar tarefa
async function deleteTask(taskId) {
    try {
        showStatus('Deletando tarefa...');
        
        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Recarregar lista
        await carregarTarefas();
        showStatus('✅ Tarefa deletada com sucesso!', 'success');
        
    } catch (error) {
        console.error('Erro ao deletar tarefa:', error);
        showStatus('❌ Erro ao deletar tarefa. Tente novamente.', 'error');
    }
}

// Event listener para o formulário
taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const descricao = taskInput.value.trim();
    if (!descricao) {
        showStatus('❌ Por favor, digite uma tarefa.', 'error');
        return;
    }
    
    await adicionarTarefa(descricao);
});

// Verificar saúde da API na inicialização
async function checkApiHealth() {
    try {
        const response = await fetch(`${API_URL}/health`);
        if (response.ok) {
            const health = await response.json();
            showStatus(`🟢 API: ${health.status} | MongoDB: ${health.mongodb} | Redis: ${health.redis}`);
        } else {
            showStatus('🟡 API não respondeu corretamente');
        }
    } catch (error) {
        showStatus('🔴 API não está disponível');
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    carregarTarefas();
    checkApiHealth();
    
    // Verificar saúde periodicamente
    setInterval(checkApiHealth, 30000); // A cada 30 segundos
});

// Função para recarregar tarefas (pode ser chamada manualmente)
window.recarregarTarefas = carregarTarefas; 
// Variáveis de referência para os elementos HTML
const inputTarefa = document.querySelector('.novaTarefa');
const listaTarefas = document.querySelector('.listas');
const btnAdicionar = document.querySelector('.btnAdicionar');

// Função para salvar as tarefas no localStorage
function salvarTarefas(tarefas) {
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

// Função para carregar as tarefas do localStorage
function carregarTarefas() {
    const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
    tarefas.forEach(tarefa => criarTarefa(tarefa.descricao, tarefa.data, tarefa.hora, tarefa.concluida));
}

// Função para criar a tarefa na lista
function criarTarefa(descricao, data, hora, concluida = false) {
    const tarefaLi = document.createElement('li');
    tarefaLi.classList.add('tarefa');
    if (concluida) {
        tarefaLi.classList.add('concluida');
    }

    tarefaLi.innerHTML = `
        <div class="tarefa-conteudo">
            <div class="tarefa-descricao">
                ${descricao}
            </div>
            <div class="tarefa-data">
                ${data} - ${hora}
            </div>
        </div>
        <div class="tarefa-botoes">
            <button class="btn-editar" onclick="editarTarefa(event)">Editar</button>
            <button class="btn-remover" onclick="removerTarefa(event)">Remover</button>
        </div>
        <div class="tarefa-checkbox">
            <input type="checkbox" ${concluida ? 'checked' : ''} onchange="marcarConcluida(event)" />
        </div>
    `;

    // Adicionar a tarefa à lista
    listaTarefas.appendChild(tarefaLi);
}

// Função para editar uma tarefa
function editarTarefa(event) {
    const li = event.target.closest('li');
    const descricao = li.querySelector('.tarefa-descricao').textContent.trim();
    const data = li.querySelector('.tarefa-data').textContent.split(' - ')[0].trim();
    const hora = li.querySelector('.tarefa-data').textContent.split(' - ')[1].trim();

    inputTarefa.value = descricao; // Preenche o input com a descrição da tarefa
    // Remover a tarefa do localStorage e da lista
    removerTarefa(event);
}

// Função para remover uma tarefa
function removerTarefa(event) {
    const li = event.target.closest('li');
    li.remove();

    const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
    const index = tarefas.findIndex(tarefa => tarefa.descricao === li.querySelector('.tarefa-descricao').textContent.trim());
    if (index !== -1) {
        tarefas.splice(index, 1);
    }
    salvarTarefas(tarefas); // Atualiza o localStorage
}

// Função para marcar a tarefa como concluída
function marcarConcluida(event) {
    const checkbox = event.target;
    const li = checkbox.closest('li');
    const descricao = li.querySelector('.tarefa-descricao').textContent.trim();
    const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];

    // Encontrar o índice da tarefa no array de tarefas
    const index = tarefas.findIndex(tarefa => tarefa.descricao === descricao);

    // Se a tarefa existir, atualizar seu status de concluída
    if (index !== -1) {
        tarefas[index].concluida = checkbox.checked;
    }

    salvarTarefas(tarefas); // Atualiza o localStorage

    // Reorganizar as tarefas com as concluídas no final
    reorganizarTarefas();
}

// Função para reorganizar as tarefas com as concluídas no final
function reorganizarTarefas() {
    const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
    const tarefasConcluidas = tarefas.filter(tarefa => tarefa.concluida);
    const tarefasNaoConcluidas = tarefas.filter(tarefa => !tarefa.concluida);
    const todasTarefas = [...tarefasNaoConcluidas, ...tarefasConcluidas];

    // Limpar a lista antes de adicionar novamente
    listaTarefas.innerHTML = '';
    todasTarefas.forEach(tarefa => criarTarefa(tarefa.descricao, tarefa.data, tarefa.hora, tarefa.concluida));

    // Salvar novamente as tarefas no localStorage
    salvarTarefas(todasTarefas);
}

// Função para adicionar nova tarefa
btnAdicionar.addEventListener('click', function() {
    const descricao = inputTarefa.value.trim();
    const data = new Date().toLocaleDateString('pt-BR');
    const hora = new Date().toLocaleTimeString('pt-BR', { hour12: false });

    if (descricao === '') return; // Não adiciona tarefas vazias

    criarTarefa(descricao, data, hora);

    const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
    tarefas.push({ descricao, data, hora, concluida: false });
    salvarTarefas(tarefas); // Salva a tarefa no localStorage

    inputTarefa.value = ''; // Limpa o campo de input

    // Reorganizar as tarefas com as concluídas no final
    reorganizarTarefas();
});

// Carregar as tarefas do localStorage ao carregar a página
carregarTarefas();

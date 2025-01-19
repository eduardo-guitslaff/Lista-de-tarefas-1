let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];

// Função para validar a data
function validarData(data) {
    const dataAtual = new Date(); // Data atual
    const dataInserida = new Date(data); // Transforma o valor da data em um objeto Date

    // Verifica se a data inserida é válida e não está no passado
    if (isNaN(dataInserida.getTime()) || dataInserida < dataAtual) {
        return false;
    }

    return true;
}

// Função para validar o horário
function validarHorario(horario) {
    // Expressão regular para validar o formato HH:mm
    const regexHorario = /^([01]\d|2[0-3]):([0-5]\d)$/;

    return regexHorario.test(horario);
}

function btnAdicionar() {
    const novaTarefa = document.querySelector('.novaTarefa').value.trim();
    const dataTarefa = document.querySelector('.dataTarefa').value;
    const horaTarefa = document.querySelector('.horaTarefa').value;

    if (!novaTarefa) {
        alert('Por favor, digite sua tarefa.');
        return;
    }

    if (!dataTarefa || !validarData(dataTarefa)) {
        alert('Por favor, insira uma data válida.');
        return;
    }

    if (!horaTarefa || !validarHorario(horaTarefa)) {
        alert('Por favor, insira um horário válido no formato HH:mm.');
        return;
    }

    const tarefaObj = {
        descricao: novaTarefa,
        data: dataTarefa,
        hora: horaTarefa
    };

    tarefas.push(tarefaObj);
    criarElementoTarefa(tarefaObj);
    salvarTarefasNoLocalStorage(); // Salvar no localStorage após adicionar a tarefa
    limparCampos();
}

function criarElementoTarefa(tarefaObj) {
    const listas = document.querySelector('.listas');

    const li = document.createElement('li');

    // Descrição
    const descricao = document.createElement('div');
    descricao.className = 'tarefa-descricao';
    descricao.textContent = tarefaObj.descricao;

    // Data e hora
    const data = document.createElement('div');
    data.className = 'tarefa-data';
    data.textContent = `Data: ${tarefaObj.data} | Hora: ${tarefaObj.hora}`;

    // Botões
    const botoes = document.createElement('div');
    botoes.className = 'tarefa-botoes';

    const btnEditar = document.createElement('button');
    btnEditar.textContent = 'Editar';
    btnEditar.classList.add('btn-editar'); // Classe do botão Editar
    btnEditar.onclick = () => editarTarefa(li, tarefaObj);

    const btnRemover = document.createElement('button');
    btnRemover.textContent = 'Remover';
    btnRemover.classList.add('btn-remover'); // Classe do botão Remover
    btnRemover.onclick = () => removerTarefa(li, tarefaObj);

    botoes.appendChild(btnEditar);
    botoes.appendChild(btnRemover);

    // Adiciona os elementos no li
    li.appendChild(descricao); // Primeira linha
    li.appendChild(data); // Segunda linha
    li.appendChild(botoes); // Terceira linha

    listas.appendChild(li);
}

function editarTarefa(li, tarefaObj) {
    // Solicita nova descrição
    const novaDescricao = prompt('Edite sua tarefa:', tarefaObj.descricao);
    if (novaDescricao && novaDescricao.trim() !== '') {
        tarefaObj.descricao = novaDescricao;
    }

    // Solicita nova data e valida
    let novaData;
    do {
        novaData = prompt('Edite a data (AAAA-MM-DD):', tarefaObj.data);
        if (!novaData || validarData(novaData)) {
            break; // Se a data for válida ou o usuário cancelar, sai do loop
        }
        alert('Por favor, insira uma data válida e futura.');
    } while (true);

    if (novaData) {
        tarefaObj.data = novaData; // Atualiza apenas se a nova data for válida
    }

    // Solicita novo horário e valida
    let novaHora;
    do {
        novaHora = prompt('Edite o horário (HH:MM):', tarefaObj.hora);
        if (!novaHora || validarHorario(novaHora)) {
            break; // Se o horário for válido ou o usuário cancelar, sai do loop
        }
        alert('Por favor, insira um horário válido no formato HH:mm.');
    } while (true);

    if (novaHora) {
        tarefaObj.hora = novaHora; // Atualiza apenas se o novo horário for válido
    }

    // Atualiza os elementos no DOM
    li.querySelector('.tarefa-descricao').textContent = tarefaObj.descricao;
    li.querySelector('.tarefa-data').textContent = `Data: ${tarefaObj.data} | Hora: ${tarefaObj.hora}`;

    salvarTarefasNoLocalStorage(); // Salvar no localStorage após editar a tarefa
}

function removerTarefa(li, tarefaObj) {
    const index = tarefas.indexOf(tarefaObj);
    if (index !== -1) {
        tarefas.splice(index, 1);
    }
    li.remove();
    salvarTarefasNoLocalStorage(); // Salvar no localStorage após remover a tarefa
}

function limparCampos() {
    document.querySelector('.novaTarefa').value = '';
    document.querySelector('.dataTarefa').value = '';
    document.querySelector('.horaTarefa').value = '';
    document.querySelector('.novaTarefa').focus();
}

// Função para salvar as tarefas no localStorage
function salvarTarefasNoLocalStorage() {
    localStorage.setItem('tarefas', JSON.stringify(tarefas));  // Salva as tarefas no localStorage
}

// Função para carregar as tarefas do localStorage quando a página for carregada
function carregarTarefas() {
    tarefas.forEach(tarefaObj => {
        criarElementoTarefa(tarefaObj);  // Cria a tarefa na lista
    });
}

// Carregar as tarefas ao carregar a página
window.onload = carregarTarefas;

let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];

function validarData(data) {
    const dataAtual = new Date();
    const dataInserida = new Date(data + 'T00:00'); // Garante que apenas a data seja considerada

    // Zerar horas, minutos e segundos para garantir a comparação correta
    dataAtual.setHours(0, 0, 0, 0);

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
    salvarTarefasNoLocalStorage();
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
    btnEditar.classList.add('btn-editar');
    btnEditar.onclick = () => editarTarefa(li, tarefaObj);

    const btnRemover = document.createElement('button');
    btnRemover.textContent = 'Remover';
    btnRemover.classList.add('btn-remover');
    btnRemover.onclick = () => removerTarefa(li, tarefaObj);

    botoes.appendChild(btnEditar);
    botoes.appendChild(btnRemover);

    // Adiciona os elementos no li
    li.appendChild(descricao);
    li.appendChild(data);
    li.appendChild(botoes);

    listas.appendChild(li);
}

function editarTarefa(li, tarefaObj) {
    const novaDescricao = prompt('Edite sua tarefa:', tarefaObj.descricao);
    if (novaDescricao && novaDescricao.trim() !== '') {
        tarefaObj.descricao = novaDescricao;
    }

    let novaData;
    do {
        novaData = prompt('Edite a data (AAAA-MM-DD):', tarefaObj.data);
        if (!novaData || validarData(novaData)) {
            break;
        }
        alert('Por favor, insira uma data válida e futura.');
    } while (true);

    if (novaData) {
        tarefaObj.data = novaData;
    }

    let novaHora;
    do {
        novaHora = prompt('Edite o horário (HH:MM):', tarefaObj.hora);
        if (!novaHora || validarHorario(novaHora)) {
            break;
        }
        alert('Por favor, insira um horário válido no formato HH:mm.');
    } while (true);

    if (novaHora) {
        tarefaObj.hora = novaHora;
    }

    li.querySelector('.tarefa-descricao').textContent = tarefaObj.descricao;
    li.querySelector('.tarefa-data').textContent = `Data: ${tarefaObj.data} | Hora: ${tarefaObj.hora}`;
    salvarTarefasNoLocalStorage();
}

function removerTarefa(li, tarefaObj) {
    const index = tarefas.indexOf(tarefaObj);
    if (index !== -1) {
        tarefas.splice(index, 1);
    }
    li.remove();
    salvarTarefasNoLocalStorage();
}

function limparCampos() {
    document.querySelector('.novaTarefa').value = '';
    document.querySelector('.dataTarefa').value = '';
    document.querySelector('.horaTarefa').value = '';
    document.querySelector('.novaTarefa').focus();
}

function salvarTarefasNoLocalStorage() {
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

function carregarTarefas() {
    tarefas.forEach(tarefaObj => {
        criarElementoTarefa(tarefaObj);
    });
}

window.onload = carregarTarefas;

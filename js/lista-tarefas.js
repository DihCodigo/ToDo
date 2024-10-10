const btnAddTarefa = document.getElementById('adicionar-tarefa');
const inputText = document.getElementById('nova-tarefa');
const selectEmpresa = document.getElementById('empresa');
const tarefasPendentes = document.querySelector('.tarefas-pendentes');
const tarefasConcluidas = document.querySelector('.tarefas-concluidas');

let tarefas = [];
let contador = 1;

let emailUsuario; 

function setEmailUsuario(email) {
    emailUsuario = email;
}

function obterNomeDoEmail(email) {
    if (email) {
        return email.split('@')[0];
    }
    return 'Usuário';
}

window.onload = function () {
    emailUsuario = localStorage.getItem('emailUsuario');
};

let criaCard = (elementoPai, precisaAjuda, empresa, prazo) => {
    const li = document.createElement('li');
    li.className = 'tarefa';
    
    const nomeUsuario = obterNomeDoEmail(emailUsuario);
    console.log(nomeUsuario);

    li.innerHTML = `
        <div class="not-done"></div>
        <div class="descripcion">
            <p class="nome">${contador} - ${inputText.value} <span class="criador">(Criado por: ${nomeUsuario})</span></p>
            <p class="empresa">(Cliente: ${empresa})</p>
            <p class="data-criacao">Tarefa cadastrada em: ${dataAtual()}</p>
            <p class="data-prazo">Prazo da tarefa: ${definePrazoTarefa(prazo)}</p>
            <img class="excluir" src="assets/trash_icon.png" alt="Remover tarefa">
            <button class="ajuda">Solicitar ajuda</button>
            <span class="ajuda-icon" style="font-size:44px; display: ${precisaAjuda ? 'inline' : 'none'};">🤝</span>
            <button class="add-comentario">Adicionar comentário</button>
            <span class="comentario-notificacao" style="display:none; color: red;">🔔</span>
            <div class="comentarios"></div>
        </div>
    `;

    tarefas.push({ nome: inputText.value, empresa, prazo, concluida: false });

    verificarPrazoVencido({ nome: inputText.value, empresa, prazo });

    const notDoneDiv = li.querySelector('.not-done');
    notDoneDiv.addEventListener('click', () => {
        if (confirm("Deseja confirmar a conclusão da tarefa?")) {
            tarefasConcluidas.appendChild(li);
            notDoneDiv.remove();
        }
    });

    const excluirBtn = li.querySelector('.excluir');
    excluirBtn.addEventListener('click', () => {
        elementoPai.removeChild(li);
    });

    const ajudaBtn = li.querySelector('.ajuda');
    const ajudaIcon = li.querySelector('.ajuda-icon');
    ajudaBtn.addEventListener('click', () => {
        ajudaIcon.style.display = 'inline';
        const ajudanteParagrafo = document.createElement('p');
        ajudanteParagrafo.className = 'ajudante';
        ajudanteParagrafo.textContent = `Ajudante: ${nomeUsuario}`; // Usa o nome do usuário logado
        li.querySelector('.descripcion').appendChild(ajudanteParagrafo);
    });

    const comentarioBtn = li.querySelector('.add-comentario');
    const comentarioNotificacao = li.querySelector('.comentario-notificacao');
    const comentariosDiv = li.querySelector('.comentarios');

    comentarioBtn.addEventListener('click', () => {
        const comentario = prompt("Adicione seu comentário:");

        if (comentario) {
            const comentarioParagrafo = document.createElement('p');
            comentarioParagrafo.className = 'comentario';
            comentarioParagrafo.textContent = `${nomeUsuario}: ${comentario}`; // Usa o nome do usuário logado
            comentariosDiv.appendChild(comentarioParagrafo);
            comentarioNotificacao.style.display = 'inline';
            comentarioNotificacao.style.color = 'red';

            comentarioNotificacao.addEventListener('click', () => {
                comentarioNotificacao.style.color = 'green';
                comentarioNotificacao.style.display = 'inline';
            });
        }
    });

    elementoPai.appendChild(li);
    contador++;
}

const dataAtual = () => {
    return new Date().toLocaleDateString('pt-BR', { timeZone: 'UTC' });
}

const definePrazoTarefa = (prazo) => {
    const dataAtual = new Date();
    const [hora, minuto] = prazo.split(':');
    dataAtual.setHours(hora, minuto, 0, 0);
    return dataAtual.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

const verificarPrazoVencido = (tarefa) => {
    const dataAtual = new Date();
    const dataPrazo = new Date(tarefa.prazo);
    if (dataPrazo < dataAtual) {
        mostrarNotificacao(tarefa);
    }
}

const mostrarNotificacao = (tarefa) => {
    const notificacoesDiv = document.getElementById('notificacoes');
    const p = document.createElement('p');
    p.textContent = `⚠️ Prazo estourado para a tarefa "${tarefa.nome}" (Cliente: ${tarefa.empresa}).`;
    p.style.color = 'red';
    notificacoesDiv.appendChild(p);
}

btnAddTarefa.addEventListener('click', function (evt) {
    evt.preventDefault();

    const tarefaTexto = inputText.value;
    const empresaSelecionada = selectEmpresa.value;
    const prazo = document.getElementById('prazo').value;

    const precisaAjuda = confirm("Essa tarefa precisa de ajuda?");

    if (tarefaTexto && empresaSelecionada && prazo) {
        criaCard(tarefasPendentes, precisaAjuda, empresaSelecionada, prazo);
        inputText.value = '';
    } else {
        alert('Por favor, preencha todos os campos.');
    }
});

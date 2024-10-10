var button = document.getElementById("button");
const tarefasPendentes = document.querySelector('.tarefas-pendentes');
const tarefasConcluidas = document.querySelector('.tarefas-concluidas');

button.addEventListener('click', function (evento) {
    evento.preventDefault();
    buscaTodosApiNova();
});

function createNode(element) {
    return document.createElement(element);
}

function append(parent, el) {
    return parent.appendChild(el);
}

function buscaTodosApiNova() {
    const url = 'https://jsonplaceholder.typicode.com/users/5/todos';

    fetch(url)
        .then((resp) => resp.json())
        .then(function (data) {
            let tarefas = data;
            tarefas.forEach(function (tarefa) {
                let li = createNode('li');
                li.className = 'tarefa';
                li.innerHTML = `
                    <div class="not-done"></div>
                    <div class="descripcion">
                        <p class="nome">${tarefa.id} - ${tarefa.title}</p>
                        <img class="excluir" src="assets/trash_icon.png" alt="Remover tarefa" onclick="deletarTarefa(${tarefa.id})">
                    </div>
                `;

                if (tarefa.completed) {
                    append(tarefasConcluidas, li);
                } else {
                    append(tarefasPendentes, li);
                }
            });
        })
        .catch(function (error) {
            console.log(error);
        });
}

function deletarTarefa(id) {
    const tarefa = document.querySelector(`.tarefa .nome:contains('${id}')`).closest('li.tarefa');
    if (tarefa) {
        tarefa.remove();
        console.log(`Tarefa com ID ${id} deletada.`);
    } else {
        console.log(`Tarefa com ID ${id} não encontrada.`);
    }
}

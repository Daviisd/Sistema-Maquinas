let todosManuais = [];

async function carregarManuais() {

    try {

        const resposta = await fetch("/manuais");

        todosManuais = await resposta.json();

        mostrarManuais(todosManuais);

    }

    catch (erro) {

        console.error(erro);

    }

}

function mostrarManuais(lista) {

    const perfil = localStorage.getItem("perfil");
    const div = document.getElementById("listaManuais");

    div.innerHTML = "";

    if (lista.length === 0) {

        div.innerHTML = "<p>Nenhum manual cadastrado.</p>";

        return;

    }

    lista.forEach(manual => {

    const botoesInstrutor = perfil === "instrutor" ? `

    <button onclick="excluirManual(${manual.id})">

        🗑 Excluir

    </button>

` : "";

    div.innerHTML += `

    <div class="card">

        <div class="card-topo">

            <div class="icone-maquina">
                📘
            </div>

            <h3>${manual.titulo}</h3>

        </div>

        <div class="info">

            <p><strong>Máquina:</strong> ${manual.maquina}</p>

            <p>${manual.descricao}</p>

        </div>
        <a
            href="/uploads/manuais/${manual.arquivo}"
            target="_blank">

            <button>

        📥 Abrir Manual

         </button>

        </a>


    
        ${botoesInstrutor}

    </div>

    `;

});



}

document.getElementById("campoPesquisa").addEventListener("input", function(){

    const texto = this.value.toLowerCase();

    const filtrados = todosManuais.filter(m =>

        m.titulo.toLowerCase().includes(texto) ||

        m.maquina.toLowerCase().includes(texto)

    );

    mostrarManuais(filtrados);

});

carregarManuais();

async function excluirManual(id){

    const confirmar = confirm(

        "Deseja realmente excluir este manual?"

    );

    if(!confirmar){

        return;

    }

    const resposta = await fetch(

        `/manuais/${id}`,

        {

            method:"DELETE"

        }

    );

    const dados = await resposta.json();

    alert(dados.mensagem);

    carregarManuais();

}
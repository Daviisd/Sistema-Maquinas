let todasManutencoes = [];

const perfil = localStorage.getItem("perfil");

async function carregarManutencoes(){

    try{

        const resposta = await fetch("/manutencoes");

        todasManutencoes = await resposta.json();

        mostrarManutencoes(todasManutencoes);

    }

    catch(erro){

        console.error(erro);

    }

}

function mostrarManutencoes(lista){

    const div = document.getElementById("listaManutencoes");

    div.innerHTML = "";

    if(lista.length===0){

        div.innerHTML="<p>Nenhuma manutenção cadastrada.</p>";

        return;

    }

    lista.forEach(m=>{

        div.innerHTML += `

        <div class="card">

        <div class="card-topo">

        <div class="icone-maquina">
            🔧
        </div>

        <h3>${m.tipo}</h3>

        </div>

        <p><strong>Máquina:</strong> ${m.maquina}</p>

        <p><strong>Data:</strong> ${m.data}</p>

        <p><strong>Responsável:</strong> ${m.responsavel}</p>

        <p>${m.descricao}</p>

        ${
        perfil === "instrutor"
        ?
        `<button onclick="excluirManutencao(${m.id})">
            🗑 Excluir
        </button>`
        :
        ""
        }

        </div>

        `;

    });

}

document.getElementById("campoPesquisa").addEventListener("input",function(){

    const texto=this.value.toLowerCase();

    const filtradas=todasManutencoes.filter(m=>

        (m.maquina || "").toLowerCase().includes(texto) ||

        (m.responsavel || "").toLowerCase().includes(texto) ||

        (m.tipo || "").toLowerCase().includes(texto)

    );

    mostrarManutencoes(filtradas);

});

const menuCadastro=document.getElementById("menuCadastroManutencao");

if(perfil!=="instrutor"){

    if(menuCadastro){

        menuCadastro.style.display="none";

    }

}

const logout=document.getElementById("menuLogout");

logout.addEventListener("click",function(e){

    e.preventDefault();

    localStorage.clear();

    window.location.href="login.html";

});

async function excluirManutencao(id){

    const confirmar = confirm(

        "Deseja realmente excluir esta manutenção?"

    );

    if(!confirmar){

        return;

    }

    try{

        const resposta = await fetch(

            `/manutencoes/${id}`,

            {

                method:"DELETE"

            }

        );

        const dados = await resposta.json();

        alert(dados.mensagem);

        carregarManutencoes();

    }

    catch(erro){

        console.error(erro);

        alert("Erro ao excluir manutenção.");

    }

}

carregarManutencoes();
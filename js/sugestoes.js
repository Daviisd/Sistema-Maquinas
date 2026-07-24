const perfil = localStorage.getItem("perfil");

if(perfil !== "instrutor"){

    alert("Acesso permitido apenas para instrutores.");

    window.location.href = "index.html";

}

let todasSugestoes = [];

async function carregarSugestoes() {

    try {

        const resposta = await fetch("http://localhost:3000/sugestoes");

        todasSugestoes = await resposta.json();

        mostrarSugestoes(todasSugestoes);

    }

    catch (erro) {

        console.error(erro);

    }

}

function mostrarSugestoes(lista) {

    const div = document.getElementById("listaSugestoes");

    div.innerHTML = "";

    if(lista.length === 0){

        div.innerHTML = "<p>Nenhuma sugestão encontrada.</p>";

        return;

    }

    lista.forEach(sugestao => {

        div.innerHTML += `

        <div class="card">

            <h3>${sugestao.tipo}</h3>

            <p><strong>Nome:</strong> ${sugestao.nome}</p>

            <p><strong>Data:</strong> ${sugestao.data}</p>

            <p><strong>Status:</strong> ${sugestao.status}</p>

            <hr>

            <p>${sugestao.mensagem}</p>

            <button onclick="excluirSugestao(${sugestao.id})">

                🗑 Excluir

            </button>

        </div>

        `;

    });

}

document.getElementById("campoPesquisa").addEventListener("input", function(){

    const texto = this.value.toLowerCase();

    const filtradas = todasSugestoes.filter(s =>

        s.nome.toLowerCase().includes(texto) ||

        s.tipo.toLowerCase().includes(texto) ||

        s.mensagem.toLowerCase().includes(texto)

    );

    mostrarSugestoes(filtradas);

});

async function excluirSugestao(id){

    const confirmar = confirm(

        "Deseja excluir esta sugestão?"

    );

    if(!confirmar){

        return;

    }

    const resposta = await fetch(

        `http://localhost:3000/sugestoes/${id}`,

        {

            method:"DELETE"

        }

    );

    const dados = await resposta.json();

    alert(dados.mensagem);

    carregarSugestoes();

}

const logout = document.getElementById("menuLogout");

logout.addEventListener("click", function(e){

    e.preventDefault();

    localStorage.clear();

    window.location.href="login.html";

});

carregarSugestoes();
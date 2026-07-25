// ======================================
// LER O ID DA URL (opcional)
// ======================================

const parametros = new URLSearchParams(window.location.search);

const maquinaIdURL = parametros.get("maquinaId");

// ======================================
// CARREGAR AS MÁQUINAS
// ======================================

async function carregarMaquinas(){

    try{

        const resposta = await fetch("/maquinas");

        const maquinas = await resposta.json();

        const select = document.getElementById("maquina");

        maquinas.forEach(maquina=>{

            const option = document.createElement("option");

            option.value = maquina.id;

            option.textContent = maquina.nome;

            if(maquina.id == maquinaIdURL){

                option.selected = true;

            }

            select.appendChild(option);

        });

    }

    catch(erro){

        console.error(erro);

    }

}

carregarMaquinas();

// ======================================
// FORMULÁRIO
// ======================================

const formulario = document.getElementById("formManutencao");

formulario.addEventListener("submit", async function (evento) {

    evento.preventDefault();

    const manutencao = {

        maquinaId: Number(document.getElementById("maquina").value),

        tipo: document.getElementById("tipo").value,

        data: document.getElementById("data").value,

        responsavel: document.getElementById("responsavel").value,

        descricao: document.getElementById("descricao").value

    };

    try {

        const resposta = await fetch("/manutencoes", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(manutencao)

        });

        const dados = await resposta.json();

        alert(dados.mensagem);

        window.location.href = `maquina.html?id=${maquinaId}`;

    }

    catch (erro) {

        console.error(erro);

        alert("Erro ao cadastrar manutenção.");

    }

});
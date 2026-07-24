// Obtém o ID da máquina pela URL
const parametros = new URLSearchParams(window.location.search);

const id = parametros.get("id");

// Carrega os dados da máquina
async function carregarMaquina() {

    try {

        const resposta = await fetch(`http://localhost:3000/maquinas/${id}`);

        const maquina = await resposta.json();

        document.getElementById("nome").value = maquina.nome;

        document.getElementById("fabricante").value = maquina.fabricante;

        document.getElementById("modelo").value = maquina.modelo;

        document.getElementById("localizacao").value = maquina.localizacao;

        document.getElementById("status").value = maquina.status;

        document.getElementById("descricao").value = maquina.descricao;

    } catch (erro) {

        console.error(erro);

        alert("Erro ao carregar a máquina.");

    }

}

carregarMaquina();

// Atualiza a máquina
const formulario = document.getElementById("formEditar");

formulario.addEventListener("submit", async function(evento){

    evento.preventDefault();

    const maquina = {

        nome: document.getElementById("nome").value,

        fabricante: document.getElementById("fabricante").value,

        modelo: document.getElementById("modelo").value,

        localizacao: document.getElementById("localizacao").value,

        status: document.getElementById("status").value,

        descricao: document.getElementById("descricao").value

    };

    try {

        const resposta = await fetch(

            `http://localhost:3000/maquinas/${id}`,

            {

                method: "PUT",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify(maquina)

            }

        );

        const dados = await resposta.json();

        alert(dados.mensagem);

        window.location.href = `maquina.html?id=${id}`;

    }

    catch(erro){

        console.error(erro);

        alert("Erro ao atualizar máquina.");

    }

});
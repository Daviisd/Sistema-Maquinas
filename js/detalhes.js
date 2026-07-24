// Pega o ID que está na URL
const parametros = new URLSearchParams(window.location.search);

const id = parametros.get("id");

// Função para buscar a máquina
async function carregarMaquina() {

    try {

        const resposta = await fetch(`http://localhost:3000/maquinas/${id}`);

        if (!resposta.ok) {

            throw new Error("Máquina não encontrada.");

        }

        const maquina = await resposta.json();

        // Preenche os campos da página

        document.getElementById("nome").textContent = maquina.nome;

        document.getElementById("fabricante").textContent = maquina.fabricante;

        document.getElementById("modelo").textContent = maquina.modelo;

        document.getElementById("localizacao").textContent = maquina.localizacao;

        document.getElementById("status").textContent = maquina.status;

        document.getElementById("descricao").textContent = maquina.descricao;

    } catch (erro) {

        console.error(erro);

        alert("Não foi possível carregar a máquina.");

    }

}

// Executa automaticamente
carregarMaquina();
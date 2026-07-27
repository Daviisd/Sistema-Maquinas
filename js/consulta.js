const parametros = new URLSearchParams(window.location.search);

const id = parametros.get("id");

async function carregarConsulta() {

    try {

        const resposta = await fetch(`/maquinas/${id}`);

        const maquina = await resposta.json();

        document.getElementById("nomeMaquina").textContent = maquina.nome;
        document.getElementById("fabricante").textContent = maquina.fabricante;
        document.getElementById("modelo").textContent = maquina.modelo;
        document.getElementById("localizacao").textContent = maquina.localizacao;
        document.getElementById("status").textContent = maquina.status;
        document.getElementById("descricao").textContent = maquina.descricao;

        carregarManual();

    }

    catch (erro) {

        alert("Erro ao carregar máquina.");

    }

}

async function carregarManual() {

    try {

        const resposta = await fetch("/manuais");

        const manuais = await resposta.json();

        const manual = manuais.find(m => m.maquinaId == id);

        const area = document.getElementById("manualArea");

        if (!manual) {

            area.innerHTML = "<p>Nenhum manual disponível.</p>";

            return;

        }

        area.innerHTML = `

            <a href="/uploads/manuais/${manual.arquivo}" target="_blank">

                📄 Abrir Manual em PDF

            </a>

        `;

    }

    catch (erro) {

        console.error(erro);

    }

}

carregarConsulta();
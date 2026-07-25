// ==========================================
// VARIÁVEIS
// ==========================================

let todasMaquinas = [];

const perfil = localStorage.getItem("perfil");

// ==========================================
// CARREGAR MÁQUINAS
// ==========================================

async function carregarMaquinas() {

    try {

        const resposta = await fetch("/maquinas");

        todasMaquinas = await resposta.json();

        mostrarMaquinas(todasMaquinas);

    }

    catch (erro) {

        console.error("Erro ao carregar máquinas:", erro);

        alert("Erro ao carregar máquinas.");

    }

}

// ==========================================
// MOSTRAR MÁQUINAS
// ==========================================

function mostrarMaquinas(lista) {

    const div = document.getElementById("lista-maquinas");

    div.innerHTML = "";

    if (lista.length === 0) {

        div.innerHTML = "<p>Nenhuma máquina cadastrada.</p>";

        return;

    }

    lista.forEach(maquina => {

        let corStatus = "#28a745";

        if (maquina.status === "Em manutenção") {

            corStatus = "#ffc107";

        }

        if (maquina.status === "Interditada") {

            corStatus = "#dc3545";

        }

        let botoes = `

            <button onclick="abrirMaquina(${maquina.id})">

                👁 Ver detalhes

            </button>

        `;

        if (perfil === "instrutor") {

            botoes += `

                <button
                    onclick="editarMaquina(${maquina.id})">

                    ✏ Editar

                </button>

            `;

        }

        div.innerHTML += `

        <div class="card">

            <div class="card-topo">

                <div class="icone-maquina">

                    🖥️

                </div>

                <h3>${maquina.nome}</h3>

            </div>

            <p>

                <strong>Fabricante:</strong>

                ${maquina.fabricante}

            </p>

            <p>

                <strong>Modelo:</strong>

                ${maquina.modelo}

            </p>

            <p>

                <strong>Localização:</strong>

                ${maquina.localizacao}

            </p>

            <p>

                <strong>Status:</strong>

                <span
                    style="color:${corStatus};
                    font-weight:bold;">

                    ${maquina.status}

                </span>

            </p>

            ${botoes}

        </div>

        `;

    });

}

// ==========================================
// PESQUISA
// ==========================================

document.getElementById("pesquisa").addEventListener("input", function () {

    const texto = this.value.toLowerCase();

    const filtradas = todasMaquinas.filter(maquina =>

        maquina.nome.toLowerCase().includes(texto) ||

        maquina.fabricante.toLowerCase().includes(texto) ||

        maquina.modelo.toLowerCase().includes(texto)

    );

    mostrarMaquinas(filtradas);

});

// ==========================================
// BOTÕES
// ==========================================

function abrirMaquina(id) {

    window.location.href = `maquina.html?id=${id}`;

}

function editarMaquina(id) {

    window.location.href = `editar-maquina.html?id=${id}`;

}

// ==========================================
// MENU
// ==========================================

const menuCadastro = document.getElementById("menuCadastro");

if (perfil !== "instrutor") {

    if (menuCadastro) {

        menuCadastro.style.display = "none";

    }

}

// ==========================================
// INICIAR
// ==========================================

carregarMaquinas();
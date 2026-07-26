
let todasMaquinas = [];
// ==========================================
// VERIFICA SE O USUÁRIO ESTÁ LOGADO
// ==========================================

const perfil = localStorage.getItem("perfil");
const usuario = localStorage.getItem("usuario");

if (!perfil || !usuario) {
    window.location.href = "login.html";
}


const menuUsuarios = document.getElementById("menuUsuarios");

if (perfil !== "instrutor") {

    if (menuUsuarios) {

        menuUsuarios.style.display = "none";

    }

}


async function carregarDashboard(){

    try{

        const resposta = await fetch("/dashboard");

        const dados = await resposta.json();

        document.getElementById("totalMaquinas").textContent = dados.maquinas;

        document.getElementById("totalDisponiveis").textContent = dados.disponiveis;

        document.getElementById("totalManutencao").textContent = dados.manutencao;

        document.getElementById("totalInterditadas").textContent = dados.interditadas;

        

    }

    catch(erro){

        console.error("Erro ao carregar dashboard:", erro);

    }

}


// ==========================================
// CARREGAR MÁQUINAS
// ==========================================

async function carregarMaquinas() {

    try {

        const resposta = await fetch("/maquinas");

        todasMaquinas = await resposta.json();

        const lista = document.getElementById("lista-maquinas");

        lista.innerHTML = "";

        todasMaquinas.forEach(maquina => {

            lista.innerHTML += `
            <div class="card">

            <div class="card-topo">

             <div class="icone-maquina">
            🖥️
            </div>

            <h3>${maquina.nome}</h3>
        
            </div>

            <div class="info">

            <p>🏭 <strong>Fabricante:</strong> ${maquina.fabricante}</p>

            <p>⚙ <strong>Modelo:</strong> ${maquina.modelo}</p>

            <p>📍 <strong>Local:</strong> ${maquina.localizacao}</p>

            <p class="status ${maquina.status.toLowerCase().replace(/\s/g,'-')}">

            ${maquina.status}

                </p>

                </div>

                <button onclick="abrirMaquina(${maquina.id})">

                Acessar Máquina

                </button>

                </div>
            `;

        });

    } catch (erro) {

        console.error("Erro ao carregar máquinas:", erro);

    }

}

// ==========================================
// ABRIR DETALHES DA MÁQUINA
// ==========================================

function abrirMaquina(id) {

    window.location.href = `maquina.html?id=${id}`;

}

// ==========================================
// CONTROLE DE PERMISSÃO
// ==========================================

const menuCadastro = document.getElementById("menuCadastro");

if (perfil === "aluno") {

    menuCadastro.style.display = "none";

}

// ==========================================
// LOGOUT
// ==========================================

const menuLogout = document.getElementById("menuLogout");

if(menuLogout){

    menuLogout.addEventListener("click", function(e){

        e.preventDefault();

        localStorage.removeItem("perfil");

        localStorage.removeItem("usuario");

        localStorage.removeItem("idUsuario");

        window.location.href = "login.html";

    });

}

// ==========================================
// INICIAR A PÁGINA
// ==========================================

function pesquisarMaquinas(){

    const texto = document
        .getElementById("campoPesquisa")
        .value
        .toLowerCase();

    const lista = document.getElementById("lista-maquinas");

    lista.innerHTML = "";

    const filtradas = todasMaquinas.filter(maquina =>

        maquina.nome.toLowerCase().includes(texto)

    );

    filtradas.forEach(maquina => {

        lista.innerHTML += `

        <div class="card">

            <div class="card-topo">

                <div class="icone-maquina">🖥️</div>

                <h3>${maquina.nome}</h3>

            </div>

            <div class="info">

                <p>🏭 <strong>Fabricante:</strong> ${maquina.fabricante}</p>

                <p>⚙ <strong>Modelo:</strong> ${maquina.modelo}</p>

                <p>📍 <strong>Local:</strong> ${maquina.localizacao}</p>

                <p class="status ${maquina.status.toLowerCase().replace(/\s/g,'-')}">

                    ${maquina.status}

                </p>

            </div>

            <button onclick="abrirMaquina(${maquina.id})">

                Acessar Máquina

            </button>

        </div>

        `;

    });

}

const menuManual = document.getElementById("menuManual");

if(perfil !== "instrutor"){

    if(menuManual){

        menuManual.style.display = "none";

    }

}



const formSugestao = document.getElementById("formSugestao");

if (formSugestao) {

    formSugestao.addEventListener("submit", async function(e){

        e.preventDefault();

        const sugestao = {

            nome: document.getElementById("nome").value,

            tipo: document.getElementById("tipo").value,

            mensagem: document.getElementById("mensagem").value

        };

        try{

            const resposta = await fetch(

                "/sugestoes",

                {

                    method:"POST",

                    headers:{

                        "Content-Type":"application/json"

                    },

                    body:JSON.stringify(sugestao)

                }

            );

            const dados = await resposta.json();

            alert(dados.mensagem);

            formSugestao.reset();

        }

        catch(erro){

            console.error(erro);

            alert("Erro ao enviar sugestão.");

        }

    });

}


carregarDashboard();

carregarMaquinas();

document
    .getElementById("campoPesquisa")
    .addEventListener("input", pesquisarMaquinas);
let todosUsuarios = [];

const perfil = localStorage.getItem("perfil");

// Apenas instrutores podem acessar
if (perfil !== "instrutor") {

    alert("Acesso permitido apenas para instrutores.");

    window.location.href = "index.html";

}

// ======================================
// CARREGAR USUÁRIOS
// ======================================

async function carregarUsuarios() {

    try {

        const resposta = await fetch("/usuarios");

        todosUsuarios = await resposta.json();

        mostrarUsuarios(todosUsuarios);

    }

    catch (erro) {

        console.error("Erro ao carregar usuários:", erro);

    }

}

// ======================================
// MOSTRAR USUÁRIOS
// ======================================

function mostrarUsuarios(lista) {

    const div = document.getElementById("listaUsuarios");

    div.innerHTML = "";

    if (lista.length === 0) {

        div.innerHTML = "<p>Nenhum usuário cadastrado.</p>";

        return;

    }

    const usuarioLogado = Number(localStorage.getItem("idUsuario"));

    lista.forEach(usuario => {

        const podeExcluir = usuario.id !== usuarioLogado;

        div.innerHTML += `

        <div class="card">

            <h3>${usuario.nome}</h3>

            <p><strong>Usuário:</strong> ${usuario.usuario}</p>

            <p><strong>Perfil:</strong> ${usuario.perfil}</p>

            ${
                podeExcluir
                ?
                `<button onclick="excluirUsuario(${usuario.id})">

                    🗑️ Excluir

                </button>`
                :
                ""
            }

        </div>

        `;

    });

}

// ======================================
// PESQUISA
// ======================================

document.getElementById("campoPesquisa").addEventListener("input", function () {

    const texto = this.value.toLowerCase();

    const filtrados = todosUsuarios.filter(u =>

        u.nome.toLowerCase().includes(texto) ||

        u.usuario.toLowerCase().includes(texto)

    );

    mostrarUsuarios(filtrados);

});

// ======================================
// EDITAR USUÁRIO
// ======================================

function editarUsuario(id) {

    window.location.href = `editar-usuario.html?id=${id}`;

}

// ======================================
// EXCLUIR USUÁRIO
// ======================================

async function excluirUsuario(id) {

    const confirmar = confirm(

        "Deseja realmente excluir este usuário?"

    );

    if (!confirmar) {

        return;

    }

    try {

        const resposta = await fetch(

            `/usuarios/${id}`,

            {

                method: "DELETE"

            }

        );

        const dados = await resposta.json();

        alert(dados.mensagem);

        carregarUsuarios();

    }

    catch (erro) {

        console.error("Erro ao excluir usuário:", erro);

        alert("Erro ao excluir usuário.");

    }

}

// ======================================
// LOGOUT
// ======================================

const logout = document.getElementById("menuLogout");

logout.addEventListener("click", function (e) {

    e.preventDefault();

    localStorage.clear();

    window.location.href = "login.html";

});

// ======================================
// INICIAR PÁGINA
// ======================================

carregarUsuarios();
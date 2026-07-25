// ======================================
// LER O ID DA MÁQUINA PELA URL
// Exemplo:
// maquina.html?id=1
// ======================================

const parametros = new URLSearchParams(window.location.search);

const id = parametros.get("id");

// ======================================
// CARREGAR DADOS DA MÁQUINA
// ======================================

async function carregarMaquina() {

    try {

        const resposta = await fetch(`/maquinas/${id}`);

        if (!resposta.ok) {

            throw new Error("Máquina não encontrada.");

        }

        const maquina = await resposta.json();

        document.getElementById("nomeMaquina").textContent = maquina.nome;

        document.getElementById("fabricante").textContent = maquina.fabricante;

        document.getElementById("modelo").textContent = maquina.modelo;

        document.getElementById("localizacao").textContent = maquina.localizacao;

        document.getElementById("status").textContent = maquina.status;

        document.getElementById("descricao").textContent = maquina.descricao;

    }

    catch (erro) {

        console.error("Erro ao carregar máquina:", erro);

        alert("Não foi possível carregar a máquina.");

    }

}

// ======================================
// CARREGAR HISTÓRICO DE MANUTENÇÕES
// ======================================

async function carregarManutencoes() {

    try {

        const resposta = await fetch(`/manutencoes/${id}`);

        if (!resposta.ok) {

            throw new Error("Erro ao buscar manutenções.");

        }

        const manutencoes = await resposta.json();

        const tabela = document.getElementById("tabelaManutencoes");

        tabela.innerHTML = "";

        if (manutencoes.length === 0) {

            tabela.innerHTML = `

                <tr>

                    <td colspan="4" style="text-align:center;">

                        Nenhuma manutenção cadastrada.

                    </td>

                </tr>

            `;

            return;

        }

        manutencoes.forEach(manutencao => {

            tabela.innerHTML += `

                <tr>

                    <td>${manutencao.data}</td>

                    <td>${manutencao.tipo}</td>

                    <td>${manutencao.responsavel}</td>

                    <td>${manutencao.descricao}</td>

                </tr>

            `;

        });

    }

    catch (erro) {

        console.error("Erro ao carregar manutenções:", erro);

    }

}

// ======================================
// CONTROLE DE PERMISSÃO
// ======================================

const perfil = localStorage.getItem("perfil");

const botaoNovaManutencao = document.getElementById("btnNovaManutencao");

const botaoEditar = document.getElementById("btnEditar");

const botaoExcluir = document.getElementById("btnExcluir");

// Apenas instrutor pode editar ou cadastrar manutenção

if (perfil !== "instrutor") {

    if (botaoNovaManutencao) {

        botaoNovaManutencao.style.display = "none";

    }

    if (botaoEditar) {

        botaoEditar.style.display = "none";

    }

    if (botaoExcluir) {

        botaoExcluir.style.display = "none";

    }

}

// ======================================
// BOTÃO NOVA MANUTENÇÃO
// ======================================

if (botaoNovaManutencao) {

    botaoNovaManutencao.addEventListener("click", function () {

        window.location.href = `cadastro-manutencao.html?maquinaId=${id}`;

    });

}

// ======================================
// BOTÃO EDITAR MÁQUINA
// ======================================

if (botaoEditar) {

    botaoEditar.addEventListener("click", function () {

        window.location.href = `editar-maquina.html?id=${id}`;

    });

}

// ======================================
// BOTÃO EXCLUIR MÁQUINA
// ======================================

if (botaoExcluir) {

    botaoExcluir.addEventListener("click", async function () {

        const confirmar = confirm(

            "Deseja realmente excluir esta máquina?\n\nEsta ação não poderá ser desfeita."

        );

        if (!confirmar) {

            return;

        }

        try {

            const resposta = await fetch(

                `/maquinas/${id}`,

                {

                    method: "DELETE"

                }

            );

            const dados = await resposta.json();

            alert(dados.mensagem);

            window.location.href = "index.html";

        }

        catch (erro) {

            console.error(erro);

            alert("Erro ao excluir máquina.");

        }

    });

}



// ======================================
// INICIAR A PÁGINA
// ======================================

carregarMaquina();

carregarManutencoes();
const selectMaquina = document.getElementById("maquina");

// ================================
// Carregar máquinas
// ================================

async function carregarMaquinas(){

    try{

        const resposta = await fetch("/maquinas");

        const maquinas = await resposta.json();

        maquinas.forEach(maquina=>{

            selectMaquina.innerHTML += `

                <option value="${maquina.id}">

                    ${maquina.nome}

                </option>

            `;

        });

    }

    catch(erro){

        console.error(erro);

        alert("Erro ao carregar máquinas.");

    }

}

carregarMaquinas();

// ================================
// Salvar manual
// ================================

document.getElementById("formManual").addEventListener("submit", async function(e){

    e.preventDefault();

    const formData = new FormData();

    formData.append(
        "maquinaId",
        document.getElementById("maquina").value
    );

    formData.append(
        "titulo",
        document.getElementById("titulo").value
    );

    formData.append(
        "descricao",
        document.getElementById("descricao").value
    );

    formData.append(
        "arquivo",
        document.getElementById("arquivo").files[0]
    );

    try{

        const resposta = await fetch(

            "/manuais",

            {

                method:"POST",

                body:formData

            }

        );

        const dados = await resposta.json();

        alert(dados.mensagem);

        document.getElementById("formManual").reset();

    }

    catch(erro){

        console.error(erro);

        alert("Erro ao enviar manual.");

    }

});
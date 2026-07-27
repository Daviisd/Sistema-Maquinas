const formulario = document.getElementById("formMaquina");

formulario.addEventListener("submit", async function(evento){

    evento.preventDefault();

    const formData = new FormData();

    formData.append(
        "nome",
        document.getElementById("nome").value
    );

    formData.append(
        "fabricante",
        document.getElementById("fabricante").value
    );

    formData.append(
        "modelo",
        document.getElementById("modelo").value
    );

    formData.append(
        "localizacao",
        document.getElementById("localizacao").value
    );

    formData.append(
        "status",
        document.getElementById("status").value
    );

    formData.append(
        "descricao",
        document.getElementById("descricao").value
    );

    // Manual PDF
    const manual = document.getElementById("manual").files[0];

    if(manual){

        formData.append("manual", manual);

    }

    try{

        const resposta = await fetch("/maquinas",{

            method:"POST",

            body: formData

        });

        const dados = await resposta.json();

        alert(dados.mensagem);

        formulario.reset();

        window.location.href = `maquina.html?id=${dados.id}`;

    }

    catch(erro){

        console.error(erro);

        alert("Erro ao cadastrar máquina.");

    }

});
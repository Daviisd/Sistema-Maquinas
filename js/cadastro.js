const formulario = document.getElementById("formMaquina");


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
            "/maquinas",
            {

                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify(maquina)

            }
        );



        const dados = await resposta.json();



        alert(dados.mensagem);



        formulario.reset();



    } catch(erro){


        console.error(
            "Erro:",
            erro
        );


        alert(
            "Erro ao cadastrar máquina"
        );


    }


});
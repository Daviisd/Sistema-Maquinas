const formulario = document.getElementById("formLogin");

const mensagemErro = document.getElementById("mensagemErro");

formulario.addEventListener("submit", async function(evento){

    evento.preventDefault();

    // Limpa mensagens antigas
    mensagemErro.textContent = "";

    // Lê os campos da tela
    const usuario = document.getElementById("usuario").value;

    const senha = document.getElementById("senha").value;

    try{

        const resposta = await fetch("http://127.0.0.1:3000/login", {

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body: JSON.stringify({

                usuario: usuario,

                senha: senha

            })

        });

        const dados = await resposta.json();

        if(dados.sucesso){

            // Guarda quem entrou
            localStorage.setItem("perfil", dados.perfil);

            localStorage.setItem("usuario", dados.usuario);

            localStorage.setItem("idUsuario", dados.id);

            alert("Bem-vindo " + dados.usuario + "!");

            window.location.href="index.html";

        }else{

            mensagemErro.textContent = dados.mensagem;

        }

    }catch(erro){

    console.error("ERRO COMPLETO:", erro);

    alert("Erro ao conectar ao servidor.");

}

});
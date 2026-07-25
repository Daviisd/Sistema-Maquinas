const id = new URLSearchParams(window.location.search).get("id");

async function carregarUsuario(){

    const resposta = await fetch(

        `/usuarios/${id}`

    );

    const usuario = await resposta.json();

    document.getElementById("nome").value = usuario.nome;

    document.getElementById("usuario").value = usuario.usuario;

    document.getElementById("perfil").value = usuario.perfil;

}

document.getElementById("formUsuario").addEventListener("submit", async function(e){

    e.preventDefault();

    const dados = {

        nome: document.getElementById("nome").value,

        usuario: document.getElementById("usuario").value,

        senha: document.getElementById("senha").value,

        perfil: document.getElementById("perfil").value

    };

    const resposta = await fetch(

        `/usuarios/${id}`,

        {

            method:"PUT",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify(dados)

        }

    );

    const resultado = await resposta.json();

    alert(resultado.mensagem);

    window.location.href="usuarios.html";

});

carregarUsuario();
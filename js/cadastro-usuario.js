const formulario = document.getElementById("formUsuario");

formulario.addEventListener("submit", async function(evento){

    evento.preventDefault();

    const usuario = {

        nome: document.getElementById("nome").value,

        usuario: document.getElementById("usuario").value,

        senha: document.getElementById("senha").value,

        perfil: document.getElementById("perfil").value

    };

    try{

        const resposta = await fetch(

            "http://localhost:3000/usuarios",

            {

                method:"POST",

                headers:{

                    "Content-Type":"application/json"

                },

                body:JSON.stringify(usuario)

            }

        );

        const dados = await resposta.json();

        alert(dados.mensagem);

        if(resposta.ok){

            formulario.reset();

        }

    }

    catch(erro){

        console.error(erro);

        alert("Erro ao cadastrar usuário.");

    }

});

// Listar usuários

app.get("/usuarios", async (req, res) => {

    try{

        const usuarios = await db.all(

            `SELECT

                id,

                nome,

                usuario,

                perfil

            FROM usuarios

            ORDER BY nome`

        );

        res.json(usuarios);

    }

    catch(erro){

        console.error(erro);

        res.status(500).json({

            mensagem:"Erro ao buscar usuários."

        });

    }

});
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const conectarBanco = require("./database");
const fs = require("fs");
const app = express();
const bcrypt = require("bcrypt");

app.use(cors());
app.use(express.json());



// ========================================
// FRONTEND
// ========================================

app.use(express.static(path.join(__dirname, "..")));

app.get("/index.html", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "index.html"));
});

// ========================================
// CONFIGURAÇÃO DO UPLOAD DE MANUAIS
// ========================================

const storage = multer.diskStorage({

    destination: function(req, file, cb){

        cb(null, "uploads/manuais");

    },

    filename: function(req, file, cb){

        const nomeArquivo =
            Date.now() +
            "-" +
            file.originalname.replace(/\s+/g,"_");

        cb(null, nomeArquivo);

    }

});

const upload = multer({

    storage: storage,

    fileFilter: function(req, file, cb){

        if(file.mimetype === "application/pdf"){

            cb(null,true);

        }else{

            cb(new Error("Apenas arquivos PDF são permitidos."));

        }

    }

});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));


let db;

(async () => {

    db = await conectarBanco();

    console.log("Banco de dados conectado com sucesso!");

})();



/* ===========================================
   LOGIN
===========================================*/

app.post("/login", async (req, res) => {

    try {

        const { usuario, senha } = req.body;

        const usuarioEncontrado = await db.get(

            `SELECT * FROM usuarios
             WHERE usuario = ?`,

            [usuario]

        );

        console.log("Usuário encontrado:", usuarioEncontrado);

        if (!usuarioEncontrado) {

            return res.status(401).json({

                sucesso: false,

                mensagem: "Usuário ou senha inválidos."

            });

        }

        const senhaCorreta = await bcrypt.compare(

            senha,

            usuarioEncontrado.senha

        );


        console.log("Senha digitada:", senha);
        console.log("Senha do banco:", usuarioEncontrado.senha);
        console.log("Resultado bcrypt:", senhaCorreta);



        if (!senhaCorreta) {

            return res.status(401).json({

                sucesso: false,

                mensagem: "Usuário ou senha inválidos."

            });

        }

        res.json({

            sucesso: true,
            mensagem: "Login realizado com sucesso!",
            id: usuarioEncontrado.id,
            perfil: usuarioEncontrado.perfil,
            usuario: usuarioEncontrado.usuario

        });

    } catch (erro) {

        console.error(erro);

        res.status(500).json({

            sucesso: false,
            mensagem: "Erro interno do servidor."

        });

    }

});



/* ===========================================
   MÁQUINAS
===========================================*/

// Listar todas

app.get("/maquinas", async (req, res) => {

    try {

        const maquinas = await db.all("SELECT * FROM maquinas");

        res.json(maquinas);

    } catch (erro) {

        console.error(erro);

        res.status(500).json({

            mensagem: "Erro ao buscar máquinas."

        });

    }

});

// Buscar por ID

app.get("/maquinas/:id", async (req, res) => {

    try {

        const id = req.params.id;

        const maquina = await db.get(
            "SELECT * FROM maquinas WHERE id = ?",
            [id]
        );

        if (!maquina) {

            return res.status(404).json({
                mensagem: "Máquina não encontrada."
            });

        }

        res.json(maquina);

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            mensagem: "Erro ao buscar máquina."
        });

    }

});


// Cadastrar

app.post("/maquinas", async (req, res) => {

    console.log("=== NOVA MÁQUINA ===");
    console.log(req.body);

    try {

        const {
            nome,
            fabricante,
            modelo,
            localizacao,
            status,
            descricao
        } = req.body;

        console.log(nome, fabricante, modelo);

        const resultado = await db.run(

            `INSERT INTO maquinas
            (nome, fabricante, modelo, localizacao, status, descricao)
            VALUES (?, ?, ?, ?, ?, ?)`,

            [
                nome,
                fabricante,
                modelo,
                localizacao,
                status,
                descricao
            ]

        );

        console.log("ID inserido:", resultado.lastID);

        res.status(201).json({
            mensagem: "Máquina cadastrada com sucesso!",
            id: resultado.lastID
        });

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            mensagem: "Erro ao cadastrar máquina."
        });

    }

});

app.put("/maquinas/:id", async (req, res) => {

    try {

        const id = req.params.id;

        const {

            nome,
            fabricante,
            modelo,
            localizacao,
            status,
            descricao

        } = req.body;

        const resultado = await db.run(

            `UPDATE maquinas
             SET

                nome = ?,
                fabricante = ?,
                modelo = ?,
                localizacao = ?,
                status = ?,
                descricao = ?

             WHERE id = ?`,

            [

                nome,
                fabricante,
                modelo,
                localizacao,
                status,
                descricao,
                id

            ]

        );

        if (resultado.changes === 0) {

            return res.status(404).json({

                mensagem: "Máquina não encontrada."

            });

        }

        res.json({

            mensagem: "Máquina atualizada com sucesso!"

        });

    }

    catch (erro) {

        console.error(erro);

        res.status(500).json({

            mensagem: "Erro ao atualizar máquina."

        });

    }

});

app.delete("/maquinas/:id", async (req, res) => {

    try {

        const id = req.params.id;

        // Primeiro exclui as manutenções da máquina
        await db.run(

            "DELETE FROM manutencoes WHERE maquinaId = ?",

            [id]

        );

        // Depois exclui a máquina
        const resultado = await db.run(

            "DELETE FROM maquinas WHERE id = ?",

            [id]

        );

        if (resultado.changes === 0) {

            return res.status(404).json({

                mensagem: "Máquina não encontrada."

            });

        }

        res.json({

            mensagem: "Máquina excluída com sucesso!"

        });

    }

    catch (erro) {

        console.error(erro);

        res.status(500).json({

            mensagem: "Erro ao excluir máquina."

        });

    }

});


/* ===========================================
   MANUTENÇÕES
===========================================*/

app.get("/manutencoes", async (req, res) => {

    try {

        const manutencoes = await db.all(

            `SELECT

                manutencoes.id,
                manutencoes.maquinaId,
                maquinas.nome AS maquina,
                manutencoes.tipo,
                manutencoes.data,
                manutencoes.responsavel,
                manutencoes.descricao

            FROM manutencoes

            INNER JOIN maquinas

                ON maquinas.id = manutencoes.maquinaId

            ORDER BY manutencoes.id DESC`

        );

        res.json(manutencoes);

    }

    catch (erro) {

        console.error(erro);

        res.status(500).json({

            mensagem: "Erro ao buscar manutenções."

        });

    }

});

// Listar por máquina

app.get("/manutencoes/:maquinaId", async (req, res) => {

    try {

        const maquinaId = req.params.maquinaId;

        const lista = await db.all(

            `SELECT

                manutencoes.id,
                manutencoes.maquinaId,
                maquinas.nome AS maquina,
                manutencoes.tipo,
                manutencoes.data,
                manutencoes.responsavel,
                manutencoes.descricao

            FROM manutencoes

            INNER JOIN maquinas

                ON maquinas.id = manutencoes.maquinaId

            WHERE manutencoes.maquinaId = ?

            ORDER BY manutencoes.id DESC`,

            [maquinaId]

        );

        res.json(lista);

    }

    catch (erro) {

        console.error(erro);

        res.status(500).json({

            mensagem: "Erro ao buscar manutenções."

        });

    }

});

// Cadastrar manutenção

app.post("/manutencoes", async (req, res) => {

    console.log("=== NOVA MANUTENÇÃO ===");
    console.log(req.body);
    
    try {

        const {

            maquinaId,

            tipo,

            data,

            responsavel,

            descricao

        } = req.body;

        const resultado = await db.run(

            `INSERT INTO manutencoes
            (maquinaId, tipo, data, responsavel, descricao)
            VALUES (?, ?, ?, ?, ?)`,

            [

                maquinaId,

                tipo,

                data,

                responsavel,

                descricao

            ]

        );

        console.log("ID da manutenção inserida:", resultado.lastID);

        res.status(201).json({

            mensagem: "Manutenção cadastrada com sucesso!",

            id: resultado.lastID

        });

    } catch (erro) {

        console.error(erro);

        res.status(500).json({

            mensagem: "Erro ao cadastrar manutenção."

        });

    }

});


// Excluir manutenção
app.delete("/manutencoes/:id", async (req, res) => {

    try {

        const id = req.params.id;

        const resultado = await db.run(

            "DELETE FROM manutencoes WHERE id = ?",

            [id]

        );

        if (resultado.changes === 0) {

            return res.status(404).json({

                mensagem: "Manutenção não encontrada."

            });

        }

        res.json({

            mensagem: "Manutenção excluída com sucesso!"

        });

    }

    catch (erro) {

        console.error(erro);

        res.status(500).json({

            mensagem: "Erro ao excluir manutenção."

        });

    }

});


/* ===========================================
   MANUAIS
=========================================== */

// Listar todos os manuais

app.get("/manuais", async (req, res) => {

    try {

        const manuais = await db.all(`
            SELECT
                manuais.*,
                maquinas.nome AS maquina
            FROM manuais
            JOIN maquinas
            ON maquinas.id = manuais.maquinaId
        `);

        res.json(manuais);

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            mensagem:"Erro ao buscar manuais."
        });

    }

});


// Cadastrar manual

app.post("/manuais", upload.single("arquivo"), async (req, res) => {

    try{

        const{

            maquinaId,

            titulo,

            descricao

        } = req.body;

        const arquivo = req.file.filename;

        await db.run(

            `INSERT INTO manuais
            (maquinaId,titulo,arquivo,descricao)
            VALUES(?,?,?,?)`,

            [

                maquinaId,

                titulo,

                arquivo,

                descricao

            ]

        );

        res.status(201).json({

            mensagem:"Manual enviado com sucesso!"

        });

    }

    catch(erro){

        console.error(erro);

        res.status(500).json({

            mensagem:"Erro ao salvar manual."

        });

    }

});


// ========================================
// EXCLUIR MANUAL
// ========================================

app.delete("/manuais/:id", async (req, res) => {

    try {

        const id = req.params.id;

        const manual = await db.get(

            "SELECT * FROM manuais WHERE id = ?",

            [id]

        );

        if (!manual) {

            return res.status(404).json({

                mensagem: "Manual não encontrado."

            });

        }

        const caminho = path.join(

            __dirname,

            "uploads",

            "manuais",

            manual.arquivo

        );

        if (fs.existsSync(caminho)) {

            fs.unlinkSync(caminho);

        }

        await db.run(

            "DELETE FROM manuais WHERE id = ?",

            [id]

        );

        res.json({

            mensagem: "Manual excluído com sucesso."

        });

    }

    catch (erro) {

        console.error(erro);

        res.status(500).json({

            mensagem: "Erro ao excluir manual."

        });

    }

});



/* ===========================================
   SERVIDOR
===========================================*/

const PORT = process.env.PORT || 3000;

app.get("/dashboard", async (req, res) => {

    try {

        const totalMaquinas = await db.get(

            "SELECT COUNT(*) AS total FROM maquinas"

        );

        const disponiveis = await db.get(

            "SELECT COUNT(*) AS total FROM maquinas WHERE status = 'Disponível'"

        );

        const manutencao = await db.get(

            "SELECT COUNT(*) AS total FROM maquinas WHERE status = 'Em manutenção'"

        );

        const interditadas = await db.get(

            "SELECT COUNT(*) AS total FROM maquinas WHERE status = 'Interditada'"

        );

        const totalManutencoes = await db.get(

            "SELECT COUNT(*) AS total FROM manutencoes"

        );

        res.json({

            maquinas: totalMaquinas.total,

            disponiveis: disponiveis.total,

            manutencao: manutencao.total,

            interditadas: interditadas.total,

            manutencoes: totalManutencoes.total

        });

    } catch (erro) {

        console.error(erro);

        res.status(500).json({

            mensagem: "Erro ao carregar dashboard."

        });

    }

});

/* ===========================================
   USUÁRIOS
===========================================*/

// Cadastrar usuário

app.post("/usuarios", async (req, res) => {

    try {

        const {

            nome,
            usuario,
            senha,
            perfil

        } = req.body;

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        // Verifica se já existe um usuário com esse login
        const existente = await db.get(

            "SELECT * FROM usuarios WHERE usuario = ?",

            [usuario]

        );

        if (existente) {

            return res.status(400).json({

                mensagem: "Este usuário já está cadastrado."

            });

        }

        const resultado = await db.run(

            `INSERT INTO usuarios
            (nome, usuario, senha, perfil)
            VALUES (?, ?, ?, ?)`,

            [

                nome,
                usuario,
                senhaCriptografada,
                perfil

            ]

        );

        res.status(201).json({

            mensagem: "Usuário cadastrado com sucesso!",

            id: resultado.lastID

        });

    }

    catch (erro) {

        console.error(erro);

        res.status(500).json({

            mensagem: "Erro ao cadastrar usuário."

        });

    }

});

app.get("/usuarios", async (req, res) => {

    try {

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

    } catch (erro) {

        console.error(erro);

        res.status(500).json({

            mensagem: "Erro ao buscar usuários."

        });

    }

});

// Excluir usuário

app.delete("/usuarios/:id", async (req, res) => {

    try {

        const id = req.params.id;

        const resultado = await db.run(

            "DELETE FROM usuarios WHERE id = ?",

            [id]

        );

        if (resultado.changes === 0) {

            return res.status(404).json({

                mensagem: "Usuário não encontrado."

            });

        }

        res.json({

            mensagem: "Usuário excluído com sucesso!"

        });

    }

    catch (erro) {

        console.error(erro);

        res.status(500).json({

            mensagem: "Erro ao excluir usuário."

        });

    }

});

app.post("/sugestoes", async (req, res) => {

    try {

        const {

            nome,
            tipo,
            mensagem

        } = req.body;

        const data = new Date().toLocaleDateString("pt-BR");

        const resultado = await db.run(

            `INSERT INTO sugestoes
            (nome, tipo, mensagem, data)
            VALUES (?, ?, ?, ?)`,

            [

                nome || "Anônimo",

                tipo,

                mensagem,

                data

            ]

        );

        res.status(201).json({

            mensagem: "Sugestão enviada com sucesso!",

            id: resultado.lastID

        });

    }

    catch (erro) {

        console.error(erro);

        res.status(500).json({

            mensagem: "Erro ao enviar sugestão."

        });

    }

});


app.get("/sugestoes", async (req, res) => {

    try {

        const sugestoes = await db.all(

            `SELECT *
             FROM sugestoes
             ORDER BY id DESC`

        );

        res.json(sugestoes);

    }

    catch (erro) {

        console.error(erro);

        res.status(500).json({

            mensagem: "Erro ao buscar sugestões."

        });

    }

});


app.delete("/sugestoes/:id", async (req, res) => {

    try {

        await db.run(

            "DELETE FROM sugestoes WHERE id=?",

            [req.params.id]

        );

        res.json({

            mensagem: "Sugestão excluída."

        });

    }

    catch (erro) {

        console.error(erro);

        res.status(500).json({

            mensagem: "Erro ao excluir."

        });

    }

});


/*app.get("/", (req, res) => {

    res.redirect("/login.html");

});*/

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "login.html"));
});

app.listen(PORT, () => {

    console.log(`Servidor iniciado na porta ${PORT}`);

});
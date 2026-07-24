const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const path = require("path");
const bcrypt = require("bcrypt");

async function conectarBanco() {

    const db = await open({

        filename: path.join(__dirname, "database.db"),

        driver: sqlite3.Database

    });

    /* ===========================================
       TABELA DE USUÁRIOS
    =========================================== */

    await db.exec(`

        CREATE TABLE IF NOT EXISTS usuarios (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        nome TEXT NOT NULL,

        usuario TEXT NOT NULL UNIQUE,

        senha TEXT NOT NULL,

        perfil TEXT NOT NULL

    )

    `);

    /* ===========================================
       TABELA DE MÁQUINAS
    =========================================== */

    await db.exec(`

        CREATE TABLE IF NOT EXISTS maquinas (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            nome TEXT NOT NULL,

            fabricante TEXT,

            modelo TEXT,

            localizacao TEXT,

            status TEXT,

            descricao TEXT

        )

    `);

    /* ===========================================
       TABELA DE MANUTENÇÕES
    =========================================== */

    await db.exec(`

        CREATE TABLE IF NOT EXISTS manutencoes (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            maquinaId INTEGER NOT NULL,

            tipo TEXT NOT NULL,

            data TEXT NOT NULL,

            responsavel TEXT NOT NULL,

            descricao TEXT,

            FOREIGN KEY(maquinaId)
                REFERENCES maquinas(id)

        )

    `);

    // =============================
// Tabela de sugestões
// =============================

await db.exec(`

    CREATE TABLE IF NOT EXISTS sugestoes (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        nome TEXT,

        tipo TEXT NOT NULL,

        mensagem TEXT NOT NULL,

        data TEXT NOT NULL,

        status TEXT DEFAULT 'Pendente'

    )

`);

    // =============================
    // Tabela de manuais
    // =============================

    await db.exec(`

    CREATE TABLE IF NOT EXISTS manuais(

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    maquinaId INTEGER NOT NULL,

    titulo TEXT NOT NULL,

    arquivo TEXT NOT NULL,

    descricao TEXT,

    FOREIGN KEY(maquinaId) REFERENCES maquinas(id)

        )

`   );


    

    /* ===========================================
       INSERE USUÁRIOS PADRÃO
    =========================================== */

   /* const totalUsuarios = await db.get(

        "SELECT COUNT(*) AS total FROM usuarios"

    );

    if (totalUsuarios.total === 0) {

        await db.run(

            `INSERT INTO usuarios
            (usuario, senha, perfil)
            VALUES (?, ?, ?)`,

            [

                "instrutor",

                "1234",

                "instrutor"

            ]

        );

        await db.run(

            `INSERT INTO usuarios
            (usuario, senha, perfil)
            VALUES (?, ?, ?)`,

            [

                "aluno",

                "1234",

                "aluno"

            ]

        );

        console.log("Usuários padrão criados.");

    }*/


        
// =============================
// Usuários iniciais
// =============================

const usuario = await db.get(
    "SELECT * FROM usuarios LIMIT 1"
);


if (!usuario) {

    const senhaInstrutor = await bcrypt.hash("1234", 10);

    const senhaAluno = await bcrypt.hash("1234", 10);

    await db.run(

        `INSERT INTO usuarios
        (nome, usuario, senha, perfil)
        VALUES (?, ?, ?, ?)`,

        [

            "Administrador",

            "instrutor",

            senhaInstrutor,

            "instrutor"

        ]

    );

    await db.run(

        `INSERT INTO usuarios
        (nome, usuario, senha, perfil)
        VALUES (?, ?, ?, ?)`,

        [

            "Aluno Teste",

            "aluno",

            senhaAluno,

            "aluno"

        ]

    );

}




    console.log("Banco de dados inicializado com sucesso!");

    return db;

}

module.exports = conectarBanco;
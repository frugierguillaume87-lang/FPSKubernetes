const express = require("express");
const {Pool} = require("pg");
const {selectIntoDb, insertIntoDb} = require("./dbConnect")

server = express();

const pool = new Pool({
    host:"localhost",
    user:"usr",
    password:"usr",
    database:"fps",
    port:5432
})

server.get('/', async (req, res)=>{
    const client = await pool.connect();
    let resultat = await client.query('select * from users', client);
    await console.log(resultat.rows)
    res.send(resultat.rows);
});
server.post("/register", async (req, res)=>{
    const client = await pool.connect();
    const date = new Date();
    await insertIntoDb("INSERT INTO users(email, password, created_at) VALUES ($1, $2, $3)",client,["test","test", new Date()])
    await client.end();
});
server.post("/login", async (req, res)=>{
    const client = await pool.connect();

    await client.end();
});
server.listen(9090);
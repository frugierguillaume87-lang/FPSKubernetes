const express = require("express");
const {Pool} = require("pg");

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
    let resultat = await client.query('select * from joueur');
    res.send(resultat);
});
server.listen(9090)
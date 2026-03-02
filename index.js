const express = require("express");
const client = require("pg");
server = express();

server.get('/', (req, res)=>{
    res.send("salut");
});
server.listen(9090)
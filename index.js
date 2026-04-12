const express = require("express");
require("dotenv").config();
const { Pool } = require("pg");
const { selectIntoDb, insertIntoDb } = require("./dbConnect");
const {hachageMdp, comparePassword} = require("./passwordhash")
const bcrypt = require("bcrypt")

server = express();
server.use(express.json());
const pool = new Pool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DB,
  port: process.env.PORT,
});

server.get("/", async (req, res) => {
  const client = await pool.connect();
  
  let resultat = await selectIntoDb("select * from users as usr",[], client);
  console.log(resultat);
  await client.release();
  res.send(resultat);
});


server.post("/register", async (req, res) => {
  const client = await pool.connect();
  const data = req.body;
  try {
    let {email, password} = data; 
    password = await hachageMdp(password)
    await insertIntoDb(
      "INSERT INTO users(email, password, created_at) VALUES ($1, $2, $3)",
      client,
      [email, password, new Date()],
    );
    
    res.status(201)
  } catch (error) {
    console.log(error);
  }
  res.send("OK")
});

server.post("/login", async (req, res) => {
    const client = await pool.connect();
    let data = req.body
    let resultat;
    let {email, password} = data
    let utilisateur = await selectIntoDb("SELECT * FROM users WHERE email=$1",[email], client)
    let hash = utilisateur[0].password
    if (bcrypt.compareSync(password, hash) ){
      resultat = await selectIntoDb("SELECT json_data FROM saves WHERE user_id=$1",[utilisateur[0].id], client)  
      res.status(201)
      console.log(resultat)
      await client.release();
      if(resultat.length == 1){
        res.send(resultat[0].json_data)
      }else{
        res.send(resultat.json_data)
      }
    }else{
        res.status(403)
        await client.release();
        res.send("erreur mauvais mot de passe")
    }

    
    
});
server.listen(9090);

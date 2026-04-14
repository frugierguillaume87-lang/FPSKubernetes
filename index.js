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
  user: process.env.USER_DB,
  password: process.env.PASSWORD,
  database: process.env.DB,
  port: process.env.DB_PORT,
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
      resultat = await selectIntoDb("SELECT token FROM token_users WHERE user_id=$1",[utilisateur[0].id], client)  
      res.status(201)
      console.log(resultat)
      await client.release();
      res.send(resultat[0].token)

    }else{
        res.status(403)
        await client.release();
        res.send("erreur mauvais mot de passe")
    }
});

server.post("/score",async (req, res)=>{
    const client = await pool.connect();
    let data = req.body
    let resultat;
    let {token, score, wave} = data
    try {
      resultat = await selectIntoDb("select u.id from users u join token_users tk on u.id = tk.user_id where tk.token = $1",[token], client)
      console.log(resultat[0].id)
      await insertIntoDb("insert into scores(user_id,score,wave_reached,created_at) values ($1, $2, $3, $4)",[resultat[0].id, score, wave, new Date()], client) 
      res.send("score sauvegardé")     
    } catch (error) {
      res.send(error)
    }
})
server.listen(9090);

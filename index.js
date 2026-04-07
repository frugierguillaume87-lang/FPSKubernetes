const express = require("express");
const { Pool } = require("pg");
const { selectIntoDb, insertIntoDb } = require("./dbConnect");
const {hachageMdp, comparePassword} = require("./passwordhash")

server = express();
server.use(express.json());
const pool = new Pool({
  host: "localhost",
  user: "usr",
  password: "usr",
  database: "fps",
  port: 5432,
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
    let {email, password} = data
    let resultat = await selectIntoDb("SELECT * FROM users WHERE email=$1",[email], client)
    let hash = resultat[0].password
    if (comparePassword(hash, password)){
        res.status(201)
        await client.release();
        res.send("OK")
    }else{
        res.status(403)
        await client.release();
        res.send("erreur mauvais mot de passe")
    }

    
    
});
server.listen(9090);

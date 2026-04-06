const express = require("express");
const { Pool } = require("pg");
const { selectIntoDb, insertIntoDb } = require("./dbConnect");

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
  let resultat = await selectIntoDb("select * from users as usr", client);
  await console.log(resultat.rows);
  await client.release();
  res.send(resultat.rows);
});
server.post("/register", async (req, res) => {
  const client = await pool.connect();
  const data = req.body;
  
    

  try {
    const {email, password} = data; 
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

  await client.release();
});
server.listen(9090);

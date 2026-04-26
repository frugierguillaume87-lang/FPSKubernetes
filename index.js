const express = require("express");
require("dotenv").config();
const { Pool } = require("pg");
const { selectIntoDb, insertIntoDb } = require("./dbConnect");
const {hachageMdp, creationToken} = require("./passwordhash")
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

  res.send("RAS ici");
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
  await client.release();
  res.send("OK")
});

server.post("/login", async (req, res) => {
    const client = await pool.connect();
    let data = req.body
    let resultat;
    let {email, password, token} = data
    let utilisateur = await selectIntoDb("SELECT * FROM users WHERE email=$1", client, [email])
    let hash = utilisateur[0].password
    if (bcrypt.compareSync(password, hash) ){
      let token = creationToken()
      if (token == null){
        await insertIntoDb("insert into token_users(user_token, expired, user_id) values ($1,$2,$3)", client, [token, false, utilisateur[0].id]);
        resultat = await selectIntoDb("SELECT user_token FROM token_users WHERE user_id=$1 and expired<>true", client, [utilisateur[0].id])          
      }else{
        let tokentemp =  await selectIntoDb("SELECT user_token FROM token_users WHERE user_id=$1 and expired<>true and user_token=$2", client, [utilisateur[0].id, token])
        
        await insertIntoDb(
          "DELETE FROM token_users WHERE user_id=$1", 
          client, 
          [utilisateur[0].id]
        );

        await insertIntoDb(
          "insert into token_users(user_token, expired, user_id) values ($1,$2,$3)", 
          client, 
          [token, false, utilisateur[0].id]
        );
        resultat = await selectIntoDb("SELECT user_token FROM token_users WHERE user_id=$1 and expired<>true", client, [utilisateur[0].id])
 
      }
      res.status(201)

      await client.release();
      res.send(resultat[0].user_token)

    }else{
        res.status(403)
        await client.release();
        res.send("erreur mauvais mot de passe")
    }
});

server.post("/score",async (req, res)=>{
    const client = await pool.connect();
    let data = req.body
    console.log(data)
    let resultat;
    let {token, nombre_kill, duree, wave} = data

    try {
      let score = nombre_kill * duree * wave
      resultat = await selectIntoDb("select u.id from users u join token_users tk on u.id = tk.user_id where tk.user_token = $1 and tk.expired <> true", client, [token])
      await insertIntoDb("insert into scores(user_id,score,wave_reached,created_at) values ($1, $2, $3, $4)", client,[resultat[0].id, score, wave, new Date()]) 
          
      res.send("score sauvegardé")     
    } catch (error) {
     
      console.log(error)
    }

})
server.post("/score/fetch",async (req, res)=>{
    const client = await pool.connect();
    let data = req.body

    let resultat;
    let {token, score, wave} = data
    console.log(token+" "+score+" "+wave)
    try {

      let u_id = await selectIntoDb("select u.id from users u join token_users tk on u.id = tk.user_id where tk.user_token = $1 and tk.expired <> true", client, [token])
        resultat = await selectIntoDb("select * from scores where user_id=$1", client,[u_id[0].id]) 
        await client.release()
        res.send(resultat)
 
    } catch (error) {
     
      console.log(error)
    }

})

server.post("/save", async (req, res)=>{
  const client = await pool.connect();
  let data = req.body
  let {token, json} = data

  let resultat = await selectIntoDb("select u.id from users u join token_users tk on u.id = tk.user_id where tk.user_token = $1 and expired <> true", client, [token])
    await insertIntoDb("insert into saves (user_id, json_data) values($1,$2)", client, [resultat[0].id, json]);
  await client.release();
  res.send("OK")
})

server.post("/save/fetch", async (req, res)=>{
  const client = await pool.connect();
  let data = req.body
  let {token} = data
  let resultat;

  let token_result = await selectIntoDb("select u.id from users u join token_users tk on u.id = tk.user_id where tk.user_token = $1 and expired <> true", client,[token])
    resultat = await selectIntoDb("select json_data from saves s join users u on s.user_id = u.id  where s.user_id = $1",
     client,
     [token_result[0].id]);

  await client.release();
  res.send(resultat)

})

server.get("/leaderboard", async (req, res)=>{
  const client = await pool.connect();
  let resultat = await selectIntoDb("select sc.score, u.email from scores sc join users u on u.id  = sc.user_id   order by score desc", client, [])
  await client.release();
  res.send(resultat);
})

server.get("/endtoken/:token", async (req, res)=>{
  const client = await pool.connect();
  let token = req.params.token
  let token_result = await selectIntoDb("select u.id from users u join token_users tk on u.id = tk.user_id where tk.user_token = $1", client,[token])
  await insertIntoDb("update token_users set expired=true where user_id = $1", client,[token_result[0].id])
  await client.release();
  res.send("token supprimé")
})
server.listen(9090);

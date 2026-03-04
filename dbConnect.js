const db = require("pg")



async function selectIntoDb(request){
    const client = await pool.connect();
    let resultat = await client.query(request);
    await client.end();
    return resultat.rows
}


async function insertIntoDb(request){
    const client = await pool.connect();
    let resultat = await client.query(request);
    await client.end();
    return resultat.rows
}
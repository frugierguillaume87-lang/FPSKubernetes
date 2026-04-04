const db = require("pg")



 async function selectIntoDb(request, client){

    let resultat = await client.query(request);
    await client.end();
    return resultat.rows
}


 async function insertIntoDb(request, client, parameters){
    
    await client.query(request, parameters);
    await client.end();

}

module.exports = { selectIntoDb, insertIntoDb}
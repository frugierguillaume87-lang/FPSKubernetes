const db = require("pg")



 async function selectIntoDb(request, client){

    let resultat = await client.query(request);

    return resultat.rows
}


/*
    fonction pour insertion et mise à jour dans la base de donnée
    @param request pour la requête (une string),
    @param client pour le client, qui sera release automatiquement
    @param parameters pour les paramètres d'insertion ou de mise à jour

*/
 async function insertIntoDb(request, client, parameters){
    
    await client.query(request, parameters);
    await client.release();

}

module.exports = { selectIntoDb, insertIntoDb}
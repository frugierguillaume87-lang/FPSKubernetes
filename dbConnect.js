const { text } = require("express");
const db = require("pg")



 async function selectIntoDb(request,client,parameters ){
    let query = {}
    let resultat;
    if (parameters[0] != null){
        query = {
            text:request,
            values: parameters
        }
        resultat = await client.query(query)
    }else{
        resultat = await client.query(request);
    }

    

    return resultat.rows
}


/*
    fonction pour insertion et mise à jour dans la base de donnée
    @param request pour la requête (une string),
    @param client pour le client, qui sera release automatiquement
    @param parameters pour les paramètres d'insertion ou de mise à jour

*/
 async function insertIntoDb(requestString, client, parameters){
    const request = {
        text:requestString,
        values: parameters,
    }

    await client.query(request);
    

}

module.exports = { selectIntoDb, insertIntoDb}
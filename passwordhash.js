const bcrypt = require("bcrypt")
const crypto = require("crypto")
const saltround = 10


async function hachageMdp(mdp){
    const salt = await bcrypt.genSalt(saltround);
    const hash = await bcrypt.hash(mdp,salt)
    console.log(hash)
    return hash
}

function creationToken(){
    const tableau = new Uint32Array(10);
    crypto.getRandomValues(tableau)
    return Array.from(tableau, b =>
        b.toString(16).padStart(2, "0")
    ).join("");
}

module.exports = {hachageMdp,  creationToken}
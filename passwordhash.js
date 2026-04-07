const bcrypt = require("bcrypt")
const saltround = 10


async function hachageMdp(mdp){
    const salt = await bcrypt.genSalt(saltround);
    const hash = await bcrypt.hash(mdp,salt)
    console.log(hash)
    return hash
}

async function comparePassword(hash, mdp) {
    return bcrypt.compareSync(mdp, hash)
}

module.exports = {hachageMdp, comparePassword}
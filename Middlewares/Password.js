var crypto = require("crypto")

function generarPassword(password){
    var salt=crypto.randomBytes(32).toString("hex");
    var hash=crypto.scryptSync(password,salt,100000,64,'sha512').toString("hex");
    return{
        salt,
        hash
    }
}

function validarPassword(password, hash ,salt){
    var hashValidar=crypto.scryptSync(password,salt,100000,64,'sha512').toString("hex");
    return hashValidar===hash;
}

module.exports={
    generarPassword,
    validarPassword
}
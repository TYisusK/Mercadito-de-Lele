var admin = require("firebase-admin");
var keys = require("../Lele_Data_Base.json");

admin.initializeApp({
    credential: admin.credential.cert(keys)
});

var db = admin.firestore();
var conexionUs = db.collection("usuarios"); // Cambiando el nombre de la variable
var conexionProd = db.collection("productos");
var conexionCompra = db.collection("compra")

module.exports = {
    conexionUs, // Actualizando el nombre aquí
    conexionProd,
    conexionCompra
};

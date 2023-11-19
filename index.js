var express = require("express");
var path = require("path");
var cors = require('cors');
var app = express(); // Utiliza la variable 'app' aquí
const session = require('express-session');

app.use(session({
  secret: 'miClaveSecreta', // Clave secreta para firmar la cookie de sesión
  resave: false,
  saveUninitialized: false,
  // Aquí puedes agregar más opciones según tus necesidades
}));

var usuariosRutas = require("./Routes/userRoutes");
var productosRutas = require("./Routes/productRoutes");
var usuariosRutasApi = require("./Routes/userApis");
var productosRutasApi = require("./Routes/productApis");
var autenticacionApis = require("./Routes/autenticacionApis");
app.set('views', path.join(__dirname, 'Views')); // En lugar de app.set('/Views', path.join(__dirname, 'views'));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use('/Web', express.static(path.join(__dirname, 'Web')));
app.use(cors());
app.use("/", usuariosRutas, productosRutas, usuariosRutasApi, productosRutasApi, autenticacionApis);

var port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Servidor en http://localhost:" + port);
});

var express = require("express");
var path = require("path");
var cors = require('cors');
var app = express(); // Utiliza la variable 'app' aquí
const session = require('express-session');
const  MemoryStore  =  require ( 'memorystore' ) ( session )
app.use ( session ( { 
  cookie : {  maxAge : 86400000  } , 
  store : new  MemoryStore ( { 
    checkPeriod : 86400000  // eliminar las entradas caducadas cada 24 h 
  } ) , 
  resave : false , 
  secret : 'keyboard cat' 
} ) )

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

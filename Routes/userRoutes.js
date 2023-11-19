var ruta = require("express").Router();
var subirArchivo = require("../Middlewares/Middleware").subirArchivo;
var eliminarArchivo = require("../Middlewares/Middleware").eliminarArchivo;
var verificarSesion = require("../Middlewares/verificar");
const obtenerUsuarioAutenticado = require("../Middlewares/obtenerUsuarioAutenticado");


var {
  mostrarPerfilUsuario,
  nuevoUsuario,
  buscarporID,
  modificarUsuario,
  borrarUsuario,
  iniciarSesion,
  mostrarUsuarios,
  
 
} = require("../Database/usuarios");

const Usuario = require("../Models/user");

ruta.get("/mostrarUser",obtenerUsuarioAutenticado,async(req, res)=>{
  var usuarios = await mostrarUsuarios()
  console.log(usuarios);
  res.render("users/mostrar", {usuarios})
});

ruta.get("/nuevousuario", obtenerUsuarioAutenticado, (req, res) => {
  res.render("users/registro");
});

ruta.post("/nuevousuario", subirArchivo(), async (req, res) => {
  req.body.foto = req.file.filename;
  var error = await nuevoUsuario(req.body);
  res.redirect("/login");
});

ruta.get("/editarUsuario/:id", obtenerUsuarioAutenticado, async (req, res) => {
  var user = await buscarporID(req.params.id);
  if (user) {
    res.render("usuarios/modificar", { user});
  } else {
    res.status(404).send("Usuario no encontrado.");
  }
});

ruta.post("/editarusuario",  subirArchivo(), async (req, res) => {
  if (req.file != null) {
    req.body.foto = req.file.filename;
  } else {
    req.body.foto = req.body.fotoAnterior;
  }
  var error = await modificarUsuario(req.body);
  res.redirect("/");
});

ruta.get("/borrarUsuario/:id", async (req, res) => {
  try {
    var usuario = await buscarporID(req.params.id);
    if (!usuario) {
      res.status(404).send("Usuario no encontrado.");
    } else {
      var archivo = usuario.foto;
      await borrarUsuario(req.params.id);
      eliminarArchivo(archivo)(req, res, () => {
        res.redirect("/");
      });
    }
  } catch (err) {
    console.log("Error al borrar usuario: " + err);
    res.status(500).send("Error al borrar usuario.");
  }
});

ruta.get("/login",obtenerUsuarioAutenticado, (req, res) => {
    
  res.render("users/login", { error: null });
});

// Ruta para mostrar el formulario de inicio de sesión


// Ruta para procesar el inicio de sesión
ruta.post("/login", async (req, res) => {
  const datos = req.body;
  const resultadoInicioSesion = await iniciarSesion(datos);

  if (resultadoInicioSesion.exitoso) {
    req.session.usuario = resultadoInicioSesion.usuario.obtenerUsuario; // Guardar datos del usuario en la sesión
    res.redirect(`/perfil/${resultadoInicioSesion.usuario.id}`);
  } else {
    res.render("users/login", { error: resultadoInicioSesion.mensaje });
  }
});

ruta.get("/perfil/:id", verificarSesion, async (req, res) => {
  const usuarioEnSesion = req.session.usuario;

  try {
    const datosUsuario = await mostrarPerfilUsuario(req.params.id);

    if (usuarioEnSesion && datosUsuario && usuarioEnSesion.id === req.params.id) {
      // Mostrar el perfil si el usuario en sesión coincide con el ID de la URL y los datos del usuario se encuentran
      res.render("users/perfil", { usuario: datosUsuario, usuarioAutenticado: usuarioEnSesion });
    } else {
      res.status(404).send("Usuario no encontrado o datos incorrectos.");
    }
  } catch (error) {
    console.error("Error al obtener el perfil del usuario:", error);
    res.status(500).send("Error al obtener el perfil del usuario.");
  }
});


ruta.get("/editarUser/:id", async(req,res)=>{
  console.log(req.params.id);
  buscarporID();
  var usuario= await buscarporID(req.params.id);
  res.render("users/modificar", { usuario, usuarioAutenticado: req.usuarioAutenticado });
  res.end();
});

ruta.post("/editarusuario", subirArchivo(), async(req,res)=>{
if (req.file != null){
  req.body.foto = req.file.filename;
}else{
  req.body.foto = req.body.fotoAnterior;
}
  //console.log(req.body);
  //req.body.foto=req.file.originalname;
  var error = await modificarUsuario(req.body);
  res.redirect("/users/perfil");
});

ruta.get("/borrarUsuario/:id", async (req, res) => {
  try {
    var usuario = await buscarporID(req.params.id);
    if (!usuario) {
      res.status(400).send("Usuario no encontrado.");
    } else {
      var archivo = usuario.foto;
      await borrarUsuario(req.params.id);
      eliminarArchivo(archivo)(req, res, () => {
        res.redirect("/");
      });
    }
  } catch (err) {
    console.log("Error al borrar usuario" + err);
    res.status(400).send("Error al borrar usuario.");
  }
});


ruta.get("/acerca", obtenerUsuarioAutenticado, (req, res) => {
  res.render("users/acerca");
});

ruta.get("/artesanos", obtenerUsuarioAutenticado,(req, res) => {
  res.render("users/artesanos");
});

ruta.get("/logout",(req,res)=>{
  req.session.destroy(err => {
    if (err) {
      console.error('Error al destruir la sesión:', err);
    } else {
      console.log('Sesión destruida correctamente.');
    }
  });
  res.redirect("/login");
});


module.exports = ruta;

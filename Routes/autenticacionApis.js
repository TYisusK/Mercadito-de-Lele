var ruta = require("express").Router();
const verificarSesion = require("../Middlewares/verificar");
const {
  iniciarSesion,
  mostrarPerfilUsuario,
  buscarporID,
  nuevoUsuario,
  modificarUsuario,
  borrarUsuario,
  mostrarUsuarios
} = require("../Database/usuarios");

const {
  subirArchivo,
  eliminarArchivo
} = require("../Middlewares/Middleware");

// Ruta para iniciar sesión
ruta.post("/api/login", async (req, res) => {
  try {
    const datos = req.body;
    const resultadoInicioSesion = await iniciarSesion(datos);

    if (resultadoInicioSesion.exitoso) {
      req.session.usuario = resultadoInicioSesion.usuario.obtenerUsuario; // Guardar datos del usuario en la sesión
      res.status(200).json({ mensaje: "Inicio de sesión exitoso" });
    } else {
      res.status(401).json({ mensaje: "Credenciales inválidas" });
    }
  } catch (error) {
    res.status(500).json({ mensaje: "Error interno al iniciar sesión" });
  }
});

// Ruta para cerrar sesión
ruta.get("/api/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error al destruir la sesión:', err);
      res.status(500).json({ mensaje: "Error al cerrar sesión" });
    } else {
      console.log('Sesión destruida correctamente.');
      res.status(200).json({ mensaje: "Sesión cerrada correctamente" });
    }
  });
});

// Ruta para obtener perfil del usuario autenticado
ruta.get("/api/perfil/:id", verificarSesion, async (req, res) => {
  const usuarioEnSesion = req.session.usuario;

  try {
    const datosUsuario = await mostrarPerfilUsuario(req.params.id);

    if (usuarioEnSesion && datosUsuario && usuarioEnSesion.id === req.params.id) {
      res.status(200).json({ usuario: datosUsuario });
    } else {
      res.status(404).json({ mensaje: "Usuario no encontrado o datos incorrectos." });
    }
  } catch (error) {
    console.error("Error al obtener el perfil del usuario:", error);
    res.status(500).json({ mensaje: "Error al obtener el perfil del usuario." });
  }
});


module.exports = ruta;

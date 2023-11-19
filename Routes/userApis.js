var ruta = require("express").Router();
var {
  mostrarUsuarios,
  nuevoUsuario,
  buscarporID,
  modificarUsuario,
  borrarUsuario,
} = require("../Database/usuarios");

var { subirArchivo, eliminarArchivo } = require("../Middlewares/Middleware");

ruta.get("/api/mostrarusuarios", async (req, res) => {
  try {
    var usuarios = await mostrarUsuarios();
    if (usuarios.length === 0) {
      res.status(400).json("No hay usuarios");
    } else {
      res.status(200).json(usuarios);
    }
  } catch (error) {
    res.status(500).json("Error al obtener usuarios");
  }
});

ruta.post("/api/nuevousuario", subirArchivo(), async (req, res) => {
  try {
    req.body.foto = req.file.originalname; // Verifica cómo manejas el nombre del archivo
    var error = await nuevoUsuario(req.body);
    if (error === 0) {
      res.status(200).json("Usuario registrado correctamente");
    } else {
      res.status(400).json("Error al registrar usuario");
    }
  } catch (error) {
    res.status(500).json("Error interno al registrar usuario");
  }
});

ruta.get("/api/editarUsuario/:id", async (req, res) => {
  try {
    var usuario = await buscarporID(req.params.id);
    if (!usuario) {
      res.status(400).json("Usuario no encontrado");
    } else {
      res.status(200).json(usuario);
    }
  } catch (error) {
    res.status(500).json("Error al obtener usuario para editar");
  }
});

ruta.post("/api/editarusuario", subirArchivo(), async (req, res) => {
  try {
    req.body.foto = req.file.originalname; // Verifica cómo manejas el nombre del archivo
    var error = await modificarUsuario(req.body);
    if (error === 0) {
      res.status(200).json("Usuario actualizado correctamente");
    } else {
      res.status(400).json("Error al actualizar usuario");
    }
  } catch (error) {
    res.status(500).json("Error interno al actualizar usuario");
  }
});

ruta.get("/api/borrarUsuario/:id", async (req, res) => {
  try {
    var usuario = await buscarporID(req.params.id);
    if (!usuario) {
      res.status(400).json("Usuario no encontrado");
    } else {
      var archivo = usuario.foto;
      await borrarUsuario(req.params.id);
      eliminarArchivo(archivo)(req, res, () => {
        res.status(200).json("Usuario borrado correctamente");
      });
    }
  } catch (error) {
    res.status(500).json("Error interno al borrar usuario");
  }
});

module.exports = ruta;

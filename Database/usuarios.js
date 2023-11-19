var { conexionUs, conexionProd } = require("./conexion");
const uuid = require('uuid');

var Usuario = require("../Models/user");
var { generarPassword, validarPassword } = require("../Middlewares/Password");

 async function mostrarUsuarios() {
    var users = [];
    try {
        var usuarios = await conexionUs.get(); 
        usuarios.forEach((usuario) => {
            var usuario1 = new Usuario(usuario.id, usuario.data());
            if (usuario1.bandera == 0) {
                users.push(usuario1.obtenerUsuario);
            }
        });
    } catch (err) {
        console.log("Error al obtener los usuarios de firebase" + err);
        users.push(null);
    }
    return users;
}
async function mostrarPerfilUsuario(id) {
    try {
        console.log('Intentando obtener usuario con ID:', id);
        var usuario = await buscarporID(id);

        if (usuario && usuario.bandera === 0) {
            console.log('Usuario encontrado:', usuario.obtenerUsuario);
            return usuario.obtenerUsuario;
        } else {
            console.log('Usuario no encontrado o los datos no son correctos');
            return null;
        }
    } catch (err) {
        console.log('Error al buscar al usuario', err);
        return null;
    }
}





async function buscarporID(id) {
    var user;
    try {
        var usuariobd = await conexionUs.doc(id).get();
        var usuarioObjeto = new Usuario(usuariobd.id, usuariobd.data());
        if (usuarioObjeto.bandera == 0) {
            user = usuarioObjeto;
        }
    } catch (err) {
        console.log("Error al buscar al usuario" + err);
        user = null;
    }
    return user;
}


async function nuevoUsuario(datos) {
    var { salt, hash } = generarPassword(datos.password);
    datos.password = hash;
    datos.salt = salt;
    // Genera un ID único usando uuid
    datos.id = uuid.v4();
    var usuario = new Usuario(datos.id, datos);
    var error = 1;

    if (usuario.bandera === 0) {
        try {
            await conexionUs.doc(datos.id).set(usuario.obtenerUsuario);
            console.log("Usuario Registrado correctamente");
            error = 0;
        } catch (err) {
            console.log("Error al registrar usuario" + err);
        }
    }
    return error;
}




async function modificarUsuario(datos) {
    var user = await buscarporID(datos.id);
    var error = 1;
    if (user!=undefined){
            
        if(datos.password==""){
            datos.password=user.password;
            datos.salt=user.salt;
        }
        else{
            var {salt,hash}=generarPassword(datos.password);
            datos.password=hash;
            datos.salt=salt;
        }
        var usuario = new Usuario(datos.id, datos); 
        if (usuario.bandera == 0) {
            
            try {
                await conexionUs.doc(usuario.id).set(usuario.obtenerUsuario); 
                console.log("Usuario actualizado");
                error = 0;
            } catch (err) {
                console.log("Error al modificar el usuario" + err);
            }
        } else {
            console.log("Los datos no son correctos");
        }
    }   
    return error;
}

async function borrarUsuario(id) {
    var error = 1;
    var user=await buscarporID(id);
    if(user!=undefined){
        try {
            await conexionUs.doc(id).delete(); 
            console.log("Usuario borrado");
            error = 0;
        } catch (err) {
            console.log("Error al borrar el usuario" + err);
        }
    }
    return error;
}
async function iniciarSesion(datos) {
    try {
        console.log("Datos del formulario:", datos);

        const usuarioSnapshot = await conexionUs.where("usuario", "==", datos.usuario).get();
        console.log("Usuarios encontrados:", usuarioSnapshot.docs.map((doc) => doc.data()));

        if (!usuarioSnapshot.empty) {
            const usuarioDoc = usuarioSnapshot.docs[0];
            const usuarioData = usuarioDoc.data();

            console.log("Datos del usuario encontrado:", usuarioData);

            // Validar la contraseña
            if (validarPassword(datos.password, usuarioData.password, usuarioData.salt)) {
                console.log("Inicio de sesión exitoso");
                const usuario = new Usuario(usuarioDoc.id, usuarioData);
                return { exitoso: true, usuario, mensaje: "Inicio de sesión exitoso" };
            } else {
                console.log("Contraseña incorrecta");
                return { exitoso: false, mensaje: "Contraseña incorrecta" };
            }
        } else {
            console.log("Usuario no encontrado");
            return { exitoso: false, mensaje: "Usuario no encontrado" };
        }
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        return { exitoso: false, mensaje: "Error al iniciar sesión" };
    }
}




module.exports = {
    mostrarPerfilUsuario,
    buscarporID,
    nuevoUsuario,
    modificarUsuario,
    borrarUsuario,
    iniciarSesion,
   mostrarUsuarios
    
};

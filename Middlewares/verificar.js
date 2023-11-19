const verificarSesion = (req, res, next) => {
  if (!req.session.usuario) {
    console.log("Sesión no encontrada. Redirigiendo a /login");
    return res.redirect("/login");
  }
  // Si la sesión existe, permite continuar con la solicitud
  next();
};

module.exports = verificarSesion;
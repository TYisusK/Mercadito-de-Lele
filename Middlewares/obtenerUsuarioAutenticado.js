const obtenerUsuarioAutenticado = (req, res, next) => {
    res.locals.usuarioAutenticado = req.session.usuario || null;
    next();
  };
  
  module.exports = obtenerUsuarioAutenticado;
  
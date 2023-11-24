var ruta = require("express").Router();
//var subirArchivoProd = require("../middlewares/middleware").subirArchivoProd;
var eliminarArchivoProd = require("../Middlewares/Middleware").eliminarArchivoProd;
var {subirArchivoProd} = require ("../Middlewares/Middleware");
var {mostrarProductos,
  agregarNuevoProducto,
  buscarProductoPorID,
  modificarProducto,
  borrarProducto,
  obtenerProductosEnCarrito,
  agregarProductoAlCarrito,
  eliminarProductoDelCarrito,
  } = require("../Database/productos");
const Producto = require("../Models/prod");
const obtenerUsuarioAutenticado = require("../Middlewares/obtenerUsuarioAutenticado");
const Compra = require('../Models/compra');
const { guardarNuevaCompra,obtenerCompras } = require("../Database/compras");


ruta.get("/",obtenerUsuarioAutenticado, async (req, res) => {
    var productos = await mostrarProductos();
    console.log(productos);
    res.render("prods/inicio", { productos });
});

ruta.get("/prodAdmin",obtenerUsuarioAutenticado, async (req, res) => {
  var productos = await mostrarProductos();
  console.log(productos);
  res.render("prods/mostrarAlAdmin", { productos });
});
/*
ruta.get("/nuevoproducto", (req, res) => {
    res.render("prods/nuevoproducto");
});*/

ruta.get('/nuevoproducto',obtenerUsuarioAutenticado, (req, res) => {
  res.render('prods/nuevoproducto', { usuarioAutenticado: req.usuarioAutenticado }); // Reemplaza 'req.usuarioAutenticado' con tu lógica de autenticación
});

ruta.post("/nuevoproducto", subirArchivoProd(), async (req, res) => {
    //console.log(req.file.originalname);
    //console.log(req.body);
    req.body.foto=req.file.originalname;
    var error = await agregarNuevoProducto(req.body);
    res.redirect("/");
});

ruta.get("/editarProducto/:id",obtenerUsuarioAutenticado, async (req, res) => {
  var producto = await buscarProductoPorID(req.params.id);
  res.render("prods/modificar", { producto });
});


ruta.post("/editarproducto",subirArchivoProd(), async (req, res) => {
  req.body.foto = req.file.originalname;
  var error = await modificarProducto(req.body);
  res.redirect("/prodAdmin");
});


ruta.get("/borrarProducto/:id", async (req, res) => {
  try {
      var producto = await buscarProductoPorID(req.params.id);
      if (!producto) {
        res.status(404).send("Usuario no encontrado.");
      } else {
        var archivo = producto.foto;
        await borrarProducto(req.params.id);
        eliminarArchivoProd(archivo)(req, res, () => {
          res.redirect("/prodAdmin");
        });
      }
    } catch (err) {
      console.log("Error al borrar usuario" + err);
      res.status(400).send("Error al borrar usuario.");
      }
})


ruta.get('/carrito', async (req, res) => {
  try {
    const productosEnCarrito = obtenerProductosEnCarrito(); // Obtener productos en el carrito
    res.render('prods/carrito', { productosEnCarrito, usuarioAutenticado: req.usuarioAutenticado }); // Renderizar la vista del carrito con los productos
  } catch (error) {
    console.log('Error al obtener productos en el carrito:', error);
    res.status(500).send('Error al mostrar el carrito');
  }
});


ruta.post('/agregar_al_carrito', async (req, res) => {
  const productoId = req.body.productoId; // Obtener el ID del producto desde el formulario

  try {
    // Lógica para agregar el producto al carrito utilizando la función correspondiente
    const exito = await agregarProductoAlCarrito(productoId); // Función para agregar producto al carrito

    if (exito) {
      res.redirect('/'); // Redirigir a la página del carrito después de agregar el producto
    } else {
      res.status(404).send('Producto no encontrado'); // Enviar error si el producto no se encuentra
    }
  } catch (error) {
    console.log('Error al agregar producto al carrito:', error);
    res.status(500).send('Error al agregar producto al carrito');
  }
});


// Ruta para eliminar un producto del carrito
ruta.post('/eliminar_del_carrito/:idProducto', async (req, res) => {
  const { idProducto } = req.params; // Obtener el ID del producto a eliminar del carrito

  try {
    const exito = await eliminarProductoDelCarrito(idProducto); // Intentar eliminar el producto del carrito

    if (exito) {
      res.redirect('/carrito' ,); // Redirigir a la página del carrito después de eliminar el producto
    } else {
      res.status(404).send('Producto no encontrado en el carrito'); // Enviar error si el producto no se encuentra en el carrito
    }
  } catch (error) {
    console.log('Error al eliminar producto del carrito:', error);
    res.status(500).send('Error al eliminar producto del carrito');
  }
});



ruta.get('/comprasAdmin', async (req, res) => {
  try {
    // Obtener las compras desde la base de datos
    const compras = await obtenerCompras(); // Reemplaza esto con tu lógica para obtener las compras

    res.render('prods/comprasAdmin', { compras, usuarioAutenticado: req.usuarioAutenticado});
  } catch (error) {
    console.error('Error al obtener las compras:', error);
    res.status(500).send('Error al obtener las compras');
  }
});



ruta.get('/ventaRealizada', async (req, res) => {
  try {
    const usuarioAutenticado = req.usuarioAutenticado; // Reemplaza esto con tu lógica para obtener el usuario autenticado
    res.render('prods/ventaRealizada', { usuarioAutenticado }); // Pasar la variable usuarioAutenticado al renderizar la vista
  } catch (error) {
    console.log('Error al cargar la vista de venta realizada:', error);
    res.status(500).send('Error al cargar la vista de venta realizada');
  }
});



ruta.post('/comprar', async (req, res) => {
  try {
    const productosEnCarrito = obtenerProductosEnCarrito();
    const usuarioId = req.session.usuario.id; // Obtener el ID del usuario desde la sesión

    const exito = await guardarNuevaCompra(productosEnCarrito, usuarioId);
    
    if (exito) {
      productosEnCarrito = [];
      res.redirect('/ventaRealizada');
    } else {
      res.status(500).send('Error al realizar la compra');
    }
  } catch (error) {
    console.log('Error al realizar la compra:', error);
    res.status(500).send('Error al realizar la compra');
  }
});





module.exports = ruta;

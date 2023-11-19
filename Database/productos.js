var { conexionUs, conexionProd, conexionCompra } = require("./conexion");
var Producto = require("../Models/prod");

async function mostrarProductos() {
    var productos = [];
    try {
        var productosBD = await conexionProd.get();
        productosBD.forEach((producto) => {
            var producto1 = new Producto(producto.id, producto.data());
            if (producto1.bandera == 0) {
                productos.push(producto1.obtenerProducto);
            }
        });
    } catch (err) {
        console.log("Error al obtener los productos de firebase: " + err);
        productos.push(null);
    }
    return productos;
}

async function buscarProductoPorID(id) {
    var producto;
    try {
        var productoBD = await conexionProd.doc(id).get();
        var productoObjeto = new Producto(productoBD.id, productoBD.data());
        if (productoObjeto.bandera == 0) {
            producto = productoObjeto;
        }
    } catch (err) {
        console.log("Error al buscar el producto: " + err);
        producto = null;
    }
    return producto;
}

async function agregarNuevoProducto(datos) {
    var producto = new Producto(null, datos);
    var error = 1;
    console.log(producto.obtenerProducto);
    if (producto.bandera == 0) {
        try {
            await conexionProd.doc().set(producto.obtenerProducto);
            console.log("Producto registrado correctamente");
            error = 0;
        } catch (err) {
            console.log("Error al registrar el producto: " + err);
        }
    }
    return error;
}

async function modificarProducto(datos) {
    var producto = new Producto(datos.id, datos);
    var error = 1;
    if (producto!=undefined){
        var producto = new Producto(datos.id, datos)
        if (producto.bandera == 0) {
            try {
                await conexionProd.doc(producto.id).set(producto.obtenerProducto);
                console.log("Producto actualizado");
                error = 0;
            } catch (err) {
                console.log("Error al modificar el producto: " + err);
            }
        } else {
            console.log("Los datos del producto no son correctos");
        }
    }    
    return error;
}

async function borrarProducto(id) {
    var error = 1;
    var producto = await buscarProductoPorID(id);
    if(producto!=undefined){
        try {
            await conexionProd.doc(id).delete();
            console.log("Producto eliminado");
            error = 0;
        } catch (err) {
            console.log("Error al borrar el producto: " + err);
        }
    }
    return error;
}
let productosEnCarrito = [];

function obtenerProductosEnCarrito() {
  return productosEnCarrito;
}

async function agregarProductoAlCarrito(idProducto) {
  try {
    // Obtener el producto por su ID (simulación)
    const producto = await buscarProductoPorID(idProducto);
    if (producto) {
      // Agregar el producto al carrito
      productosEnCarrito.push(producto);
      return true; // Éxito al agregar al carrito
    }
    return false; // No se encontró el producto
  } catch (error) {
    console.log("Error al agregar producto al carrito:", error);
    return false; // Error al agregar al carrito
  }
}

async function eliminarProductoDelCarrito(idProducto) {
  try {
    // Filtrar el producto del carrito por su ID y eliminarlo
    productosEnCarrito = productosEnCarrito.filter(producto => producto.id !== idProducto);
    return true; // Éxito al eliminar del carrito
  } catch (error) {
    console.log("Error al eliminar producto del carrito:", error);
    return false; // Error al eliminar del carrito
  }
}



module.exports = {
  mostrarProductos,
  buscarProductoPorID,
  agregarNuevoProducto,
  modificarProducto,
  borrarProducto,
  obtenerProductosEnCarrito,
  agregarProductoAlCarrito,
  eliminarProductoDelCarrito,
};
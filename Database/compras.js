const Compra = require('../Models/compra');
const { conexionCompra } = require('./conexion');

async function guardarNuevaCompra(productos) {
  try {
    const productosPlanos = productos.map(producto => ({
      nombre: producto.nombre,
    }));


    await conexionCompra.add({
      productos: productosPlanos,
      fechaCompra: new Date(), 
    });

    console.log('Compra registrada correctamente');
    return true; 
  } catch (error) {
    console.log('Error al registrar la compra:', error);
    return false; 
  }
}

async function obtenerCompras() {
  const compras = [];
  try {
    const comprasBD = await conexionCompra.get();
      
    comprasBD.forEach((compra) => {
      const productosCompra = compra.data().productos || []; // Obtener los productos de la compra
      const nuevaCompra = new Compra(compra.id, productosCompra);
      compras.push(nuevaCompra);
    });
  } catch (error) {
    console.error('Error al obtener las compras desde Firestore:', error);
    throw error;
  }
  return compras;
}


module.exports = {
  guardarNuevaCompra,
  obtenerCompras
};

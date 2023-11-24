const Compra = require('../Models/compra');
const { conexionCompra } = require('./conexion');

async function guardarNuevaCompra(productos, usuarioId) {
  try {
    const productosPlanos = productos.map(producto => ({
      nombre: producto.nombre,
    }));

    await conexionCompra.add({
      productos: productosPlanos,
      fechaCompra: new Date(),
      usuarioId: usuarioId, // Asociar el ID del usuario con la compra
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
      const usuarioId = compra.data().usuarioId; // Obtener el ID del usuario asociado a la compra
      const nuevaCompra = new Compra(compra.id, productosCompra, usuarioId); // Pasar el usuarioId al constructor de Compra
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

class Compra {
  constructor(id, productos, userId) {
    this.id = id; // ID de la compra
    this.productos = productos || []; // Array de productos comprados con sus cantidades
    this.fechaCompra = new Date(); // Fecha de la compra, por ejemplo
    this.userId = userId;
    this.bandera = 0; // Valor inicial de bandera
  }

  set id(id) {
    if (id != null) {
      id.length > 0 ? (this._id = id) : (this.bandera = 1);
    }
  }

  set productos(productos) {
    // Aquí podrías realizar validaciones adicionales si es necesario
    this._productos = productos;
  }

  set userId(userId) {
    if (userId != null) {
      this._userId = userId;
    }
  }

  get id() {
    return this._id;
  }

  get productos() {
    return this._productos;
  }

  get userId() {
    return this._userId;
  }

  // Función para agregar un producto a la compra con su cantidad
  agregarProducto(producto, cantidad) {
    // Agregar la información del producto con su cantidad a la compra
    this.productos.push({ producto, cantidad });
  }

  // Función para obtener el total de la compra
  obtenerTotal() {
    let total = 0;
    for (const item of this.productos) {
      total += item.producto.precio * item.cantidad; // Multiplicar el precio por la cantidad
    }
    return total;
  }

  // Otras funciones o métodos relevantes para la manipulación de la compra
}

module.exports = Compra;

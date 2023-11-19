
  // Obtener los productos en el carrito desde el servidor o utilizando productosEnCarrito

  // Esta función actualiza el total basado en los precios de los productos
  function calcularTotal() {
    let total = 0;
    // Reemplaza esto con la lógica para obtener los precios de los productos en el carrito
    const preciosProductos = [ productosEnCarrito.map(producto => producto.precio) ];
    
    // Calcula el total sumando los precios de los productos
    total = preciosProductos.reduce((acc, precio) => acc + precio, 0);

    return total;
  }

  // Función para actualizar la vista con el nuevo total calculado
  function actualizarTotal() {
    const total = calcularTotal();
    document.getElementById("totalAmount").textContent = total.toFixed(2); // Actualiza el elemento HTML con el nuevo total
  }

  // Llama a la función de cálculo al cargar la página
  actualizarTotal();

  // Evento para el botón "Calcular Total"
  document.getElementById("calcularTotal").addEventListener("click", () => {
    actualizarTotal();
  });


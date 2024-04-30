async function addToCart(pid) {
    const cart= userData.cart
    try {
        const userDataElement = document.getElementById('userData');
        const cart = userDataElement.dataset.cart;
        const response = await fetch(`/api/carts/${cart}/product/${pid}`, {
            method: 'POST',
        });

        if (response.ok) {
            console.log(`Producto ${pid} agregado al carrito correctamente.`);
        } else {
            console.error('Error al agregar producto al carrito:', response.statusText);
        }
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
    }
}


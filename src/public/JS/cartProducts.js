
async function addToCart(pid) {
    try {
        const userDataElement = document.getElementById('userData');
        const cart = userDataElement.dataset.cart;
        const response = await fetch(`/api/carts/${cart}/product/${pid}`, {
            method: 'POST',
        });

        if (response.ok) {
            showSuccessAlert(`Producto ${pid} agregado al carrito correctamente.`);
        } else {
            throw new Error(`Error al agregar producto al carrito: ${response.statusText}`);
        }
    } catch (error) {
        showErrorAlert(error.message);
    }
}

function showSuccessAlert(message) {
    Swal.fire({
        icon: 'success',
        title: 'Éxito!',
        text: message,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000
    });
}

function showErrorAlert(message) {
    Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: message,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000
    });
}
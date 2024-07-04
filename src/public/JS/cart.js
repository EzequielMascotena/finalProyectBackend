async function purchase(cid) {
    try {
        const response = await fetch(`/api/carts/${cid}/purchase`, {
            method: 'POST',
        });

        const data = await response.json();
        console.log(data);

        if (response.ok) {
            // Actualizar el contenido del modal con los datos de la respuesta
            document.getElementById('responseMessage').textContent = data.responseMessage;

            const productosSinStockDiv = document.getElementById('productosSinStock');
            const productosSinStockList = document.getElementById('productosSinStockList');
            productosSinStockList.innerHTML = '';
            if (data.productosSinStock.length) {
                data.productosSinStock.forEach(item => {
                    const li = document.createElement('li');
                    li.textContent = `${item.product.title} - Cantidad solicitada: ${item.quantityRequested}`;
                    productosSinStockList.appendChild(li);
                });
                productosSinStockDiv.style.display = 'block';
            } else {
                productosSinStockDiv.style.display = 'none';
            }

            const ticketDataDiv = document.getElementById('ticketData');
            const ticketProductsList = document.getElementById('ticketProductsList');
            ticketProductsList.innerHTML = '';
            if (data.ticketData) {
                document.getElementById('ticketTotal').textContent = data.ticketData.amount;
                data.ticketData.products.forEach(item => {
                    const li = document.createElement('li');
                    li.textContent = `${item.productName} - Cantidad: ${item.quantity} - Precio unitario: ${item.price}`;
                    ticketProductsList.appendChild(li);
                });
                ticketDataDiv.style.display = 'block';
            } else {
                ticketDataDiv.style.display = 'none';
            }

            // Mostrar el modal
            const modal = new bootstrap.Modal(document.getElementById('staticBackdrop'));
            modal.show();
        } else {
            console.error('Error al realizar la compra:', response.statusText);
        }
    } catch (error) {
        console.error('Error al realizar la compra:', error);
    }
}



async function deleteProductFromCart(cartId, productId) {
    try {
        const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            alert('Producto eliminado del carrito correctamente');
            location.reload();
        } else {
            const errorData = await response.json();
            alert(errorData.message || 'Error al eliminar el producto.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Ocurrió un error al intentar eliminar el producto.');
    }
}

async function deleteAllProductsFromCart(cartId) {
    try {
        const response = await fetch(`/api/carts/${cartId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            alert('Todos los productos fueron eliminados del carrito correctamente');
            location.reload();
        } else {
            const errorData = await response.json();
            alert(errorData.message || 'Error al limpiar el carrito.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Ocurrió un error al intentar limpiar el carrito.');
    }
}


/* --funcion para cerrar el modal de boostrap-- */

function closeModal() {
    var modal = document.getElementById('staticBackdrop');
    var modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();

    // Eliminar el backdrop manualmente
    var backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
        backdrop.parentNode.removeChild(backdrop);
    }
}

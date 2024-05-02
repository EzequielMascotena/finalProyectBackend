async function purchase(cid) {
    try {
        const response = await fetch(`/api/carts/${cid}/purchase`, {
            method: 'POST',
        });
        
        const data = await response.json();
        console.log(data)

        if (response.ok) {
            console.log('Proceso realizado correctamente.')
        } else {
            console.error('Error al realizar la compra:', response.statusText)
        }
    } catch (error) {
        console.error('Error al realizar la compra:', error);
    }
}
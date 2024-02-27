//socket del lado del cliente
const socket = io()

//agregar prod en tiempo real
const addNewProdInfo = () => {
    const info = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        price: document.getElementById('price').value,
        stock: document.getElementById('stock').value,
        category: document.getElementById('category').value,
        thumbnail: document.getElementById('inputGroupFile01').value,
        code: document.getElementById('code').value
    }
    socket.emit('addProdInfo', info)

    // Limpiar los campos del formulario
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('price').value = '';
    document.getElementById('stock').value = '';
    document.getElementById('category').value = '';
    document.getElementById('inputGroupFile01').value = '';
    document.getElementById('code').value = '';
    return false
}

socket.on('prodsToRender', (data) => {
    render(data)
    let ult = document.getElementById('listaProds')
    ult.scrollTop = ult.scrollHeight
})

const render = (data) => {
    const html = data.map(el => {
        return (
            `<div class="card text-bg-dark mb-3" style="max-width: 540px;">
            <div class="row g-0">
                <div class="col-md-4">
                    <img src="" class="img-fluid rounded-start" alt="">
                </div>
                <div class="col-md-8">
                    <div class="card-header">${el.category}</div>
                    <div class="card-body">
                        <h5 class="card-title">${el.title}</h5>
                        <strong>ID:</strong> ${el._id}
                        <p class="card-text">${el.description}</p>
                        <strong>Precio:</strong> ${el.price}
                    </div>
                </div>
            </div>
        </div>`
        )
    }).join(' ')
    document.getElementById('listaProds').innerHTML = html
}

//eliminar prod en tiempo real
const deleteProdInfo = () => {
    const info = {
        id: document.getElementById('prodId').value,
    }
    socket.emit('deleteProdInfo', info)

    document.getElementById('prodId').value = '';
    return false
}
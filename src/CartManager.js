const fs = require('fs');
const uuid4 = require('uuid4');

class CartManager {
    constructor(path) {
        this.path = path;
    }

    //1 crear carritos con id y array
    async addCart() {
        const existingCarts = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))
        const id = uuid4()

        const newCart = {
            id: id,
            products: []
        };
        existingCarts.push(newCart);
        await fs.promises.writeFile(this.path, JSON.stringify(existingCarts, null, 4), 'utf-8')
    }


    //2 mostrar producto del carrito por Id
    async getCartById(id) {
        const carts = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))
        let cart = carts.find((cart) => cart.id === id);

        if (cart) {
            return cart.products;
        } else {
            console.log(`Error: no encontramos el Carrito con ID ${id}.`);
            return (`Error: no encontramos el Carrito con ese ID.`)
        }
    }

    //3 agregar id de producto al carrito
    async addProductToCart(cid, pid) {
        try {
            const carts = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'));
            const cart = carts.find((cart) => cart.id === cid);

            if (!cart) {
                console.log(`Error: no encontramos el Carrito con ID ${cid}.`);
                return (`Error: no encontramos el Carrito con ese ID.`);
            }
    
            const prods = cart.products
            const existingProduct = prods.find((p) => p.product === pid);
    
            if (!existingProduct) {
                const newProduct = {
                    product: pid,
                    quantity: 1
                };
                prods.push(newProduct);
            } else {
                existingProduct.quantity++;
            }
    
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 4), 'utf-8');
            console.log(`Producto ${pid} agregado al carrito ${cid} correctamente.`);
        } catch (error) {
            console.error('Error al agregar producto al carrito:', error);
        }
    }
}

module.exports = CartManager

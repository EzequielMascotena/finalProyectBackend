const Cart = require('../models/cart.model.js')
const Products = require('../models/product.model.js')

class CartManagerMongo {
    constructor(path) {
        this.path = path;
    }

    async addCart() {
        try {
            const newCart = new Cart()
            await newCart.save()
            return (`Carrito creado correctamente. ID: ${newCart._id}`)
        } catch (err) {
            console.log(err)
            return { error: 'Error ' + err.message }
        }
    }


    //2 mostrar producto del carrito por Id
    async getCartById(id) {
        try {
            let cart = await Cart.findById(id)
            if (cart) {
                return ({
                    sta: true,
                    msg: 'Carrito encontrado',
                    data: cart
                })
            } else{
                return ({
                    sta: false,
                })
            }
        } catch (err) {
            return ({
                msg: `Error al buscar el carrito, ${err}`
            })
        }
    }

    //3 agregar id de producto al carrito
    async addProductToCart(cid, pid) {
        try {
            const cart = await Cart.findById(cid);

            // verifica la existencia del carrito
            if (!cart) {
                return (`Error: no encontramos el Carrito con el ID ${cid}.`);
            }
            const cartProds = cart.products

            //verifica la existencia del producto
            try{
                let exist = await Products.findById(pid)
                if (!exist) {
                    return (`Error: no encontramos el Producto con el ID ${pid}.`)
                }
            } catch (err) {
                return (`Error en el id del producto: ${err}`)
            }

            // verifica la existencia de alguna unidad del prod dentro del carrito?
            const existingProduct = cartProds.find((p) => p.product === pid);

            if (!existingProduct) {
                const newProduct = {
                    product: pid,
                    quantity: 1
                };
                cartProds.push(newProduct);
            } else {
                existingProduct.quantity++;
            }

            cart.markModified('products');
            await cart.save();
            return(`Producto ${pid} agregado al carrito ${cid} correctamente.`);
        } catch (error) {
            return('Error al agregar producto al carrito:', error);
        }
    }
}

module.exports = CartManagerMongo

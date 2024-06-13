const Cart = require('../dao/mongoDB/models/cart.model')

const Ticket = require('../dao/mongoDB/models/ticket.model')


class CartServices {
    constructor(path) {
        this.path = path;
    }

    async addCartToDb() {
        try {
            const newCart = new Cart()
            await newCart.save()
            return (newCart._id)
        } catch (err) {
            return { error: 'Error ' + err.message }
        }
    }


    //2 mostrar producto del carrito por Id
    async getCartByIdFromDb(id) {
        try {
            let cart = await Cart.findById(id).populate('products.product').lean()

            if (cart) {
                return ({
                    sta: true,
                    msg: 'Carrito encontrado',
                    data: cart.products
                })
            } else {
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
    async addProductToCartOnDb(cid, pid, userRole, userEmail) {
        try {
            const cart = await Cart.findById(cid);

            // verifica la existencia del carrito
            if (!cart) {
                return (`Error: no encontramos el Carrito con el ID ${cid}.`);
            }

            // Verifica si el usuario es premium y el producto le pertenece
            if (userRole === 'premium' && product.owner === userEmail) {
                return `No es posible agregar tu propio producto al carrito.`;
            }

            // verifica la existencia de alguna unidad del prod dentro del carrito
            const existingProductIndex = cart.products.findIndex(item => item.product && item.product.toString() === pid);

            if (existingProductIndex === -1) {
                cart.products.push({
                    product: pid,
                    quantity: 1
                });
            } else {
                cart.products[existingProductIndex].quantity++;
            }

            await Cart.updateOne({ _id: cid }, cart);

            return `Producto ${pid} agregado al carrito ${cid} correctamente.`;
        } catch (error) {
            return `Error al agregar producto al carrito: ${error.message}`;
        }
    }

    async deleteProductFromCartOnDb(cid, pid) {
        try {
            const cart = await Cart.findById(cid);

            // verifica la existencia del carrito
            if (!cart) {
                return (`Error: no encontramos el Carrito con el ID ${cid}.`);
            } else {
                cart.products = cart.products.filter(
                    (prod) => prod.product.toString() !== pid
                );
                await cart.save();
            }
            return `Producto ${pid} eliminado del carrito ${cid} correctamente.`;
        } catch (error) {
            return `Error al eliminar producto del carrito: ${error.message}`;
        }
    }

    async updateCartOnDb(cid, cart) {
        try {
            const oldCart = await Cart.findById(cid);
            oldCart.products = cart
            await oldCart.save();

            return {
                resp: true,
                msg: 'Carrito modificado correctamente',
                data: oldCart
            };
        } catch (error) {
            return `Error al actualizar el carrito: ${error.message}`;
        }
    }

    async updateQtityOnDb(cid, pid, params) {
        try {
            const cart = await Cart.findById(cid);
            const prod = cart.products.find((prod) => prod.product.toString() === pid);

            if (prod) {
                prod.quantity = params.quantity;
                await cart.save();
                return {
                    resp: true,
                    msg: 'Cantidad modificada correctamente',
                    data: prod
                };
            }
        } catch (error) {
            return `Error al actualizar el carrito: ${error.message}`;
        }
    }


    async deleteAllProductsFromCartOnDb(cid) {
        try {
            const cart = await Cart.findById(cid);

            // verifica la existencia del carrito
            if (!cart) {
                return (`Error: no encontramos el Carrito con el ID ${cid}.`);
            } else {
                cart.products = [];
                await cart.save();
            }
            return `Todos los productos fueron eliminados del carrito ${cid} correctamente.`;
        } catch (error) {
            return `Error al eliminar producto del carrito: ${error.message}`;
        }
    }

    async purchaseOnDb(ticketData) {
        try {
            await Ticket.create(ticketData)
            return (true)
        } catch (error) {
            return `Error realizar la compra: ${error.message}`;
        }
    }
}

module.exports = CartServices

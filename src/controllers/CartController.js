const uuid4 = require('uuid4');
const CartServices = require('../services/cartServices')
const ProductServices = require('../services/ProductServices');

const productServices = new ProductServices();

const cartServices = new CartServices();

class CartController {
    constructor(path) {
        this.path = path;
    }

    async addCart(req, res) {
        try {
            const resultMessage = await cartServices.addCartToDb()
            return (resultMessage);
        } catch (err) {
            return (`error al crear carrito: ${err}`);
        }
    }


    //2 mostrar producto del carrito por Id
    async getCartById(req, res) {
        const { cid } = req.params;
        try {
            let cart = await cartServices.getCartByIdFromDb(cid);
            if (cart.sta === true) {
                res.status(200).render('cart.handlebars', { cart: cart.data });
            } else {
                res.status(404).send(`Carrito con id ${cid} no encontrado`);
            }
        } catch (err) {
            res.status(500).send(`Error al intentar buscar el carrito: ${err}`);
        }
    }

    //3 agregar id de producto al carrito
    async addProductToCart(req, res) {
        const { cid } = req.params
        const { pid } = req.params
        try {
            const respuesta = await cartServices.addProductToCartOnDb(cid, pid)
            res.status(201).send(respuesta)
        } catch (err) {
            return ('Error al agregar producto al carrito:', err);
        }
    }

    async deleteProductFromCart(req, res) {
        const { cid } = req.params
        const { pid } = req.params
        try {
            const respuesta = await cartServices.deleteProductFromCartOnDb(cid, pid)
            res.status(201).send(respuesta)
        } catch (err) {
            return ('Error al agregar producto al carrito:', err);
        }
    }

    async updateCart(req, res) {
        const { cid } = req.params
        try {
            let cart = await cartServices.updateCartOnDb(cid, req.body)
            if (cart.resp === true) {
                res.status(200).send({ msg: cart.msg, data: cart.data })
            } else {
                res.status(404).send(`Carrito con id ${cid} no encontrado`)
            }
        } catch (err) {
            return (`Error al intentar buscar el carrito, ${err}`)
        }
    }

    async updateQtity(req, res) {
        const { cid } = req.params
        const { pid } = req.params
        try {
            let cart = await cartServices.updateQtityOnDb(cid, pid, req.body)
            if (cart.resp === true) {
                res.status(200).send({ msg: cart.msg, data: cart.data })
            } else {
                res.status(404).send(`Carrito con id ${cid} o producto con id ${pid} no encontrado`)
            }
        } catch (err) {
            return (`Error al intentar buscar el carrito, ${err}`)
        }
    }


    async deleteAllProductsFromCart(req, res) {
        const { cid } = req.params
        try {
            const respuesta = await cartServices.deleteAllProductsFromCartOnDb(cid)
            res.status(201).send(respuesta)
        } catch (err) {
            return ('Error al agregar producto al carrito:', err);
        }
    }


    async purchase(req, res) {
        const { cid } = req.params;
        try {
            let cart = await cartServices.getCartByIdFromDb(cid);

            if (cart.sta && cart.data) {
                const productosSinStock = [];
                let totalPrice = 0;

                // Array para enviar al modelo de ticket
                const ticketData = {
                    code: uuid4,
                    amount: 0,
                    purchaser: req.session.user.email,
                    products: []
                };

                for (const item of cart.data) {
                    const product = item.product;
                    const quantity = item.quantity;

                    // Verificar si hay suficiente stock del producto
                    const currentProduct = await productServices.getProductByIdFromDb(product._id);
                    if (!currentProduct || currentProduct.data.stock < quantity) {
                        productosSinStock.push({
                            productId: product._id,
                            productName: product.name,
                            quantityRequested: quantity
                        });
                    } else {
                        const subtotal = product.price * quantity;
                        totalPrice += subtotal;

                        currentProduct.data.stock -= quantity;
                        await productServices.updateProductOnDb(product._id, currentProduct.data);

                        ticketData.products.push({
                            productId: product._id,
                            productName: product.name,
                            quantity: quantity,
                            price: product.price
                        });
                    }
                }

                ticketData.amount = totalPrice;

                // Si todos los productos se procesan correctamente, limpia el carrito
                if (productosSinStock.length === 0) {
                    await CartServices.purchaseOnDb(ticketData);

                    await cartServices.deleteProductFromCartOnDb(cid);
                }

                let responseMessage = 'Compra procesada correctamente'+ticketData;
                if (productosSinStock.length > 0) {
                    responseMessage += '. Algunos productos no pudieron procesarse debido a falta de stock.';
                }

                return res.status(200).json({ success: true, message: responseMessage, productosSinStock });
            } else {
                return res.status(404).json({ success: false, message: 'El carrito no fue encontrado' });
            }
        } catch (error) {
            console.error('Error al procesar la compra:', error);
            return res.status(500).json({ success: false, message: 'Ocurrió un error al procesar la compra' });
        }
    }

}

module.exports = CartController

const uuid4 = require('uuid4');
const CartServices = require('../services/cartServices')
const ProductServices = require('../services/productServices');

const productServices = new ProductServices();

const cartServices = new CartServices();

class CartController {
    constructor(path) {
        this.path = path;
    }

    async addCart(req, res) {
        try {
            const resultMessage = await cartServices.addCartToDb()
            res.status(201).send(resultMessage);
        } catch (err) {
            res.status(500).send(`error al crear carrito: ${err}`);
        }
    }


    //2 mostrar producto del carrito por Id
    async getCartById(req, res) {
        const { cid } = req.params;
        try {
            let cart = await cartServices.getCartByIdFromDb(cid)
            const userData = req.session.user.cart
            const response = {
                cart,
                userData
            }
            if (cart.sta === true) {
                res.status(200).render('cart.handlebars', { response });
            } else {
                res.status(404).send(`Carrito con id ${cid} no encontrado`);
            }
        } catch (err) {
            res.status(500).send(`Error al intentar buscar el carrito: ${err}`);
        }
    }

    //3 agregar id de producto al carrito
    async addProductToCart(req, res) {
        const { cid, pid } = req.params
        try {
            const { role: userRole, email: userEmail } = req.session.user;

            const respuesta = await cartServices.addProductToCartOnDb(cid, pid, userRole, userEmail);
            res.status(201).send(respuesta)
        } catch (err) {
            return ('Error al agregar producto al carrito:', err);
        }
    }

    async deleteProductFromCart(req, res) {
        const { cid, pid } = req.params;
        try {
            const respuesta = await cartServices.deleteProductFromCartOnDb(cid, pid);
            res.status(200).json(respuesta);
        } catch (err) {
            res.status(500).json({ message: 'Error al eliminar producto del carrito', error: err.message });
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
            res.status(500).send(`Error al intentar buscar el carrito, ${err}`)
        }
    }


    async deleteAllProductsFromCart(req, res) {
        const { cid } = req.params
        try {
            const respuesta = await cartServices.deleteAllProductsFromCartOnDb(cid)
            res.status(200).json(respuesta)
        } catch (err) {
            res.status(500).json('Error al agregar producto al carrito:', err);
        }
    }

    // ticket
    async purchase(req, res) {
        const { cid } = req.params;
        try {
            let cart = await cartServices.getCartByIdFromDb(cid);
            let responseMessage = 'Agregue productos al carrito para continuar';

            if (cart.data.length === 0) {
                return res.status(400).json({ success: false, responseMessage });
            }

            if (cart.sta && cart.data) {
                const productosSinStock = [];
                let totalPrice = 0;

                const ticketData = {
                    amount: 0,
                    purchaser: req.session.user.email,
                    products: []
                };

                for (const item of cart.data) {
                    const product = item.product;
                    const quantity = item.quantity;

                    // Verificar si el producto existe y si hay suficiente stock
                    const currentProduct = await productServices.getProductByIdFromDb(product._id);
                    if (!currentProduct || !currentProduct.data || currentProduct.data.stock < quantity) {
                        productosSinStock.push({
                            product: item.product,
                            quantityRequested: quantity
                        });
                    } else {
                        // Si hay suficiente stock, agregar el producto al ticket de compra
                        const subtotal = product.price * quantity;
                        totalPrice += subtotal;

                        currentProduct.data.stock -= quantity;
                        await productServices.updateProductOnDb(product._id, currentProduct.data);

                        ticketData.products.push({
                            productId: product._id,
                            productName: product.title,
                            quantity: quantity,
                            price: product.price
                        });
                    }
                }
                ticketData.amount = totalPrice;

                // Si todos los productos tienen stock, genera el ticket y limpia el carrito
                if (productosSinStock.length === 0) {
                    ticketData.code = uuid4()
                    await cartServices.purchaseOnDb(ticketData);
                    await cartServices.deleteAllProductsFromCartOnDb(cid);
                    responseMessage = 'Compra procesada correctamente';
                } else {
                    // Filtramos los productos que sí tenemos stock y generamos el ticket
                    let checkCart = cart.data.filter(item => {
                        return !productosSinStock.some(productoSinStock => productoSinStock.product._id === item.product._id);
                    });
                    if (checkCart.length > 0) {
                        ticketData.code = uuid4();
                        await cartServices.purchaseOnDb(ticketData);
                    }

                    // Si algunos productos no pudieron procesarse debido a falta de stock los dejamos en el carrito
                    let modifiedCart = cart.data.filter(item => {
                        return productosSinStock.some(productoSinStock => productoSinStock.product._id === item.product._id);
                    });

                    const updatedCart = modifiedCart.map(item => {
                        return {
                            product: item.product._id,
                            quantity: item.quantity,
                            _id: item._id
                        };
                    });
                    await cartServices.updateCartOnDb(cid, updatedCart);

                    responseMessage = 'Gracias por tu compra. Los siguientes productos no pudieron procesarse debido a falta de stock: ';
                }
                const response = { responseMessage, productosSinStock, ticketData };

                res.status(200).send(response);
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

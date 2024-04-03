const CartServices = require('../services/cartServices')

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
}

module.exports = CartController

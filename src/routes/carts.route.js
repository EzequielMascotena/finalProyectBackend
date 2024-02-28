const { Router } = require('express');

//FS
/* const CartManager  = require ('../dao/fileSystem/CartManager')
const cartManager = new CartManager ('./carrito.json') */

//Mongoose
const CartManagerMongo = require('../dao/db/managers/CartManager.js')

const routerCart = new Router()
const cartManager = new CartManagerMongo();

// Crear carrito nuevo OK
routerCart.post("/", async (req, res) => {
    try {
        const resultMessage = await cartManager.addCart()
        res.status(201).send(resultMessage);
    } catch (err) {
        res.status(500).send(`error al crear carrito: ${err}`);
    }
});

//obtener carrito por id
routerCart.get("/:cid", async (req, res) => {
    const { cid } = req.params;
    try {
        let cart = await cartManager.getCartById(cid);
        if (cart.sta === true) {
            res.status(200).render('cart.handlebars', cart.data);
        } else {
            res.status(404).send(`Carrito con id ${cid} no encontrado`);
        }
    } catch (err) {
        res.status(500).send(`Error al intentar buscar el carrito: ${err}`);
    }
});

// agregar productos al cart
routerCart.post("/:cid/product/:pid", async (req, res) => {
    const { cid } = req.params
    const { pid } = req.params
    try {
        const respuesta = await cartManager.addProductToCart(cid, pid)
        res.status(201).send(respuesta)
    } catch (err) {
        return ('Error al agregar producto al carrito:', err);
    }
})

// eliminar un producto del carrito
routerCart.delete("/:cid/product/:pid", async (req, res) => {
    const { cid } = req.params
    const { pid } = req.params
    try {
        const respuesta = await cartManager.deleteProductFromCart(cid, pid)
        res.status(201).send(respuesta)
    } catch (err) {
        return ('Error al agregar producto al carrito:', err);
    }
})

//actualiza el carrito
routerCart.put("/:cid", async (req, res) => {
    const { cid } = req.params
    try {
        let cart = await cartManager.updateCart(cid, req.body)
        if (cart.resp === true) {
            res.status(200).send({ msg: cart.msg, data: cart.data })
        } else {
            res.status(404).send(`Carrito con id ${cid} no encontrado`)
        }
    } catch (err) {
        return (`Error al intentar buscar el carrito, ${err}`)
    }
})

//actualiza la cant de un prod
routerCart.put("/:cid/product/:pid", async (req, res) => {
    const { cid } = req.params
    const { pid } = req.params
    try {
        let cart = await cartManager.updateQtity(cid, pid, req.body)
        if (cart.resp === true) {
            res.status(200).send({ msg: cart.msg, data: cart.data })
        } else {
            res.status(404).send(`Carrito con id ${cid} o producto con id ${pid} no encontrado`)
        }
    } catch (err) {
        return (`Error al intentar buscar el carrito, ${err}`)
    }
})

// eliminar todos los productos del carrito
routerCart.delete("/:cid", async (req, res) => {
    const { cid } = req.params
    try {
        const respuesta = await cartManager.deleteAllProductsFromCart(cid)
        res.status(201).send(respuesta)
    } catch (err) {
        return ('Error al agregar producto al carrito:', err);
    }
})

module.exports = routerCart;







/* rutas y metodos con FS 
// Crear carrito nuevo
routerCart.post("/", async (req, res) => {
    const newCartId = await cartManager.addCart();
    res.status(201).send(`Carrito creado correctamente id ` + newCartId);
})

//obtener carrito por id
routerCart.get("/:cid", async (req, res) => {
    const { cid } = req.params
    let cart = await cartManager.getCartById(cid)
    if (cart) {
        res.status(200).send(cart)
    } else {
        res.status(404).send("Producto no encontrado")
    }
})

// agregar productos al cart
routerCart.post("/:cid/product/:pid", async (req, res) => {
    const { cid } = req.params
    const { pid } = req.params
        await cartManager.addProductToCart(cid, pid)
        res.status(200).send("El producto se agregó correctamente")
})
 */
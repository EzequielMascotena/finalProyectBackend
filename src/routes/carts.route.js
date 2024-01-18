const { Router } = require('express');
const CartManager  = require ('../CartManager')

const cartManager = new CartManager ('./carrito.json')

const routerCart = Router()

// Crear carrito nuevo
routerCart.post("/", async (req, res) => {
    await cartManager.addCart()
    res.status(201).send("Carrito creado correctamente.")
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


module.exports = routerCart;
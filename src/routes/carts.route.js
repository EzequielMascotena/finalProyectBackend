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
    /*La ruta POST  /:cid/product/:pid deberá agregar el producto al arreglo “products” del carrito seleccionado,
    agregándose como un objeto bajo el siguiente formato:
    product: SÓLO DEBE CONTENER EL ID DEL PRODUCTO (Es crucial que no agregues el producto completo)
    
    quantity: debe contener el número de ejemplares de dicho producto. El producto, de momento, se agregará de uno en uno.
    
    Además, si un producto ya existente intenta agregarse al producto, incrementar el campo quantity de dicho producto. 
    
    */
})


module.exports = routerCart;
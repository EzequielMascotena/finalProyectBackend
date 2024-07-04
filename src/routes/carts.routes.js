const { Router } = require('express');

const handlePolicies = require('../utils/middlewares')

//FS
/* const CartManager  = require ('../dao/fileSystem/CartManager')
const cartManager = new CartManager ('./carrito.json') */

//Mongoose
const CartController = require('../controllers/CartController');

const routerCart = new Router()
const cartController = new CartController();

// Crear carrito nuevo OK
routerCart.post("/", cartController.addCart);

//obtener carrito por id
routerCart.get("/:cid", handlePolicies('user', 'premium'), cartController.getCartById);

// agregar productos al carts
routerCart.post("/:cid/product/:pid", handlePolicies('user', 'premium'), cartController.addProductToCart)

// eliminar un producto del carrito
routerCart.delete("/:cid/product/:pid", handlePolicies('user', 'premium'), cartController.deleteProductFromCart)

//actualiza el carrito
routerCart.put("/:cid", handlePolicies('user', 'premium'), cartController.updateCart)

//actualiza la cant de un prod
routerCart.put("/:cid/product/:pid", handlePolicies('user', 'premium'), cartController.updateQtity)

// eliminar todos los productos del carrito
routerCart.delete("/:cid", handlePolicies('user', 'premium'), cartController.deleteAllProductsFromCart)

// ticket de compra
routerCart.post("/:cid/purchase", cartController.purchase)

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
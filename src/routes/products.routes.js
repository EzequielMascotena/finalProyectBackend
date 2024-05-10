const { Router } = require('express');
const handlePolicies = require('../utils/middlewares')

//FS
//const ProductManager  = require ('../dao/fileSystem/ProductManager')
//const productManager = new ProductManager ('./products.json')

//Mongoose
const ProductController = require('../controllers/ProductController');

const routerProd = new Router()
const productController = new ProductController();

routerProd.post("/", handlePolicies('admin'), productController.addProduct)
routerProd.get("/", productController.getProducts);
routerProd.get("/:id", productController.getProductById)
routerProd.put("/:pid", handlePolicies('admin'), productController.updateProduct);
routerProd.delete("/:pid", handlePolicies('admin'), productController.deleteProduct)


module.exports = routerProd;






//rutas y metodos para FS
/* routerProd.get ("/", async (req, res)=>{
    const limit = req.query.limit;
    let response = await productManager.getProducts()

    if (limit) {
        const limitNumber = parseInt(limit);
        if (!isNaN(limitNumber) && limitNumber > 0) {
            response = response.slice(0, limitNumber);
        } else {
            return res.json({ error: 'el parámetro indicado no es válido' });
        }
    }
    res.status(200).send(response)
})

routerProd.get ("/:id", async (req, res)=>{
    const {id} = req.params
    let prod = await productManager.getProductById(id)

    if (prod) {
        res.status(200).send(prod)
    } else {
        res.status(404).send("Producto no encontrado")
    }
})

routerProd.post ("/", async (req, res)=>{
    const conf = await productManager.addProduct(req.body)
    if (conf) {
        res.status(201).send("Producto creado correctamente.")
    } else {
        res.status(400).send("Error: Producto ya existente o falta completar algun campo.")
    }
})

routerProd.put ("/:pid", async (req, res)=>{
    const {pid} = req.params
    const conf = await productManager.updateProduct(pid, req.body)
    if (conf) {
        res.status(200).send("El Producto se modificó correctamente")
    } else {
        res.status(404).send("Producto no encontrado")
    }
})

routerProd.delete ("/:pid", async (req, res)=>{
    const {pid} = req.params
    const conf = await productManager.deleteProduct(pid)
    if (conf) {
        res.status(200).send("El Producto se eliminó correctamente")
    } else {
        res.status(404).send("Producto no encontrado")
    }

}) */
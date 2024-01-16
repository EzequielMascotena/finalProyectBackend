import { Router } from "express"

import { ProductManager } from '../ProductManager.js'

const productManager = new ProductManager ('./products.json')

const routerProd = Router()

routerProd.get ("/", async (req, res)=>{
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

routerProd.put ("/:id", async (req, res)=>{
    const {id} = req.params
    const conf = await productManager.updateProduct(id, req.body)
    if (conf) {
        res.status(200).send("El Producto se modificó correctamente")
    } else {
        res.status(404).send("Producto no encontrado")
    }
})

routerProd.delete ("/:id", async (req, res)=>{
    const {id} = req.params
    const conf = await productManager.deleteProduct(id)
    if (conf) {
        res.status(200).send("El Producto se eliminó correctamente")
    } else {
        res.status(404).send("Producto no encontrado")
    }

})


export default routerProd
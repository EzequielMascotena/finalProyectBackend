const { Router } = require('express');

//FS
//const ProductManager  = require ('../dao/fileSystem/ProductManager')
//const productManager = new ProductManager ('./products.json')

//Mongoose
const ProductManagerMongo = require('../dao/db/managers/ProductManager');

//const Products = require('../dao/db/models/product.model')

const routerProd = new Router()
const productManager = new ProductManagerMongo();



routerProd.get("/", async (req, res) => {
    try {
        const page = req.query.page;
        const limit = req.query.limit;
        const query = req.query.query;
        const sort = req.query.sort;

        let request = await productManager.getProducts(page, limit, query, sort);
        const response = {
            status: "success",
            payload: request.docs,
            totalPages: request.totalPages,
            page: request.page,
            pagingCounter: request.pagingCounter,
            hasPrevPage: request.hasPrevPage,
            hasNextPage: request.hasNextPage,
            nextPage: `localhost:8080/products?limit=${request.limit}&page=${request.nextPage}`,
            prevPage: `localhost:8080/products?limit=${request.limit}&page=${request.prevPage}`
        }

        res.status(200).send(response);
    } catch (error) {
        res.status(500).send({
            status: "error",
            error: `Ocurrió un error al obtener los productos: ${error}`
        });
    }
});

routerProd.get("/:id", async (req, res) => {
    try {
        const { id } = req.params
        let prod = await productManager.getProductById(id)

        if (prod === true) {
            console.log(prod)
            res.status(200).send(prod)
        } else {
            res.status(404).send(prod)
        }
    } catch (err) {
        console.error('Error al buscar el producto:', err);
        res.status(500).send({
            error: 'Ocurrió un error al buscar el producto'
        });
    }
})

routerProd.post("/", async (req, res) => {
    try {
        const conf = await productManager.addProduct(req.body)
        if (conf === true) {
            res.status(201).send({
                msg: 'Producto creado correctamente',
                data: req.body
            })
        } else
            res.status(400).send(conf)
    } catch (err) {
        console.error('Error al crear el producto:', err);
        res.status(500).send({
            error: 'Ocurrió un error al crear el producto'
        });
    }
})

routerProd.put("/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        const conf = await productManager.updateProduct(pid, req.body);
        if (conf.res === true) {
            res.status(200).send({
                msg: conf.msg,
                data: conf.data
            });
        } else {
            res.status(404).send(`El producto con id ${pid} no existe`);
        }
    } catch (err) {
        res.status(500).send({
            error: 'Ocurrió un error al intentar modificar el producto'
        });
    }
});

routerProd.delete("/:pid", async (req, res) => {
    try {
        const { pid } = req.params
        const resp = await productManager.deleteProduct(pid)
        res.status(200).send(resp)
    } catch (err) {
        res.status(404).send({
            msg: resp,
            error: err
        });
    }
})

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
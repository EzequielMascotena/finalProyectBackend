const ProductServices = require('../services/ProductServices')
const { generateProductsMocking } = require('../utils/mocks/products.mocks')

const productServices = new ProductServices();

class ProductController {
    constructor(path) {
        this.path = path;
    }

    //agregar producto
    async addProduct(req, res) {
        try {
            const conf = await productServices.addProductToDb(req.body)
            if (conf === true) {
                res.status(201).send({
                    msg: 'Producto creado correctamente',
                    data: req.body
                })
            } else { res.status(400).send(conf) }

        } catch (err) {
            console.error('Error al crear el producto:', err);
            res.status(500).send({
                error: 'Ocurrió un error al crear el producto'
            });
        }
    }

    //obtener todos los prods
    async getProducts(req, res) {
        try {
            const page = req.query.page;
            const limit = req.query.limit;
            const query = req.query.query;
            const sort = req.query.sort;

            let request = await productServices.getProductsFromDb(page, limit, query, sort);

            //formateo de datos para handlebars
            const formattedPayload = request.docs.map(doc => {
                return {
                    _id: doc._id,
                    title: doc.title,
                    description: doc.description,
                    price: doc.price,
                    stock: doc.stock,
                    category: doc.category
                };
            });

            const userData = req.session.user

            const response = {
                userData: userData,
                status: "success",
                payload: formattedPayload,
                totalPages: request.totalPages,
                page: request.page,
                pagingCounter: request.pagingCounter,
                hasPrevPage: request.hasPrevPage,
                hasNextPage: request.hasNextPage,
                nextPage: `localhost:8080/products?limit=${request.limit}&page=${request.nextPage}`,
                prevPage: `localhost:8080/products?limit=${request.limit}&page=${request.prevPage}`
            }

            res.status(200).render('products.handlebars', response);
        } catch (error) {
            res.status(500).send({
                status: "error",
                error: `Ocurrió un error al obtener los productos: ${error}`
            });
        }
    }

    //obtener producto por id
    async getProductById(req, res) {
        try {
            const { id } = req.params
            let prod = await productServices.getProductByIdFromDb(id)

            res.status(200).send(prod)

        } catch (err) {
            console.error('Error al buscar el producto:', err);
            res.status(500).send({
                error: 'Ocurrió un error al buscar el producto'
            });
        }
    }

    // modificar un producto con id
    async updateProduct(req, res) {
        try {
            const { pid } = req.params;
            const response = await productServices.updateProductOnDb(pid, req.body);

            res.status(200).send({
                response
            });
        } catch (error) {
            res.status(500).send(
                { error: error.code, message: error.message }
            );
        }
    }


    // borrar un prod por id
    async deleteProduct(req, res) {
        try {
            const { pid } = req.params
            const resp = await productServices.deleteProductFromDb(pid)
            res.status(200).send(resp)
        } catch (error) {
            res.status(404).send({ error: error.code, message: error.message })
        }
    }


    async getMockingProducts(req, res) {
        try {
            const productosSimulados = generateProductsMocking(100);

            res.status(200).send(productosSimulados);
        } catch (error) {
            res.status(500).send({
                status: "error",
                error: `Ocurrió un error con la funcion del mocking: ${error}`
            });
        }
    }
};

module.exports = ProductController;
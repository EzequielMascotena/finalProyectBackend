const ProductServices = require('../services/productServices')
const { generateProductsMocking } = require('../utils/mocks/products.mocks')
const transporter = require('../config/mail')

const productServices = new ProductServices();

class ProductController {
    constructor(path) {
        this.path = path;
    }

    //agregar producto
    async addProduct(req, res) {
        try {
            const ownerEmail = req.session.user.email;
            const productData = {
                ...req.body,
                owner: ownerEmail
            };

            const conf = await productServices.addProductToDb(productData);
            if (conf === true) {
                res.status(201).send({
                    msg: 'Producto creado correctamente',
                    data: productData
                });
            } else {
                req.logger.error(`${req.method} en ${req.url} al crear producto - at ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}. Error: ${conf}`);
                res.status(400).send(conf);
            }
        } catch (err) {
            req.logger.error(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}. Error: ${err}`);
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
            req.logger.error(`${req.method} en ${req.url} al crear producto - at ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}. Error: ${error}`)
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
            const product = await productServices.getProductByIdFromDb(pid);

            // Verificar permisos del usuario
            if (req.session.user.role !== 'admin' && product.owner !== req.session.user.email) {
                return res.status(403).send({
                    error: 'No tienes permiso para modificar este producto'
                });
            }

            const response = await productServices.updateProductOnDb(pid, req.body);

            res.status(200).send({
                response
            });
        } catch (error) {
            req.logger.error(`${req.method} en ${req.url} al modificar producto - at ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}. Error: ${error}`)
            res.status(500).send(
                { error: error.code, message: error.message }
            );
        }
    }


    // borrar un prod por id
    async deleteProduct(req, res) {
        try {
            const { pid } = req.params;
            const product = await productServices.getProductByIdFromDb(pid);

            const user = req.session.user
            
            // Verificar permisos del usuario
            if (user.role !== 'admin' && product.data.owner !== user.email) {
                return res.status(403).send({
                    error: 'No tienes permiso para borrar este producto'
                });
            }

            const resp = await productServices.deleteProductFromDb(pid);

            if (user.role === 'premium') {
                const mailOptions = {
                    from: `DeletedProduct <${process.env.EMAIL_USER}>`,
                    to: user.email,
                    subject: 'Producto Eliminado',
                    text: `Hola ${user.first_name},\n\nTu producto "${product.title}" ha sido eliminado del catálogo.\n\nSaludos,\nEl equipo de ecommerce`
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        req.logger.error(`Error al enviar correo: ${error}`);
                    } else {
                        req.logger.info(`Correo enviado: ${info.response}`);
                    }
                });
            }

            res.status(200).send(resp);
        } catch (error) {
            req.logger.error(`${req.method} en ${req.url} al borrar producto - at ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}. Error: ${error}`)
            res.status(404).send({ error: error.code, message: error.message });
        }
    }


    async getMockingProducts(req, res) {
        try {
            const productosSimulados = generateProductsMocking(100);

            res.status(200).send(productosSimulados);
        } catch (error) {
            req.logger.error(`${req.method} en ${req.url} al crear producto - at ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}. Error: ${error}`)
            res.status(500).send({
                status: "error",
                error: `Ocurrió un error con la funcion del mocking: ${error}`
            });
        }
    }
};

module.exports = ProductController;
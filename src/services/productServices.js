const Products = require('../dao/mongoDB/models/product.model')
const CustomError = require('../services/errors/CustomError')
const EErrors = require('../services/errors/errors-enum')

const { nonexistentIdErrorInfo } = require('./errors/messages/nonexistentIdErrorInfo')


class ProductServices {
    constructor(path) {
        this.path = path;
    }

    //agregar producto
    async addProductToDb(prod) {
        try {
            prod.status = true;
            await Products.create(prod)
            return (true)
        } catch (err) {
            console.log(err)
            return { error: 'Error al crear el producto: ' + err.message }
        }
    }

    //obtener todos los prods
    async getProductsFromDb(page, limit, query, sort) {
        try {
            //limit
            let l = 10
            if (limit) {
                l = limit
            }

            //page
            let p = 1
            if (page) {
                p = page
            }

            //Sort
            let order = {};
            if (sort === 'asc' || sort === 'desc') {
                order.price = (sort === 'asc') ? 1 : -1;
            }

            let resp = await Products.paginate({}, { page: p, limit: l, sort: order })


            //query, filtra por category y disponibles
            let filter = {}

            if (query) {
                filter = await Products.aggregate([
                    {
                        $match: {
                            stock: { $gt: 0 },
                            category: query
                        }
                    }
                ]);
                resp.docs = filter
            }

            return (resp)
        } catch (err) {
            console.log(err)
            return { error: 'Error al buscar los productos en la BD: ' + err.message }
        }
    }

    //obtener producto por id
    async getProductByIdFromDb(id) {
        try {
            const prods = await Products.find()
            let product = prods.find((p) => p.id === id);

            if (!product) {
                CustomError.createError({
                    name: "product update Error",
                    cause: nonexistentIdErrorInfo(id),
                    message: "Error intentando encontrar un producto",
                    code: EErrors.DATABASE_ERROR
                })
            }

            return ({
                msg: 'Producto encontrado',
                data: product
            })

        } catch (error) {
            console.log(error.cause)
            return ({ error: error.code, message: error.message })
        }
    }

    // modificar un producto con id
    async updateProductOnDb(id, producto) {
        try {
            const prods = await Products.find()
            let oldProd = prods.find((p) => p.id === id);

            if (!oldProd) {
                CustomError.createError({
                    name: "product update Error",
                    cause: nonexistentIdErrorInfo(id),
                    message: "Error intentando modificar un producto",
                    code: EErrors.DATABASE_ERROR
                })
            } else {
                oldProd.title = producto.title;
                oldProd.description = producto.description;
                oldProd.price = producto.price;
                oldProd.stock = producto.stock;
                oldProd.category = producto.category;
                oldProd.thumbnail = producto.thumbnail;
                oldProd.code = producto.code;

                await oldProd.save();

                return {
                    msg: 'Producto modificado correctamente',
                    data: oldProd
                };
            }
        } catch (error) {
            console.log(error.cause)
            return ({ error: error.code, message: error.message })
        }
    }


    // borrar un prod por id
    async deleteProductFromDb(id) {
        try {
            const prods = await Products.find()
            let exist = prods.find((p) => p.id === id);

            //customError
            if (!exist) {
                CustomError.createError({
                    name: "product elimination Error",
                    cause: nonexistentIdErrorInfo(id),
                    message: "Error intentando eliminar un producto",
                    code: EErrors.DATABASE_ERROR
                })
            }

            await Products.deleteOne({ _id: id })
            return (`El producto con el id ${id} se eliminó correctamente.`)

        } catch (error) {
            console.log(error.cause)
            return ({ error: error.code, message: error.message })
        }
    }
};

module.exports = ProductServices;
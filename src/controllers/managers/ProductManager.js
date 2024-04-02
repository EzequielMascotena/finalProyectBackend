const Products = require('../../models/product.model')

class ProductManagerMongo {
    constructor(path) {
        this.path = path;
    }

    //agregar producto
    async addProduct(prod) {
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
    async getProducts(page, limit, query, sort) {
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
        }
    }

    //obtener producto por id
    async getProductById(id) {
        try {
            let product = await Products.findById(id)
            if (product) {
                return ({
                    msg: 'Producto encontrado',
                    data: product
                })
            } else {
                return ({
                    msg: 'Producto NO encontrado',
                    data: `el ID ${id} no existe en la Base de Datos`
                })
            }
        } catch (err) {
            return (`Error al buscar el producto, ${err}`)
        }
    }

    // modificar un producto con id
    async updateProduct(id, producto) {
        try {
            const oldProd = await Products.findById(id);

            if (oldProd) {
                oldProd.title = producto.title;
                oldProd.description = producto.description;
                oldProd.price = producto.price;
                oldProd.stock = producto.stock;
                oldProd.category = producto.category;
                oldProd.thumbnail = producto.thumbnail;
                oldProd.code = producto.code;

                await oldProd.save();

                return {
                    res: true,
                    msg: 'Producto modificado correctamente',
                    data: oldProd
                };
            } else {
                return {
                    res: false
                };
            }
        } catch (err) {
            return (err)
        }
    }


    // borrar un prod por id
    async deleteProduct(id) {
        try {
            const prods = await Products.find()
            let exist = prods.find((p) => p.id === id);

            if (exist) {
                await Products.deleteOne({ _id: id })
                return (`El producto con el id ${id} se eliminó correctamente.`)
            } else {
                return (`El producto con el id ${id} es inexistente. Not found`)
            }
        } catch (err) {
            return (`error al intentar eliminar producto: ${err}`)
        }
    }
};

module.exports = ProductManagerMongo;
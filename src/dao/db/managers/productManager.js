const Products = require('../models/product.model')

class ProductManagerMongo {
    constructor(path) {
        this.path = path;
    }

    //agregar producto OK
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

    //obtener todos los prods OK
    async getProducts() {
        try {
            let resp = await Products.find()
            return ({
                msg: 'Productos encontrados',
                data: resp
            })
        } catch (err) {
            console.log(err)
        }
    }

    //obtener producto por id  OK
    async getProductById(id) {
        try {
            let product = await Products.findById(id)
            return ({
                msg: 'Producto encontrado',
                data: product
            })
        } catch (err) {
            return ({
                msg: 'Producto NO encontrado',
                data: `${err.message}, el ID ${err.value} no existe en la Base de Datos`
            })
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
        try{
            await Products.deleteOne({_id:id})
            return(`El producto con el id ${id} se eliminó correctamente.`)
        } catch (err){
            return (`El producto con el id ${id} es inexistente. ${err}`)
        }
    }
};

module.exports = ProductManagerMongo;
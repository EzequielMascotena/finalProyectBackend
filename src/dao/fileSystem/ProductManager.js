const fs = require('fs');
const uuid4 = require('uuid4');

class ProductManager {
    constructor(path) {
        this.path = path;
    }

    //agregar producto
    async addProduct(prod) {
        const prods = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))

        if (!validateRequiredFields(prod.title, prod.description, prod.price, prod.code, prod.stock, prod.category)) {
            return;
        }

        if (!prods.some((p) => p.code === prod.code)) {
            const id = uuid4();
            prod.status = true;
            prod.id = id;
            prods.push(prod);
            await fs.promises.writeFile(this.path, JSON.stringify(prods, null, 4), 'utf-8')
            console.log(`el producto ${prod.title} se agrego correctamente.`)
            return true
        } else {
            console.log(`El Producto ${prod.code} ya existe en la base de datos.`);
            return false
        }

        function validateRequiredFields(title, description, price, code, stock, category) {
            if (!title || !description || !price || !code || !stock || !category) {
                console.log('Todos los campos son obligatorios');
                return false;
            }
            return true;
        }
    }

    //obtener todos los prods
    async getProducts() {
        const prods = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))
        return prods
    }

    //obtener producto por id
    async getProductById(id) {
        const prods = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))
        let product = prods.find((p) => p.id === id);

        if (product) {
            return product;
        } else {
            console.log(`Error Producto con ID ${id} no encontrado.`);
            return (`Error Producto con ID no encontrado.`)
        }
    }

    // modificar un producto con id
    async updateProduct(id, producto) {
        try {
            const prods = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'));
    
            const index = prods.findIndex((p) => p.id === id);
    
            if (index !== -1) {
                prods[index].title = producto.title;
                prods[index].description = producto.description;
                prods[index].price = producto.price;
                prods[index].stock = producto.stock;
                prods[index].category = producto.category
                prods[index].thumbnail = producto.thumbnail;
                prods[index].code = producto.code;
    
                await fs.promises.writeFile(this.path, JSON.stringify(prods, null, 4), 'utf-8');
    
                return true;
            } else {
                console.log(`No se encontró un producto con el ID ${id}`);
                return false;
            }
        } catch (error) {
            console.error('Error al leer o escribir en el archivo:', error);
            return false;
        }
    }


    // borrar un prod por id
    async deleteProduct(id) {
        const prods = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))
        let product = prods.find((p) => p.id === id);

        if (product) {
            await fs.promises.writeFile(this.path, JSON.stringify(prods.filter(product => product.id !== id), null, 4), 'utf-8')
            console.log(`el producto ${product.id} se elimino correctamente.`)
            return true
        } else {
            console.log(`Not found`);
            return false
        }
    }
};

module.exports = ProductManager
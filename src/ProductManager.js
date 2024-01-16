import fs from 'fs';
import uuid4 from 'uuid4';

export class ProductManager {
    constructor(path) {
        this.path = path;
    }

    //title, description, price, thumbnail, code, stock
    async addProduct(prod) {
        const prods = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))

        if (!validateRequiredFields(prod.title, prod.description, prod.price, prod.thumbnail, prod.code, prod.stock)) {
            return;
        }

        if (!prods.some((p) => p.code === prod.code)) {
            const id = uuid4();
            prod.id = id;
            prods.push(prod);
            await fs.promises.writeFile(this.path, JSON.stringify(prods, null, 4), 'utf-8')
            console.log(`el producto ${prod.title} se agrego correctamente.`)
            return true
        } else {
            console.log(`El Producto ${prod.code} ya existe en la base de datos.`);
            return false
        }

        function validateRequiredFields(title, description, price, thumbnail, code, stock) {
            if (!title || !description || !price || !thumbnail || !code || !stock) {
                console.log('Todos los campos son obligatorios');
                return false;
            }
            return true;
        }
    }

    async getProducts() {
        const prods = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))
        return prods
    }

    async getProductById(id) {
        const prods = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))
        let product = prods.find((p) => p.id === id);

        if (product) {
            return product;
        } else {
            console.log(`Error Producto con ID ${id} no encontrado.`);
            return (`Error Producto con ID ${id} no encontrado.`)
        }
    }

    async updateProduct(id, producto) {
        try {
            const prods = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'));
    
            const index = prods.findIndex((p) => p.id === id);
    
            if (index !== -1) {
                prods[index].title = producto.title;
                prods[index].description = producto.description;
                prods[index].price = producto.price;
                prods[index].stock = producto.stock;
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





/*
const product = new ProductManager()


// mostrar productos
console.log (product.getProducts());

console.log('-------------------------------------------');

//agregrar productos
product.addProduct ('producto prueba', 'este es un producto prueba', 200, 'sin imagen', 'abc123', 25); 
product.addProduct ('producto prueba2', 'este es un producto prueba2', 2002, 'sin imagen2', 'abc1232', 252);
product.addProduct ('producto prueba3', 'este es un producto prueba3', 2003, 'sin imagen3', 'abc1233', 253);

console.log('-------------------------------------------');

// mostrar productos
console.log (product.getProducts());

console.log('-------------------------------------------');

//prueba de validacion de producto existente
product.addProduct ('producto prueba', 'este es un producto prueba', 200, 'sin imagen', 'abc123', 25);

console.log('-------------------------------------------');

//prueba de validacion de campo incompleto
product.addProduct ('producto prueba', 'sin imagen', 'abc123', 25);

console.log('-------------------------------------------');

// validacion buscar producto por id
//console.log (product.getProductById(6));

//buscar producto por id
console.log (product.getProductById(0));

console.log('-------------------------------------------');

// modificar producto
product.updateProduct(1, 'price', 250);

console.log('-------------------------------------------');
//validaciones de modificacion id inexistente y campo inexistente
product.updateProduct(6, 'price', 250);
product.updateProduct(0, 'color', 250);

console.log('-------------------------------------------');

//Eliminar producto y validacion de inexistencia
product.deleteProduct(6)
//product.deleteProduct(0)

*/
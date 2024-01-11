const fs = require('fs')

class ProductManager {
    constructor () {
        this.products = JSON.parse(fs.readFileSync ('./product.json', 'utf-8'))
        this.id = this.products.length;
        this.path = './product.json';
    }

    addProduct(title, description, price, thumbnail, code, stock){
        
        if (!validateRequiredFields(title, description, price, thumbnail, code, stock)) {
            return;
        }

        if(!this.products.some((p) => p.code === code)){
            let id = this.id ++
            let newProduct = {title, description, price, thumbnail, code, stock, id};

            this.products.push (newProduct);
            fs.writeFileSync(this.path, JSON.stringify(this.products, null, 4),'utf-8')
            console.log(`el producto ${title} se agrego correctamente.`)

        } else {
            console.log (`El Producto ${code} ya existe en la base de datos.`);
        }

        function validateRequiredFields(title, description, price, thumbnail, code, stock) {
            if (!title || !description || !price || !thumbnail || !code || !stock) {
                console.log('Todos los campos son obligatorios');
                return false;
            }
            return true;
        }
    }

    getProducts() {
        return this.products;
    }

    getProductById(id){
        let product = this.products.find ((p) => p.id === id);

        if (product) {
            return product;
        } else {
            console.log(`Error Producto con ID ${id} no encontrado.`);
            return (`Error Producto con ID ${id} no encontrado.`)
        }
    }

    updateProduct(id, field, changes) {
        let product = this.products.find ((p) => p.id === id);

        if (product) {
            if (product.hasOwnProperty(field)) {
                product[field] = changes;
                const write = async () => {
                    try{
                        await fs.promises.writeFile (this.path, JSON.stringify(this.products, null, 4),'utf-8')
                        console.log(`el producto se modifico correctamente.`)
                    }
                    catch (err) {
                        console.log('Error ', err)
                    }
                }
                write()
            } else {
                console.log(`El campo ${field} no existe en el producto.`);
            }
        } else {
            console.log(`Producto con ID ${id} no encontrado.`);
        }
    }


    deleteProduct(id){
        let product = this.products.find ((p) => p.id === id);

        if (product) {
            this.products.splice(id,1);
            const write = async () => {
                try{
                    await fs.promises.writeFile (this.path, JSON.stringify(this.products, null, 4),'utf-8')
                    console.log(`el producto se elimino correctamente.`)
                }
                catch (err) {
                    console.log('Error ', err)
                }
            }
            write()

        } else {
            console.log (`Not found`);
        }
    }
};

module.exports = ProductManager




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
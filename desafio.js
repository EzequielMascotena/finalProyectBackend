class ProductManager {
    constructor () {
        this.products = [];
        this.id = 0;
    }

    addProduct(title, description, price, thumbnail, code, stock){
        
        if (!validateRequiredFields(title, description, price, thumbnail, code, stock)) {
            return;
        }

        if(!this.products.some((p) => p.code === code)){
            let id = this.id ++
            let newProduct = {title, description, price, thumbnail, code, stock, id};

            this.products.push (newProduct);
            console.log (`el producto ${title} se agrego correctamente.`);
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
            console.log (`Not found`);
        }
    }
}

const product = new ProductManager()

// mostrar productos
console.log (product.getProducts());

//agregrar productos
product.addProduct ('producto prueba', 'este es un producto prueba', 200, 'sin imagen', 'abc123', 25); 

/* product.addProduct('Remera DC print', 'Remera manga corta DC. Estampa en frente. Fit: Regular.', 17499, 'https://www.cristobalcolon.com/fullaccess/item29329foto121240.jpg', 123, 13 );
product.addProduct('Musculosa DC Star', 'Musculosa DC Star estampa frontal, material algodón. Fit: Regular.', 14999, 'https://www.cristobalcolon.com/fullaccess/item23218foto126359.jpg', 456, 6);
product.addProduct('Zapatillas DC Trase TX', 'Parte superior Textil, Logotipo de impresión HD, Construcción Vulcanizada para una excelente sensación de la tabla y flexión de la suela de goma.', 64499, 'https://www.cristobalcolon.com/fullaccess/item11932foto66204.jpg', 789, 5);
product.addProduct('Zapatillas DC Pure', 'Zapatillas bajas Parte superior de cuero Forro con estampado gráfico Con cuello y lengüeta acolchados con espuma para mayor comodidad y sujeción Suela de copa de alto rendimiento Suela de goma adherente antiabrasiva.',86999, 'https://www.cristobalcolon.com/fullaccess/item14885foto70890.jpg', 159, 7);
 */

// mostrar productos
console.log (product.getProducts());

//prueba de validacion de producto existente
product.addProduct ('producto prueba', 'este es un producto prueba', 200, 'sin imagen', 'abc123', 25);

// validacion buscar producto por id
console.log (product.getProductById(1));



//buscar producto por id
console.log (product.getProductById(0));

//prueba de validacion de campo incompleto
product.addProduct ('producto prueba', 'sin imagen', 'abc123', 25);



//JSON
/* [
    {
        "title": "Remera DC print",
        "description": "Remera manga corta DC. Estampa en frente. Fit: Regular.",
        "price": 17499,
        "thumbnail": "https://www.cristobalcolon.com/fullaccess/item29329foto121240.jpg",
        "code": 123,
        "stock": 13,
        "id": 0
    },
    {
        "title": "Musculosa DC Star",
        "description": "Musculosa DC Star estampa frontal, material algodón. Fit: Regular.",
        "price": 14999,
        "thumbnail": "https://www.cristobalcolon.com/fullaccess/item23218foto126359.jpg",
        "code": 456,
        "stock": 6,
        "id": 1
    },
    {
        "title": "Zapatillas DC Trase TX",
        "description": "Parte superior Textil, Logotipo de impresión HD, Construcción Vulcanizada para una excelente sensación de la tabla y flexión de la suela de goma.",
        "price": 64499,
        "thumbnail": "https://www.cristobalcolon.com/fullaccess/item11932foto66204.jpg",
        "code": 789,
        "stock": 5,
        "id": 2
    },
    {
        "title": "Zapatillas DC Pure",
        "description": "Zapatillas bajas Parte superior de cuero Forro con estampado gráfico Con cuello y lengüeta acolchados con espuma para mayor comodidad y sujeción Suela de copa de alto rendimiento Suela de goma adherente antiabrasiva.",
        "price": 86999,
        "thumbnail": "https://www.cristobalcolon.com/fullaccess/item14885foto70890.jpg",
        "code": 159,
        "stock": 7,
        "id": 3
    }
] */
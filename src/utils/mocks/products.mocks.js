const { faker } = require('@faker-js/faker');
const uuid4 = require('uuid4');

function generateProductsMocking(cantidad) {
    const productos = [];

    for (let i = 1; i <= cantidad; i++) {
        const producto = {
            _id: uuid4(),
            title: faker.commerce.productName(), 
            description: faker.commerce.productDescription(),
            price: faker.commerce.price(),
            stock: faker.number.int({ min: 0, max: 100 }),
            category: faker.commerce.department()
        };

        productos.push(producto);
    }

    return productos;
}

module.exports = { generateProductsMocking };
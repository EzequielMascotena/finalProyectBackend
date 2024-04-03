const ProductServices = require('../services/productServices');
const productServices = new ProductServices();

async function obtenerProductos() {
    try {
        return await productServices.getProductsFromDb();
    } catch (err) {
        return `error al obtener Productos: ${err}`
    }
}

async function obtAllProds(req, res) {
    try {
        const products = await obtenerProductos();
        const formattedData = products.docs.map(doc => {
            return {
                _id: doc._id,
                title: doc.title,
                description: doc.description,
                price: doc.price,
                stock: doc.stock,
                category: doc.category
            };
        });
        const datos = formattedData
        res.render('tools.handlebars', datos)
    } catch (err) {
        return `error al obtener Productos: ${err}`
    }
}

async function showLiveProds(req, res) {
    const products = await obtenerProductos();
    const formattedData = products.docs.map(doc => {
        return {
            _id: doc._id,
            title: doc.title,
            description: doc.description,
            price: doc.price,
            stock: doc.stock,
            category: doc.category
        };
    });
    const datos = formattedData
    res.render('realTimeProducts.handlebars', datos)
}


module.exports = { obtAllProds, showLiveProds};
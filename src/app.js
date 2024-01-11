const express = require ('express')
const ProductManager = require ('./ProductManager')

const app = express()
let products = new ProductManager ()

app.use(express.urlencoded({extended:true}))

app.get('/', (req, res)=> {
    res.send ('Bienvenido')
})

app.get('/products', (req, res)=> {
    const limit = req.query.limit;
    let response = products.getProducts();

    if (limit) {
        const limitNumber = parseInt(limit);
        if (!isNaN(limitNumber) && limitNumber > 0) {
            response = response.slice(0, limitNumber);
        } else {
            return res.json({ error: 'el parámetro indicado no es válido' });
        }
    }
    res.send(response)
})

app.get('/products/:pid', (req, res)=> {
    let pid = parseInt(req.params.pid)
    let prFound= products.getProductById(pid)
    res.send (prFound)
})



app.listen(8080, ()=> {
    console.log ('Server run on port 8080')
})
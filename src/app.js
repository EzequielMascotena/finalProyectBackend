const express = require('express');

const session = require('express-session')
const MongoStore = require('connect-mongo')

const Database = require('./dao/db/db.js');
const passport = require('passport')
const initializeLocalPassport = require ('./passport/localPassport.js')
const initializeGithubPassport = require ('./passport/githubPassport.js')
const handlebars = require('express-handlebars');
const routerTools = require('./routes/chat&realTimeProd.routes.js');
const routerProd = require('./routes/products.route.js');
const routerCart = require('./routes/carts.route.js');
const routerAuth = require('./routes/auth.routes.js');
const routerLogin = require('./routes/login.routes.js')

const http = require('http')

//Socket
const { Server } = require('socket.io')
const socketService = require('./socket/index.js')

const PORT = 8080 || process.env.PORT
const app = express()

//Sesion
app.use(session({
    store: MongoStore.create({
        mongoUrl:'mongodb+srv://ezequielmascotena:ez123456@coderproject.gsslbll.mongodb.net/ecommerce',
    }),
    secret: 'code',
    resave: true,
    saveUninitialized: true
}))

//Server HTTP
const server = http.createServer(app)

//Public
app.use(express.static(__dirname + '/public'))

//Motor de plantillas
app.engine('handlebars', handlebars.engine())
app.set('view engine', 'handlebars')
app.set('views', __dirname + "/views")

//Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//Passport y estrategias
initializeLocalPassport()
initializeGithubPassport()
app.use(passport.initialize())
app.use(passport.session())

//Routes
app.use('/api/', routerLogin)
app.use ('/api/auth', routerAuth)
app.use('/api/products', routerProd)
app.use('/api/carts', routerCart)
app.use('/api/tools', routerTools)

//Socket
const io = new Server(server)
io.on('connection', (socket) => socketService(socket, io))

server.listen(PORT, () => {
    console.log(`Server run on port ${PORT}`)
    Database.connect()
})


module.exports = app 
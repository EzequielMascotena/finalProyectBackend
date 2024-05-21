const express = require('express');
const session = require('express-session')
const MongoStore = require('connect-mongo')

const Database = require('./dao/mongoDB/db.js')
const passport = require('passport')
const initializeLocalPassport = require('./config/passport/localPassport.js')
const initializeGithubPassport = require('./config/passport/githubPassport.js')
const handlebars = require('express-handlebars');

const routerTools = require('./routes/chat&realTimeProd.routes.js');
const routerProd = require('./routes/products.routes.js');
const routerCart = require('./routes/carts.routes.js');
const routerAuth = require('./routes/auth.routes.js');
const routerLogin = require('./routes/login.routes.js')
const routerSession = require('./routes/sessions.routes.js')
const routerLogger = require('./routes/loggerTest.routes.js')

const addLogger = require('./config/logger.js')

const http = require('http')


//Socket
const { Server } = require('socket.io')
const socketService = require('./socket/index.js')

const PORT = process.env.PORT
const app = express()

//Sesion
app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.MONGOURL
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

//Json Settings
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Logg base
app.use(addLogger)

//Passport y estrategias
initializeLocalPassport()
initializeGithubPassport()
app.use(passport.initialize())
app.use(passport.session())

//Routes
app.use('/', routerLogin)
app.use('/api/auth', routerAuth)
app.use('/api/products', routerProd)
app.use('/api/carts', routerCart)
app.use('/api/tools', routerTools)
app.use('/api/sessions', routerSession)
app.use('/', routerLogger)

//Socket
const io = new Server(server)
io.on('connection', (socket) => socketService(socket, io))

server.listen(PORT, () => {
    console.log(`Server run on port ${PORT}`)
    Database.connect()
})


module.exports = app 
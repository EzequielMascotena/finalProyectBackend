const { Router } = require('express');

const router = new Router()

//faltaria implementar el Auth

router.get('/', (req, res) => {
    res.render('login')
})

router.get('/register', (req, res) => {
    res.render('register')
})

module.exports = router
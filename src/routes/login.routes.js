const { Router } = require('express');

const router = new Router()

//faltaria implementar el Auth

router.get('/', (req, res) => {
    res.render('login')
})

router.get('/register', (req, res) => {
    res.render('register')
})

router.get('/recoverPassword', (req, res) => {
    res.render('recover')
})

module.exports = router
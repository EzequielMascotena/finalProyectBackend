const { Router } = require('express');
const userDTO = require('../dao/dto/currentUser.dto')

const router = new Router()

router.get('/current', (req, res) => {
    const userData = new userDTO(req.session.user)
    if (userData) {
        res.status(200).render('profile', userData)
    } else {
        res.redirect("/");
    }
})

module.exports = router
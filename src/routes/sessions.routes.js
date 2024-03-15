const { Router } = require('express');

const router = new Router()


router.get('/current', (req, res) => {
    const userData = req.session.user
    if (userData) {
        res.status(200).render('profile', userData)
    } else {
        res.redirect("/");
    }
})

module.exports = router
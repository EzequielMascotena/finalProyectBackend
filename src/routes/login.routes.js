const { Router } = require('express');

const router = new Router()

//faltaria implementar el Auth

router.get('/', (req, res)=>{
    res.render('login')
})

router.get('/register', (req, res)=>{
    res.render('register')
})

router.get('/profile', (req, res)=>{
    const userData= req.session.user
    if(userData){
        res.status(200).render('profile',userData)
    }else {
        res.redirect("/api/views/login");
    }
})

module.exports = router
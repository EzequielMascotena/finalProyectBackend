const { Router } = require('express');
const UserManager = require('../dao/db/managers/UserManager.js')
const passport = require('passport')

const router = new Router()

const userManager = new UserManager();


// registro con Passport Local
router.post("/register", passport.authenticate('register', { failureRedirect: '/user/failedRegister' }), async (req, res) => {
    res.status(200).redirect("/api/views/login");
});

router.get('/failedRegister', (req, res) => {
    res.send("Failed user register")
})


// login con passport Local
router.post("/login", passport.authenticate('login', { failureRedirect: '/user/failedLogin' }), async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).send({ error: "Email o contraseña incorrecta" });
        } else {
            req.session.user = req.user;
            res.status(200).redirect("/api/products");
        }
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

router.get('/failedLogin', (res, req) => {
    res.send('Failed user Login')
})


// registro y login con Passport GitHub
router.get("/github", passport.authenticate('github', {}), async (req, res) => { });

router.get("/callbackGithub", passport.authenticate('github', {}), async (req, res) => {
    req.session.user = req.user

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).redirect("/api/products");
});





router.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error al cerrar sesión:", err);
            res.status(500).send({ error: "Error al cerrar sesión" });
        } else {
            res.status(200).redirect("/api");
        }
    });
});



/*  //SIN PASSPORT
router.post("/register", async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        await userManager.newUser({
            firstName,
            lastName,
            email,
            password,
        });

        res.status(200).redirect("/api/views/login");
    } catch (err) {
        res.status(500).send(`El usuario ya existe ${err}`);
    }
}); 



router.post("/login", async (req, res) => {
    const { email, password } = req.body
    try { //busco usuario en la BD
        const user = await userManager.getUser(email, password);
        if (user.id) {
            req.session.user = user;
            res.status(200).redirect("/api/products");
        } else {
            res.status(401).send({ error: "Email o contraseña incorrecta" });
        }
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}); */


module.exports = router
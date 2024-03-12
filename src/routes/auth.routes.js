const { Router } = require('express');
const UserManager = require('../dao/db/managers/UserManager.js')

const router = new Router()

const userManager = new UserManager();


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
});


router.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error al cerrar sesión:", err);
            res.status(500).send({ error: "Error al cerrar sesión" });
        } else {
            res.status(200).redirect("/api/views/login");
        }
    });
});

//

module.exports = router
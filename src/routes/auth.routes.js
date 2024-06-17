const { Router } = require('express');
//const UserManager = require('../dao/db/managers/UserManager.js')
const passport = require('passport')
const transporter = require('../config/mail')
const bcrypt = require('bcrypt');

const userModel = require('../dao/mongoDB/models/user.model')

const router = new Router()

//const userManager = new UserManager();


// registro con Passport Local
router.post("/register", passport.authenticate('register', { failureRedirect: '/user/failedRegister' }), async (req, res) => {
    res.status(200).redirect("/");
});

router.get('/failedRegister', (req, res) => {
    res.send("Failed user register")
})

//password recovery

router.get('/mail', async (req, res) => {
    try {
        const email = req.query.email;
        const user = await userModel.findOne({ email: email });

        // Verificar si el usuario existe
        if (!user) {
            return res.status(404).send({ message: 'El Usuario no está registrado.' });
        }

        // creamos tokens de expiracion y los guardamos en la sesion.
        const tokenCreationTime = Date.now();
        const resetToken = user.email + tokenCreationTime;
        const hashedToken = await bcrypt.hash(resetToken, 10);

        req.session.resetToken = hashedToken;
        req.session.email = user.email;
        req.session.tokenCreationTime = tokenCreationTime;

        const resetLink = `http://localhost:${process.env.PORT}/api/auth/reset-password?token=${encodeURIComponent(resetToken)}`;

        //enviamos el mail con el link de recuperacion.
        const mailOptions = {
            from: 'passwordRecover <ramandoprog@gmail.com>',
            to: user.email,
            subject: 'Password Recover',
            text: `Ingrese en el link para crear una contraseña nueva. Si usted no solicitó el cambio ignore este correo.`,
            html: `<p>Ingrese en el <a href="${resetLink}">link</a> para crear una contraseña nueva. Si usted no solicitó el cambio ignore este correo.</p>`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).send({ message: 'Correo enviado exitosamente' });

    } catch (error) {
        res.status(500).send({ message: 'Error al enviar el correo' + error });
    }
});

router.get('/reset-password', (req, res) => {
    const token = req.query.token;
    res.render('resetPassword', { token });
});

router.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        return res.status(400).send({ message: 'Token y nueva contraseña son requeridos' });
    }

    try {
        const email = req.session.email;
        const resetToken = req.session.resetToken;
        const tokenCreationTime = req.session.tokenCreationTime;

        if (!resetToken || !email || !tokenCreationTime) {

            return res.status(400).send({ message: 'Token inválido o expirado' });
        }

        //comprobamos que no haya expirado el token, dura 60 min.
        const currentTime = Date.now();
        const elapsedTime = (currentTime - tokenCreationTime) / 1000 / 60;

        if (elapsedTime > 60) {
            res.redirect(`http://localhost:${process.env.PORT}/recoverPassword`)
        }

        const isTokenValid = await bcrypt.compare(email + tokenCreationTime, resetToken);
        if (!isTokenValid) {
            return res.status(400).json({ message: 'Token inválido o expirado' });
        }

        //buscamos el usuario por mail
        const user = await userModel.findOne({ email: email });
        if (!user) {
            return res.status(404).send({ message: 'Usuario no encontrado' });
        }

        //revisamos que la contrasena no sea la misma que antes.
        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            return res.status(400).send({ message: 'No puedes usar la misma contraseña' });
        }

        //guardamos la nueva contrasena si paso las validaciones
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        //limpiamos los tokens que habiamos cargado en la sesion
        req.session.resetToken = null;
        req.session.email = null;
        req.session.tokenCreationTime = null;

        res.status(200).send({ message: 'Contraseña restablecida exitosamente' });
    } catch (error) {
        res.status(500).send({ message: 'Error al restablecer la contraseña' + error });
    }
});


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





router.get("/logout", async (req, res) => {
    try {
        const user = await userModel.findById(req.user._conditions._id);
        if (user) {
            user.lastConnection = new Date();
            await user.save();
        }
        req.session.destroy((err) => {
            if (err) {
                console.error("Error al cerrar sesión:", err);
                res.status(500).send({ error: "Error al cerrar sesión" });
            } else {
                res.status(200).redirect("/");
            }
        });
    } catch (err) {
        console.error('Error al cerrar sesión:', err);
        res.status(500).send('Error al cerrar sesión.');
    }
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
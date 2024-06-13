const { Router } = require('express');
const userDTO = require('../dao/dto/currentUser.dto')
const UserModel = require('../dao/mongoDB/models/user.model')

const router = new Router()

router.get('/current', (req, res) => {
    const userData = new userDTO(req.session.user)
    if (userData) {
        res.status(200).render('profile', userData)
    } else {
        res.redirect("/");
    }
})

router.get('/premium/:uid', async (req, res) => {
    const userId = req.params.uid;

    try {
        // buscamos el usuario en la BD
        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).send("Usuario no encontrado.");
        }

        // cambiamos el rol del usuario
        if (user.role === 'user') {
            user.role = 'premium';
        } else if (user.role === 'premium') {
            user.role = 'user';
        }

        await user.save();

        res.status(200).send({msg: "Rol del usuario actualizado correctamente.", newRole: user.role});
    } catch (error) {
        console.error("Error al actualizar el rol del usuario:", error);
        res.status(500).send("Ocurrió un error al actualizar el rol del usuario.");
    }
});


module.exports = router
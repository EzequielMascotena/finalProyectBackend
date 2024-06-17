const UserModel = require('../../dao/mongoDB/models/user.model')
const userDTO = require('../../dao/dto/currentUser.dto')

class UserManager {
    async getCurrentUser(req, res) {
        try {
            const userData = new userDTO(req.session.user)
            if (userData) {
                res.status(200).render('profile', userData)
            } else {
                res.redirect("/");
            }
        } catch (error) {
            res.status(500).send("Ocurrió un error obtener datos del usuario.");
        }
    }


    async switchUserRole(req, res) {
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

            res.status(200).send({ msg: "Rol del usuario actualizado correctamente.", newRole: user.role });
        } catch (error) {
            console.error("Error al actualizar el rol del usuario:", error);
            res.status(500).send("Ocurrió un error al actualizar el rol del usuario.");
        }
    }


    async addFiles(req, res) {
        if (!req.files || req.files.length === 0) {
            return res.status(400).send({ status: "error", msg: "Error al adjuntar archivos, no se completó la gestión." });
        }

        const userId = req.params.uid;
        const files = req.files.map(file => ({
            name: file.originalname,
            url: file.path
        }));

        try {
            const user = await UserModel.findById(userId);
            if (!user) {
                return res.status(404).send({ status: "error", msg: "Usuario no encontrado." });
            }

            user.documents = user.documents.concat(files);

            await user.save();

            res.status(200).send({ status: "success", msg: "Archivos subidos y guardados correctamente.", data: files });
        } catch (error) {
            console.error("Error al subir archivos:", error);
            res.status(500).send({ status: "error", msg: "Error interno al subir archivos." });
        }
    }

    async addProfile(req, res) {
        if (!req.file) {
            return res.status(400).send({ status: "error", msg: "Error al adjuntar el perfil, no se completó la gestión." });
        }

        const userId = req.params.uid;
        const profile = {
            name: req.file.originalname,
            url: req.file.path
        };

        try {
            const user = await UserModel.findById(userId);
            if (!user) {
                return res.status(404).send({ status: "error", msg: "Usuario no encontrado." });
            }

            user.profile = profile;

            await user.save();

            res.status(200).send({ status: "success", msg: "Perfil subido y guardado correctamente.", data: profile });
        } catch (error) {
            console.error("Error al subir el perfil:", error);
            res.status(500).send({ status: "error", msg: "Error interno al subir el perfil." });
        }
    }

    async addProduct(req, res) {
        if (!req.file) {
            return res.status(400).send({ status: "error", msg: "Error al adjuntar el producto, no se completó la gestión." });
        }

        const userId = req.params.uid;
        const product = {
            name: req.file.originalname,
            url: req.file.path
        };

        try {
            const user = await UserModel.findById(userId);
            if (!user) {
                return res.status(404).send({ status: "error", msg: "Usuario no encontrado." });
            }

            user.products = user.products || [];
            user.products.push(product);

            await user.save();

            res.status(200).send({ status: "success", msg: "Producto subido y guardado correctamente.", data: product });
        } catch (error) {
            console.error("Error al subir el producto:", error);
            res.status(500).send({ status: "error", msg: "Error interno al subir el producto." })
        }
    }
}

module.exports = UserManager;



//const { createHash, isValidatePassword } = require('../../../utils/bcrypt')

/*  ********* register inicial antes de implementar passport  *********

class UserManager {
    async newUser({ firstName, lastName, email, password }) {

        //hasheo la contraseña
        password = createHash(password);

        try {
            const newUser = await User.create({
                firstName,
                lastName,
                email,
                password
            });

            return ('usuario Creado Correctamente');
        } catch (err) {
            return res.status(500).send({ error: err.message });
        }
    }

    async getUser(email, password) {
        try {
            const user = await User.findOne({ email });
            if (isValidatePassword(user.password, password)) {
                return user;
            }
        } catch (err) {
            return (err);
        }
    }
}

module.exports = UserManager; */
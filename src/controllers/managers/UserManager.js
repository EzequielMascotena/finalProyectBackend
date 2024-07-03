const UserModel = require('../../dao/mongoDB/models/user.model')
const userDTO = require('../../dao/dto/currentUser.dto')
const transporter = require('../../config/mail')

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
            const user = await UserModel.findById(userId);

            if (!user) {
                return res.status(404).send("Usuario no encontrado.");
            }

            // de premium a user
            if (user.role === 'premium') {
                user.role = 'user';
                await user.save();
                return res.status(200).send({ msg: "Rol del usuario actualizado correctamente.", newRole: user.role });
            }

            // de user a premium, verificar documentos
            if (user.role === 'user') {
                const hasRequiredDocuments = user.documents.some(document =>
                    document.name === 'Identificación' ||
                    document.name === 'Comprobante de domicilio' ||
                    document.name === 'Comprobante de estado de cuenta'
                );

                if (!hasRequiredDocuments) {
                    return res.status(400).send("El usuario debe cargar los documentos requeridos en profile para actualizar a premium.");
                }

                user.role = 'premium';
                await user.save();

                return res.status(200).send({ msg: "Rol del usuario actualizado correctamente.", newRole: user.role });
            }
        } catch (error) {
            console.error("Error al actualizar el rol del usuario:", error);
            res.status(500).send("Ocurrió un error al actualizar el rol del usuario.");
        }
    }


    async addFiles(req, res) {
        if (!req.files) {
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

            user.documents = user.documents || [];
            user.documents = user.documents.concat(files);

            await user.save();

            res.status(200).send({ status: "success", msg: "Archivos subidos y guardados correctamente.", data: files });
        } catch (error) {
            console.error("Error al subir archivos:", error);
            res.status(500).send({ status: "error", msg: "Error interno al subir archivos." });
        }
    }

    async addProfile(req, res) {
        if (!req.files) {
            return res.status(400).send({ status: "error", msg: "Error al adjuntar el perfil, no se completó la gestión." });
        }

        const userId = req.params.uid;
        const profile = req.files.map(file => ({
            name: file.originalname,
            url: file.path
        }));

        try {
            const user = await UserModel.findById(userId);
            if (!user) {
                return res.status(404).send({ status: "error", msg: "Usuario no encontrado." });
            }

            user.documents = user.documents || [];
            user.documents = user.documents.concat(profile);

            await user.save();

            res.status(200).send({ status: "success", msg: "Perfil subido y guardado correctamente.", data: profile });
        } catch (error) {
            console.error("Error al subir el perfil:", error);
            res.status(500).send({ status: "error", msg: "Error interno al subir el perfil." });
        }
    }

    async addProduct(req, res) {
        if (!req.files) {
            return res.status(400).send({ status: "error", msg: "Error al adjuntar el producto, no se completó la gestión." });
        }

        const userId = req.params.uid;
        const product = req.files.map(file => ({
            name: file.originalname,
            url: file.path
        }));

        try {
            const user = await UserModel.findById(userId);
            if (!user) {
                return res.status(404).send({ status: "error", msg: "Usuario no encontrado." });
            }

            user.documents = user.documents || [];
            user.documents = user.documents.concat(product);

            await user.save();

            res.status(200).send({ status: "success", msg: "Producto subido y guardado correctamente.", data: product });
        } catch (error) {
            console.error("Error al subir el producto:", error);
            res.status(500).send({ status: "error", msg: "Error interno al subir imagenes del producto." })
        }
    }


    async getAllUsers(req, res) {
        try {
            const users = await UserModel.find({}, 'first_name last_name email role');
            const usersDTO = users.map(user => new CurrentUserDTO(user));
            res.status(200).send(usersDTO);
        } catch (error) {
            console.error("Error al obtener todos los usuarios:", error);
            res.status(500).send("Ocurrió un error al obtener los usuarios.");
        }
    }

    async deleteInactiveUsers(req, res) {
        const days = req.query.days || 2;
        const inactiveSince = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

        try {
            const inactiveUsers = await UserModel.find({ lastConnection: { $lt: inactiveSince } });
            const inactiveUserEmails = inactiveUsers.map(user => user.email);

            // Eliminar usuarios inactivos
            await UserModel.deleteMany({ lastConnection: { $lt: inactiveSince } });

            // Enviar correos de notificación
            for (const email of inactiveUserEmails) {
                const mailOptions = {
                    from: `DeletedAccount <${process.env.EMAIL_USER}>`,
                    to: email,
                    subject: 'Cuenta eliminada por inactividad',
                    text: 'Tu cuenta ha sido eliminada debido a inactividad.'
                };

                await transporter.sendMail(mailOptions);
            }

            res.status(200).send({ msg: "Usuarios inactivos eliminados y correos de notificación enviados." });
        } catch (error) {
            console.error("Error al eliminar usuarios inactivos:", error);
            res.status(500).send("Ocurrió un error al eliminar los usuarios inactivos.");
        }
    }

    async viewUsers(req, res) {
        try {
            const users = await UserModel.find({}, 'first_name last_name email role');
            res.render('admin', { users });
        } catch (error) {
            console.error("Error al obtener los usuarios:", error);
            res.status(500).send("Ocurrió un error al obtener los usuarios.");
        }
    }

    async changeUserRole(req, res) {
        const userId = req.params.uid;
        const newRole = req.body.role;

        try {
            const user = await UserModel.findById(userId);
            if (!user) {
                return res.status(404).send("Usuario no encontrado.");
            }

            user.role = newRole;
            await user.save();

            res.status(200).send({ msg: "Rol del usuario actualizado correctamente.", newRole: user.role });
        } catch (error) {
            console.error("Error al actualizar el rol del usuario:", error);
            res.status(500).send("Ocurrió un error al actualizar el rol del usuario.");
        }
    }

    async deleteUser(req, res) {
        const userId = req.params.uid;

        try {
            const user = await UserModel.findByIdAndDelete(userId);
            if (!user) {
                return res.status(404).send("Usuario no encontrado.");
            }

            res.status(200).send({ msg: "Usuario eliminado correctamente." });
        } catch (error) {
            console.error("Error al eliminar el usuario:", error);
            res.status(500).send("Ocurrió un error al eliminar el usuario.");
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
const User = require('../../models/user.model')

const { createHash, isValidatePassword } = require('../../../utils/bcrypt')

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

module.exports = UserManager;
const User = require('../models/user.model')

class UserManager {
    async newUser({ firstName, lastName, email, password }) {
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
            const user = await User.findOne({ email, password });
            return user;
        } catch (err) {
            return (err);
        }
    }
}

module.exports = UserManager;
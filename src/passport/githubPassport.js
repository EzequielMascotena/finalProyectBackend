const passport = require('passport')
const githubStrategy = require('passport-github2')
const { createHash, isValidatePassword } = require('../utils/bcrypt')


const userModel = require('../dao/db/models/user.model')



const initializeGithubPassport = () => {
    passport.use('github', new githubStrategy(
        {
            clientID: "Iv1.dc6a818d8099f58f",
            clientSecret: "aa5bb6fd0243b3b5f28781d66b801d3d42cd5c6b",
            callbackURL: "http://localhost:8080/api/auth/callbackGithub"
        },

        async (accessToken, refreshToken, profile, done) => {
            try {
                const existInLocal = await userModel.findOne({ email: profile.email });
                if (existInLocal) {
                    await userModel.updateOne({ _id: existInLocal._id }, { githubId: profile.id });
                    return done(null, existInLocal);  // si ya existe por Local, actualizar el usuario con datos git
                }

                const exist = await userModel.findOne({ githubId: profile.id });
                if (exist) {
                    return done(null, exist) // si ya existe por git, devuelve el user e inicia sesion
                } else {
                    const password = profile.id;
                    const hashedPass = await createHash(password)
                    let email = profile.email;
                    if (!email) {
                        email = profile.id + '@test.com'; // un correo electrónico si el perfil de GitHub no tiene uno
                    }
                    const newUserGit = new userModel({
                        githubId: profile.id,
                        firstName: profile.username,
                        lastName: " ",
                        email: email,
                        password: hashedPass
                    });
                    const user = await newUserGit.save();
                    return done(null, user); // Nuevo usuario creado, inicia sesión
                }
            } catch (err) {
                done(`Error al crear el usuario desde github: ${err}`)
            }
        }
    ))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser((id, done) => {
        let user = userModel.findById(id)
        done(null, user)
    })
}

module.exports = initializeGithubPassport
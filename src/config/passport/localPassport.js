const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const CartServices = require('../../services/cartServices')
const cartServices = new CartServices();

const userModel = require('../../dao/mongoDB/models/user.model')

const { createHash, isValidatePassword } = require('../../utils/bcrypt')


const initializeLocalPassport = () => {
    passport.use('register', new LocalStrategy(
        { usernameField: 'email', passReqToCallback: true },
        async (req, username, password, done) => {
            try {
                let userData = req.body
                let user = await userModel.findOne({ email: username })
                const hashedPassword = createHash(password)
                if (user) {
                    done('Error, usuario existente')
                } else {
                    const newCartId = await cartServices.addCartToDb();
                    
                    let userNew = {
                        cart: newCartId,
                        first_name: userData.firstName,
                        last_name: userData.lastName,
                        age: userData.age,
                        email: username,
                        password: hashedPassword
                    }
                    let result = await userModel.create(userNew)
                    done(null, result)
                }
            } catch (err) {
                console.log(err)
                done(`Error al crear el usuario: ${err}`)
            }
        }
    ))

    passport.use('login', new LocalStrategy(
        { usernameField: "email" },
        async (username, password, done) => {
            try {
                const user = await userModel.findOne({ email: username })
                if (!user) {
                    return done('Error, usuario inexistente')
                }
                if (!isValidatePassword(user.password, password)) {
                    done('El usuario o contraseña son incorrectos')
                } else {
                    user.lastConnection = new Date();
                    await user.save();
                    done(null, user);
                }
            } catch (err) {
                done(`Error al iniciar sesion: ${err}`)
            }
        }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser((id, done) => {
        let user = userModel.findById(id)
        done(null, user) 
    })
}

module.exports = initializeLocalPassport
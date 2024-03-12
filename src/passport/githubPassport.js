const passport = require('passport')
const githubStrategy = require('passport-github2')

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
                let { name, email, id } = profile._json
                let user = await userModel.findOne({ name })
                console.log(name)
                if (!user) {
                    if (!email) {
                        user = await userModel.create(
                            {
                                firstName: name,
                                lastName: ' ',
                                email: id+"@default.com",
                                password: ' ',
                                github: profile
                            }
                        )
                    } else {
                        user = await userModel.create(
                            {
                                firstName: name,
                                lastName: ' ',
                                email,
                                password: ' ',
                                github: profile
                            }
                        )
                    }
                }
                return done(null, user)
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
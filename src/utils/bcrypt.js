const bcrypt = require('bcrypt')

//registro
const createHash = (password)=> {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

//Login
const isValidatePassword = (userPass, password) =>{
    let compare = bcrypt.compareSync(password, userPass)
    return compare
}

module.exports = {
    createHash, isValidatePassword
}

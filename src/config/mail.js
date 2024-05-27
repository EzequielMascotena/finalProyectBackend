const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth:{
        user: "ramandoprog@gmail.com",
        pass: "jmuyyvpnzpspuwjk"
    },
    tls: {
        rejectUnauthorized: false
    }
})

module.exports= transporter
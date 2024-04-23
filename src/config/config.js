const dotenv = require('dotenv')
const { Command } = require('commander')

//commander
const program = new Command()
program
    .option('--mode <mode>', 'Modo o enviroment de trabajo', 'prod')

program.parse()

//ruta de entornos
dotenv.config({
    path: program.opts().mode === 'dev' ? '.env.dev' : '.env.prod'
});

module.exports = {
    persistence : process.env.PERSISTENCE,
    port : process.env.PORT,
    host : process.env.HOST,
    mongoUrl : process.env.MONGOURL
}
require('dotenv').config() // Load .env file configurations

const { sendMail } = require('./app/utils/email')

sendMail('Teste', 'Mensagem!!!')
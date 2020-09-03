var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var cors = require('cors');
const creds = require('./config');

var transport = {
    host: 'smtp.outlook.com', // Don’t forget to replace with the SMTP host of your provider
    port: 587,
    auth: {
    user: creds.USER,
    pass: creds.PASS
  }
}

var transporter = nodemailer.createTransport(transport)

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take messages');
  }
});

router.post('/send', (req, res, next) => {
  var nome = req.body.Nome
  var email = req.body.email
  var telefone = req.body.telefone
  var message = req.body.message === 'undefined' ? 'VAZIO' : req.body.message
  var produtos = req.body.Produtos

  var content = `Nome do Cliente: ${nome}
               \nEmail: ${email}
               \nTelefone: ${telefone}
               \nMensagem: ${message}
               \nProdutos: ${produtos} `
    
  var mail = {
    from: nome,
    to: 'italocod@hotmail.com',  // Change to email address that you want to receive messages on
    subject: `Mensagem de Pedido do Cliente: ${nome}`,
    text: content
  }

  transporter.sendMail(mail, (err, data) => {
    if (err) {
      res.json({
        status: 'fail'
      })
    } else {
      res.json({
       status: 'success'
      })
    }
  })
})

const app = express()
app.use(cors())
app.use(express.json())
app.use('/', router)
app.listen(3002)
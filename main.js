var PORT = process.env.PORT  || 3000;
require('dotenv').config();
var express = require('express');
var nodemailer = require('nodemailer');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json()); // body en formato json
app.use(bodyParser.urlencoded({ extended: false })); //body formulario

app.post('/send-email', (req ,res ) => {
    const transporter = nodemailer.createTransport(
        {
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
    });

    var mailOptions = {
        from: 'maximiliano.vargas@xappia.com',
        to: req.body.to,
        subject: req.body.subject,
        text: req.body.text
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if(error){
            res.status(500).send(error.message);
        }
        else{
            res.status(200).jsonp(req.body);
        }
    });
});

app.listen(PORT, () => {
    console.log("Servidor on");
});
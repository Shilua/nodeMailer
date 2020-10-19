var PORT = process.env.PORT  || 3000;
require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
var app = express();

app.use(bodyParser.json()); // body en formato json
app.use(bodyParser.urlencoded({ extended: false })); //body formulario

app.post('/token', (req,res)=>{
    console.log('user '+ req.user);
    if (req.body.user == process.env.USERTOKEN && req.body.pass == process.env.USERPASSWORD) {
        let user = req.user;
        let token = jwt.sign({user},process.env.SECRETKEY);
        res.json({token});
    }
    else{
        res.status(400).send('user or pass invalid');
    }
});

app.post('/send-email', ensureToken, (req ,res ) => {
    jwt.verify(req.token, process.env.SECRETKEY, (err, data) =>{
        if (err) {
            res.status(403).send('invalid token');
        } else {
            sendEmail(req,res);
        }
    });
    
});

function sendEmail(req, res) {
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
        text: req.body.text,
        html: req.body.html
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if(error){
            res.status(500).send(error.message);
        }
        else{
            res.status(200).jsonp(req.body);
        }
    });
}

function ensureToken(req, res, next) {
    let bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        let bearer = bearerHeader.split(' ');
        let bearerToken = bearer[1];
        req.token = bearerToken;
        next()
    }else{
        res.send(403).send('missing token')
    }
}

app.listen(PORT, () => {
    console.log("Servidor on");
});
const nodemailer = require("nodemailer");
const mailgen = require("mailgen");
const { response } = require("express");
require('dotenv').config();

// just testing
const createEmail = async(req, res) =>{
    try{
        let testAccount = await nodemailer.createTestAccount();

        const transport = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            }
        })

        let message = {
            from: '"Fred Foo 👻" <foo@example.com>', // sender address
            to: "bar@example.com, baz@example.com", // list of receivers
            subject: "Hello ✔", // Subject line
            text: "Hello world?", // plain text body
            html: "<b>Hello world?</b>", // html body
        }

        transport.sendMail(message)
        .then((info) =>{
            return res.status(201)
            .json({
                msg: 'YO',
                info: info.messageId,
                preview: nodemailer.getTestMessageUrl(info),
            })
        })
        .catch(error => {
            return res.status(500).json({msg: error})
        });

        // console.log('Message sent' + info.messageId)
    } catch(error){
        console.log(error);
    }
}

const confirmEmail = async(req, res)=>{
    const {usuario, email, password} = req.body;
    let config = {
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASS,
        }
    }

    console.log(config)

    let tranporter = nodemailer.createTransport(config);

    let mailgenerator = new mailgen({
        theme: 'default',
        product: {
            name: 'Mailgen',
            link: 'http://localhost:3000/files/main.html'
        }
    })

    let response = {
        body: {
            name: 'Hola',
            intro: 'Hello',
            table: {
                data: [
                    {
                        message: 'hola amigo'
                    }
                ]
            },
            outro: 'See you next time'
        }
    }

    let mail = mailgenerator.generate(response)

    let message = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Hola amigo benja',
        html: mail,
    }

    tranporter.sendMail(message).then(()=>{
        return res.status(201).json({
            msg: "Hola de nuevo"
        })
    }).catch(error => {
        console.log(error);
        return res.status(500).json({error})
    })
}

module.exports = {
  createEmail,
  confirmEmail,
}
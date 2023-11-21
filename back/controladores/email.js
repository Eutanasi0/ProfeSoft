const nodemailer = require("nodemailer");
const mailgen = require("mailgen");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require("pg");
require('dotenv').config();

const pool = new Pool({
    user: 'postgres',
    host: process.env.HOST,
    database: 'professoft', // weben
    password: process.env.PASSWORD,
    port: 5432,
})

const createAccount = async(req, res, next) =>{
    const {usuario, email, password} = req.body;
    let pass = password;
    let hashed_pass = '';
    let salt = '';

    if(confirmDomain(email)){
        if(await usingTheDB(pass, hashed_pass, salt, usuario, email, password)){
            res.status(200).json({message: "Se ha mandado el correo"});
            next();
        } else{
            res.status(200).json({msg: "Ese correo o nombre ya existe"});
        }
    } else {
        res.status(200).json({message: "Ese no es un correo institucional..."})
    }
}

async function usingTheDB(pass, hashed_pass, salt, usuario, email){
    const client = await pool.connect();
    try {
        salt = await bcrypt.genSalt(10);
        hashed_pass = await bcrypt.hash(pass, salt);
        const query_find_users_by_name = {
            text: 'SELECT * FROM public."users" WHERE email = $1 OR name = $2',
            values: [email, usuario],
        };
        const flag = await client.query(query_find_users_by_name);
        console.log(flag.rowCount);
        if(flag.rowCount > 0){
            console.log("El nombre de usuario o el correo ya está registrado");
            return null;
        } else{
            const query_user = {
                text: 'INSERT INTO public."users"(name, email, hashed_pass, salt) VALUES($1, $2, $3, $4)',
                values: [usuario, email, hashed_pass, salt],
            }
            await client.query(query_user);
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        client.release();
    }
};

function confirmDomain(email){
    const myDomain = "@unmsm.edu.pe";
    return email.endsWith(myDomain);
}

const confirmEmail = async(req, res)=>{
    const {usuario, email, password} = req.body;
    const client = await pool.connect()
    let date = new Date();
    let mail1 = {
                "id": usuario.id,
                "created": date.toString()
                }
    const token_mail_verification = jwt.sign(mail1, process.env.jwt_secret_mail, { expiresIn: '1d' });

    try {
        const query_find_users_by_name = {
            text: 'UPDATE public."users" SET token_auth = $1 WHERE name = $2',
            values: [token_mail_verification, usuario],
        };
        await client.query(query_find_users_by_name);
    } catch (error) {
        console.log(error);
    } finally{
        client.release();
    }

    let url = process.env.baseUrl + "verify?id=" + token_mail_verification + "&username=" + usuario;

    let configuration = {
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASS,
        }
    }

    let tranporter = nodemailer.createTransport(configuration);

    let mailgenerator = new mailgen({
        theme: 'default',
        product: {
            name: "FISIBOT",
            link: `${process.env.baseUrl}files/main.html`
        }
    })

    let response = {
        body: {
            name: usuario,
            intro: 'Hola, soy FisiBot, el Bot de ProfesSoft',
            table: {
                data: [
                    {
                        message: 'Se ha creado una cuenta en ProsSoft con tu cuenta gmail, confirma aquí si eres tú: ' + url
                    }
                ]
            },
            outro: 'Nos vemos pronto'
        }
    }

    let mail = mailgenerator.generate(response)

    let message = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Bienvenido a ProfesSoft',
        html: mail,
    }

    tranporter.sendMail(message).then(()=>{
        return res.status(201).json({
            msg: "Se logró enviar el correo"
        })
    }).catch(error => {
        console.log(error);
        return res.status(500).json({error})
    })
}

const verifyEmail = async(req, res)=>{
    token = req.query.id;
    user = req.query.username;
    const client = await pool.connect();
    try {
        const query_find_token_by_name ={
            text: 'SELECT token_auth FROM public."users" WHERE name = $1',
            values: [user],
        }
        const token_db = await client.query(query_find_token_by_name);
        jwt.verify(token, process.env.jwt_secret_mail, async(e, decoded) => {
            if (e) {
                console.log(e)
                return res.sendStatus(403)
            } else {
                if(token_db.rows[0].token_auth === token){
                    try{
                        let activate = true;
                        let auth = null;
                        const query_update_state = {
                            text: 'UPDATE public."users" SET token_auth = $1, activate = $2 WHERE name = $3',
                            values: [auth, activate, user],
                        };
                        try {
                            let prueba = await client.query(query_update_state);
                            console.log(prueba);
                        } catch (error) {
                            console.log(error);
                        }
                    } catch(error){
                        console.log(error);
                    }
                    return res.status(200).json({message: "Correo confirmado"})
                } else {
                    return res.status(403).json({message: "Los tokens no coinciden"})
                }
            }
        });
    } catch (error) {
        console.log(error);
        res.status(403).json({message: "That token doesn't exist"})
    } finally {
        client.release();
    }

}

module.exports = {
  confirmEmail,
  createAccount,
  verifyEmail,
}
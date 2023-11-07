// Este file es para agregar cuentas en la base de datos
const { Client } = require("pg");
require('dotenv').config();
const bcrypt = require('bcryptjs');

const client = new Client({
    user: 'postgres',
    host: process.env.HOST,
    database: 'professoft', // weben
    password: process.env.PASSWORD,
    port: 5432,
});

// Pon la contraseña en pass
let pass = '123';
let hashed_pass = '';
let salt = '';
let email = 'benja@hotmail.com';

(async () => {
    try {
        await client.connect();
        // hashed_pass = await bcrypt.hash(pass, 10);
        // console.log(hashed_pass);
        salt = await bcrypt.genSalt(10);
        hashed_pass = await bcrypt.hash(pass, salt);
        const query_user = {
            text: 'INSERT INTO public."users"(name, email, hashed_pass, salt) VALUES($1, $2, $3, $4)',
            values: ['admin', email, hashed_pass, salt],
        }
        await client.query(query_user);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.end();
    }
})();


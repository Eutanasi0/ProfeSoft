const { Client } = require("pg");
const fs = require('fs');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const client = new Client({
    user: 'professoft',
    host: process.env.HOST,
    database: 'professoft', // weben
    password: process.env.PASSWORD,
    port: 5432,
});

const imageBuffer = fs.readFileSync('./front/img/yudi.jpeg');

(async () => {
    try {
        await client.connect();
        const query_user = {
            text: 'UPDATE public."teachers" SET img = $1 WHERE id = $2;',
            values: [imageBuffer, 15],
        }
        await client.query(query_user);
        console.log('Todo bien')
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.end();
    }
})();

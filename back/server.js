// Importaciones
const express = require('express');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const pg = require('pg');
const app = express();
require('dotenv').config();

app.use(express.static('front'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
const PORT = process.env.PORT || 3000;

// Permite todos las peticiones CORS
app.use((req, res, next) => {
    try {
        res.header('Access-Control-Allow-Origin', '*'); // Cambiar esta dirección de ser necesario
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        next();
    } catch (error) {
        // Log the error to the console
        console.error('Error occurred in CORS middleware:', error);
        // Pass the error to the Express.js error handling middleware
        next(error);
    }
  });

// Cookies
const pgPool = new pg.Pool({
    user: 'professoft',
    host: process.env.HOST,
    database: 'professoft',
    password: process.env.PASSWORD,
    port: 5432,
  });

  pgStoreConfig = {
    pgPool: pgPool,
  };

    app.use(session({
        store: new pgSession({
        pool : pgPool,
        tableName : 'user_sessions'
      }),
      secret: process.env.jwt_secret_mail,
      resave: false,
      cookie: { maxAge: 60*60*1000 },
      saveUninitialized: false,
      secure: true,
  }));


// Rutas
app.use(require("./rutas/login"));
app.use(require("./rutas/teachers"));
app.use(require("./rutas/comment"));

app.listen(PORT, () =>{
    console.log(`La aplicación está corriendo en el puerto ${PORT}`);
})

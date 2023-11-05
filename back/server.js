// Importaciones
const express = require('express');
const path = require('path');
const app = express();

// Brinda el html
// app.use(express.static('front/styles'))
// app.use(express.static('front/img'))
// app.use(express.static('front/scripts'))
app.use('/front',express.static('./front'));
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

app.use(function(req, res) {
    res.status(400);
    return res.send('404 Error: Resource not found');
  });

// Rutas
app.use(require("./rutas/login"));

app.listen(PORT, () =>{
    console.log(`La aplicación está corriendo en el puerto ${PORT}`);
})

const {Router} = require('express');
const router = Router();

// Controladores
const { getComments, createComment } = require('../controladores/commentscontroller');
const { auth } = require('../controladores/logincontroller');

// Rutas
router.get("/getComments", getComments);
router.post("/createComment", auth, createComment);

module.exports = router;
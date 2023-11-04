const { Router } = require("express");
const router = Router();

//Controladores
const { verifyLogin } = require("../controladores/logincontroller");
//Login
router.post("/login", verifyLogin);

module.exports = router
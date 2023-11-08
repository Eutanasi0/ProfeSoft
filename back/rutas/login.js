const { Router } = require("express");
const router = Router();

//Controladores
const { verifyLogin } = require("../controladores/logincontroller");
const { createEmail, confirmEmail } = require("../controladores/email");
//Login
router.post("/login", verifyLogin);
// router.post("/register", createEmail);
router.post("/register", confirmEmail);

module.exports = router
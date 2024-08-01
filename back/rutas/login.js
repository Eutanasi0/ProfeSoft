const { Router } = require("express");
const router = Router();

//Controladores
const { verifyLogin } = require("../controladores/logincontroller");
const { createAccount, confirmEmail, verifyEmail } = require("../controladores/email");
//Login
router.get("/", async (req, res) =>{
    res.redirect('/files/main.html');
})
router.post("/login", verifyLogin);
router.post("/register",createAccount ,confirmEmail);
router.get("/verify", verifyEmail);

module.exports = router
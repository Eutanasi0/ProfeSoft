const { Router } = require("express");
const router = Router();

// Controladores
const { getTeacher } = require("../controladores/teacherscontroller");
const { authCookies } = require("../controladores/authCooky");

// Ruta
router.get("/teacher", getTeacher);

module.exports = router
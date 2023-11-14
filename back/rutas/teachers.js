const { Router } = require("express");
const router = Router();

// Controladores
const { getTeacher } = require("../controladores/teacherscontroller");

// Ruta
router.get("/teacher", getTeacher);

module.exports = router
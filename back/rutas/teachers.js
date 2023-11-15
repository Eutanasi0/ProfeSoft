const { Router } = require("express");
const router = Router();

// Controladores
const { getTeacher, getAllTeachers } = require("../controladores/teacherscontroller");
const { authCookies } = require("../controladores/authCooky");

// Ruta
router.get("/teacher", getTeacher);
router.get("/everything", getAllTeachers);

module.exports = router
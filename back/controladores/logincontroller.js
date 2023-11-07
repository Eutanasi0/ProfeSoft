const verifyLogin = async(req, res) => {
    console.log(req.body)
    try{
        const {user, password} = req.body;
        console.log(user, password);
        res.set({
            'Content-Type': 'application/json',
        });
        res.status(200).json({
            user: user,
            pass: password,
        })
    } catch (error) {
        console.error('Error al manejar la solicitud:', error);
        res.status(500).json({ message: "Error en el servidor" });
    }
}

module.exports = {
    verifyLogin,
}
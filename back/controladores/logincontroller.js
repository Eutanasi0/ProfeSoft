const verifyLogin = async(req, res) => {
    const {username, password} = req.body;
    console.log(username, password);

    try{
        res.status(200).json({
            user: username,
            pass: password,
        })
    } catch {
        res.status(401).json({message: 'hola'});
    }
}

module.exports = {
    verifyLogin,
}
const authCookies = async(req, res, next) => {
    if(req.session.isAuth){
        next();
    } else {
        res.redirect("/files/login.html");
    }
}

module.exports = {
    authCookies,
}
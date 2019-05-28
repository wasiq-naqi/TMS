module.exports = (req, res, next) => {
    if(req.session.UserID){
        return res.redirect('/');
        console.log(req.session);
    }
    next();
}
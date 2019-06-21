module.exports = (req, res, next) => {
    if(!req.session.UserID){
        return res.redirect('/login');
    }
    next();
}
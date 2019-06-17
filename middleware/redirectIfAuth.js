module.exports = (req, res, next) => {
    if(req.session.UserID){
        // console.log(req.session);
        return res.redirect('/');
    }
    next();
}
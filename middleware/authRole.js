module.exports = (req, res, next) => {
    // console.log(req.session.UserRole);
    if(req.session.UserRole != 'Admin'){
        return res.redirect('/task');
    }
    next();
}
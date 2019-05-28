const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { User } = require('../models/User');
const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended : true }));

router.get('/', (req, res) => {
    let data = {
        "pageTitle" : "Login",
        "pageType" : "login"
    }; 
    res.render('./pages/login', data);
});

router.post('/', (req, res) => {
    let login_email = req.body.login_email;
    let login_password = req.body.login_password;
    User.findOne({email: login_email})
    .then((user) => {
        bcrypt.compare(login_password, user.password, (error, same) => {
            if(same){
                // console.log("Same");
                req.session.UserID = user._id;
                req.session.UserRole = user.role;
                req.session.UserName = user.name;
                res.redirect('/');
            }else{
                // console.log(login_email);
                let data = {
                    "pageTitle" : "Login",
                    "pageType" : "login",
                    "user_email": login_email
                }; 
                res.render('./pages/login', data);
            }
        })
        
    })
    .catch((err) => {
        let data = {
            "pageTitle" : "Login",
            "pageType" : "login",
            "user_email": login_email
        }; 
        res.render('./pages/login', data);
    })
    // console.log(req.body);
    // res.redirect('/login');
});

module.exports = router;
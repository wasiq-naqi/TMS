const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const wnModules = require('../modules/wn');
const { User, userOwner } = require('../models/User');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended : true }));

router.get('/', (req, res) => {
    
    async function getUsers(){
        let users = await User.find()
        .sort({ _id: -1});
        // console.log(users);

        let data = {
            "pageTitle" : "Users",
            "pageType" : "list",
            "records" : users,
            "session" : req.session
        };
        res.render('pages/user', data);
    } 
    getUsers();
});

router.get('/add', (req, res) => {
    let data = {
        "pageTitle" : "Add User",
        "pageType" : "add",
        "session" : req.session
    };
    res.render('./pages/user', data);
});
router.get('/edit/:id', (req, res) => {
    async function getUser(){
        const user = await User.findById(req.params.id)
        .catch((err) =>{
            // console.log(err);
        })

        if(!user){
            res.redirect('/users/');
        }else{
            // console.log(user);
            let data = {
                "pageTitle" : "Edit User",
                "pageType" : "edit",
                "pageUser" : user,
                "session" : req.session
            };
            res.render('./pages/user', data);
        }
    }
    getUser();
});
router.post('/edit/:id', (req, res) => {
    async function updateUser(){
        // console.log('ID :',req.body.user_id);
        const user = await User.findById(req.body.user_id)
        .catch((err) =>{
            // console.log(err);
        })

        // console.log(user);
        if(!user){
            // console.log('User not found');
            res.render('./pages/404');
        }else{

            user.name = req.body.user_name;
            user.email = req.body.user_email;
            user.role = req.body.user_role;
            
            user.save()
            .then((result) => {
                // console.log('User Updated' );
                let data = {
                    "pageTitle" : "Edit User",
                    "pageType" : "edit",
                    "pageNotification" : { type : "success", message : "User updated successfully."},
                    "pageUser" : user,
                    "errors" : "",
                    "session" : req.session
                };
                res.render('./pages/user', data);
            })
            .catch((err) => {
                const cusError = {};
                if (err.errors) {
                const keys = Object.keys(err.errors);
                keys.forEach((key) => {
                    let message = err.errors[key].message;
                    message = message.replace('Path ', '').replace('`'+key+'`', key.charAt(0).toUpperCase() + key.substring(1)).trim();
                    cusError[key] = message;
                });
                }else{
                    if(typeof err.code != 'undefined'){
                        cusError['errCode'] = err.code;
                    }
                }
                // console.log(cusError);
                let data = {
                    "pageTitle" : "Edit User",
                    "pageType" : "edit",
                    "pageNotification" : { type : "error", message : "failed to add user."},
                    "pageUser" : user,
                    "errors" : cusError,
                    "session" : req.session
                };
                res.render('./pages/user', data);
            })
            // console.log(result);

            
        }
    }
    updateUser();
});

router.post('/add' , (req, res, err) => {
    // console.log(req.body);
    // console.log(err);
    async function saveUser(){
        let hashed = ''
        if(req.body.user_password != ''){
            let salt = await bcrypt.genSalt(10);
            hashed = await bcrypt.hash(req.body.user_password, salt);
        }
    
    let user = new User ({
        name : req.body.user_name,
        email : req.body.user_email,
        password : hashed,
        role : req.body.user_role,
        createdBy : new userOwner({
            ownerID : req.session.UserID,
            ownerName : req.session.UserName 
        })
    });

    user.save()
        .then((result) => {

            wnModules.sendMail(req.body);

            let data = {
                "pageTitle" : "Add User",
                "pageType" : "add",
                "pageNotification" : { type : "success", message : "User added successfully."},
                "pageUser" : user,
                "errors" : "",
                "session" : req.session
            };
            res.render('./pages/user', data);
        })
        .catch((err) => {
            // console.log(error);
            const cusError = {};
            if (err.errors) {
            const keys = Object.keys(err.errors);
            keys.forEach((key) => {
                let message = err.errors[key].message;
                // message = message.replace('Path ', '').replace('`'+key+'`', key.charAt(0).toUpperCase() + key.substring(1)).trim();
                cusError[key] = message;
            });
            }else{
                if(typeof err.code != 'undefined'){
                    cusError['errCode'] = err.code;
                }
            }

            console.log(err);
            // console.log(cusError); 
            let data = {
                "pageTitle" : "Add User",
                "pageType" : "add",
                "pageNotification" : { type : "error", message : "User not added."},
                "pageUser" : user,
                "errors" : cusError,
                "session" : req.session
            };
            res.render('./pages/user', data);
        });

    }
    saveUser();
    // let result = createUser(user);
    // createUser(user, (result) => {
    //     console.log(result);
    //     res.redirect('/');
        // if(typeof result._id != undefined){
        //     let data = {
        //         "pageTitle" : "Add User",
        //         "pageType" : "add",
        //         "pageNotification" : { type : "success", message : "User added successfully."}
        //     };
        //     res.render('./pages/user', data);
        // }else{
        //     let data = {
        //         "pageTitle" : "Add User",
        //         "pageType" : "add",
        //         "pageNotification" : { type : "error", message : "User not added."},
        //         "pageUser" : user
        //     };
        //     res.render('./pages/user', data);
        // }
    // });
    
    // console.log(result);
    // res.redirect('/user/add');
});
router.post('/password', (req, res) => {
    async function updatePassword(){
    
    let hashed = '';
    let salt = await bcrypt.genSalt(10);
    hashed = await bcrypt.hash(req.body.val, salt);
        
    const user = await User.findById({ _id : req.session.UserID});
    if(!user){
        res.send(false);
    }else{
        user.password = hashed;
        user.save()
        .then((result) => {
            res.send(true);
        })
        .catch((err) => {
            res.send(false);
        })
    }
    
    }
    updatePassword();
});

router.delete('/delete', (req, res) => {
    let id = req.body.id;
    User.deleteOne({ _id : id})
    .then((result) =>{
        res.send(true);
    })
    .catch((err) => {
        res.send(false);
    })
});

module.exports = router;
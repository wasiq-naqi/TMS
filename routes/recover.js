const express = require('express');
const bodyParser = require('body-parser');
const randomstring = require('randomstring');
const bcrypt = require('bcrypt');
const { User } = require('../models/User');
const wn = require('../modules/wn');
const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended : true }));

router.get('/', (req, res) => {
    let data = {
        "pageTitle" : "Recover Password",
        "pageType" : "recover"
    }; 
    res.render('./pages/recover', data);
});

router.post('/', (req, res) => {
    var user_email = req.body.user_email;
    
    if(user_email != ''){
        // console.log(user_email);
        User.findOne({email : user_email})
        .then((result) => {

            // var buff = Buffer.alloc(user_email);
            var encodedEmail = Buffer.from(user_email).toString('base64');
            var code = randomstring.generate(20);
            var date = new Date();
            var timestamp = date.getTime();
            // var timeBuff = new Buffer(timestamp);
            // var encodedTime = Buffer.from(timestamp).toString('base64');
            result.forget_password_code = code;

            result.save()
            .then((result_1) => {
                var user = {
                    user_email : user_email,
                    encoded_email : encodedEmail,
                    recovery_code : code,
                    // recovery_time : encodedTime,
                    recovery_time : timestamp
                };
                wn.recoverPasswordMail(user);
                var response = {
                    status : 200,
                    data : {
                        message : "Recovery link is send to your Email"
                    }
                }
                res.status(200).send(response);
                console.log(response);
            })
            .catch((error_1) => {
                var response = {
                    status : 400,
                    data : {
                        message : "Failed to generate link"
                    }
                }
                res.status(400).send(response);
                // console.log(error_1);
            })

        })
        .catch((error) => {
            var response = {
                status : 400,
                data : {
                    message : "Email not found"
                }
            }
            res.status(400).send(response);
            console.log(response);
        })
        
    }

});

router.get('/validate/:email/:time/:code', (req, res) => {
    if(!req.params.time || req.params.time.length === 0){
        //Link Broken
        // console.log("Link Broken No Time");
        let data = {
            "pageTitle" : "Page Not Found",
            "pageType" : "400",
            "message" : "Failed due to token mismatch."
        }; 
        res.status(404).render('./pages/404', data);
    }else{
        var requestTime = req.params.time;
        var date = new Date();
        var currentTime = date.getTime();
        var difference = Math.abs(requestTime - currentTime);
        var hours = Math.floor((difference / 1000) / 3600);
        // console.log(hours);
        if(!Number.isInteger(hours) || hours > 24){
            //Link Expires
            // console.log("Link Expires");
            let data = {
                "pageTitle" : "Page Not Found",
                "pageType" : "400",
                "message" : "Failed due to token expires."
            }; 
            res.status(404).render('./pages/404', data);
        }else{
            if(!req.params.email || req.params.email.length === 0){
                //Link Broken
                // console.log("Link Broken no email");
                let data = {
                    "pageTitle" : "Page Not Found",
                    "pageType" : "400",
                    "message" : "Failed due to token mismatch."
                }; 
                res.status(404).render('./pages/404', data);
            }else{
                var email = Buffer.from(req.params.email, 'base64').toString('ascii');
                User.findOne({email : email})
                .then((result) => {
                    // console.log(result);

                    var orignal_code = result.forget_password_code;
                    if(orignal_code != "false"){
                        var received_code = req.params.code;
                        if(orignal_code == received_code){
                            //Change Password Here
                            // console.log("Token matched");
                            let data = {
                                "pageTitle" : "Change password",
                                "pageType" : "new",
                                "link" : req.params.email,
                                "token" : orignal_code
                            }; 
                            res.render('./pages/recover', data);
                        }else{
                            //Link Broken
                            // console.log("Link Broken code mismatch");
                            let data = {
                                "pageTitle" : "Page Not Found",
                                "pageType" : "400",
                                "message" : "Failed due to token mismatch."
                            }; 
                            res.status(404).render('./pages/404', data);
                        }
                    }else{
                        let data = {
                            "pageTitle" : "Page Not Found",
                            "pageType" : "400",
                            "message" : "Failed due to token expires."
                        }; 
                        res.status(404).render('./pages/404', data);
                    }
                    

                })
                .catch((error) => {
                    // No user find
                    // console.log("Link Broken no user find");
                    let data = {
                        "pageTitle" : "Page Not Found",
                        "pageType" : "400",
                        "message" : "Failed due to token mismatch."
                    }; 
                    res.status(404).render('./pages/404', data);
                })
            }
        }
    }
    
})

router.post('/verify', (req, res) => {
    // console.log(req.body);
    var link = req.body.link;
    var received_token = req.body.token;
    var pass_1 = req.body.change_pass_1;
    var pass_2 = req.body.change_pass_2;

    if(pass_1 != '' || pass_2 != '' || pass_1 == pass_2 || link == '' || received_token == ''){
        var email = Buffer.from(link, 'base64').toString('ascii');
        // console.log(email);
        User.findOne({email : email})
        .then((result) => {
            var orignal_token = result.forget_password_code;
            if(received_token == orignal_token){
                async function setNewPassword(){
                    let salt = await bcrypt.genSalt(10);
                    hashed = await bcrypt.hash(pass_1, salt);

                    result.password = hashed;
                    result.forget_password_code = false;
                    result.save()
                    .then((result_2) => {
                        res.redirect('/login?role=password_changed');
                    })
                    .catch((error_2) => {
                        let data = {
                            "pageTitle" : "Page Not Found",
                            "pageType" : "400",
                            "message" : "Failed due to token mismatch."
                        }; 
                        res.status(404).render('./pages/404', data);
                    })
                }
                setNewPassword();
            }else{
                let data = {
                    "pageTitle" : "Page Not Found",
                    "pageType" : "400",
                    "message" : "Failed due to token mismatch."
                }; 
                res.status(404).render('./pages/404', data);
            }
        })
        .catch((error) =>{
            let data = {
                "pageTitle" : "Page Not Found",
                "pageType" : "400",
                "message" : "Failed due to token mismatch."
            }; 
            res.status(404).render('./pages/404', data);
        })
    }else{
        //Failed
        let data = {
            "pageTitle" : "Page Not Found",
            "pageType" : "400",
            "message" : "Failed due to token mismatch."
        }; 
        res.status(404).render('./pages/404', data);
    }
})
module.exports = router;
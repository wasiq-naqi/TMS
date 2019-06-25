//Dependencies
const nodemailer = require("nodemailer");
const DOMAIN = "localhost";
const HOST = "smtp.gmail.com";
const EMAIL = "wasiqnaqi@gmail.com";
const PASSWORD = "V1i4r6u2s8s";
const PORT = '587';

function sendMail(receiver){

    let mail = `
    <div class="container" style="background-color: #EEEEEE;padding:20px 0;"><div class="row" style="background-color: #fff;margin:0px 10%;padding:10px 20px;"><div class="col-md-offset-2 col-lg-offset-2 col-sm-offset-2 col-md-8 col-lg-8 col-sm-8">
    <br><a href="http://onstak.com/"><img src="http://onstak.com/wp-content/uploads/2017/07/Picture1.png" class="img-responsive" style="max-width: 200px;width: 30%;"></a>
    <center><h4 style="padding: 3px 0;background-color: #1779ba;color:#fff">Registered Successfully</h4></center>
    <h4 class="">Hi ${receiver.user_name},</h4>
    <p>You account has been successfully created on Onstak portal.<br>Please login with below credentials.</p>

    <h4 class="text-primary">Credentials</h4>
    <p><b>Email : </b>${receiver.user_email}</p>
    <p><b>Password : </b>${receiver.user_password}</p>
    <p style="margin-bottom:40px;">Use your credentials to update your password to secure your account.</p>


    <center><a href="${DOMAIN}" class="btn btn-primary" style="padding: 10px 20px;margin: 20px 0;margin:20px 0;background-color: #1779ba;color: #fff;text-decoration: none;">Login to your account</a></center>
    <p style="margin-top:40px;"><b>Notice :</b><br>This email is auto generated, do not reply. Information in this email is intented for the respected person only. In case of any query email to <a href="mailto:${EMAIL}">${EMAIL}</a> </p>
    <hr><p class="small"><small>Onstak Inc.<br>1st Floor, 39-A, XX Block, DHA, Lahore, Pakistan<br>Ph: +92 42 3569 3960, +92 317 5123888</small></p>
    </div></div></div>
    `;

        // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
    host: HOST,
    port: PORT,
    secure: false, // true for 465, false for other ports
    auth: {
    user: EMAIL, // generated ethereal user
    pass: PASSWORD // generated ethereal password
    },
    tls:{
        rejectUnauthorized : false
    }
});

let mailOptions = {
    from: '"Onstak" <' + EMAIL + '>', // sender address
    to: receiver.user_email, // list of receivers
    subject: "Account created", // Subject line
    text: "Hello world?", // plain text body
    html: mail // html body
};

transporter.sendMail(mailOptions, (emailError, info) => {
    if(emailError){
        console.log(emailError);
    }else{
        // console.log(info);
    }
});

}
function recoverPasswordMail(receiver){

    let mail = `
    <div class="container" style="background-color: #EEEEEE;padding:20px 0;"><div class="row" style="background-color: #fff;margin:0px 10%;padding:10px 20px;"><div class="col-md-offset-2 col-lg-offset-2 col-sm-offset-2 col-md-8 col-lg-8 col-sm-8">
    <br><a href="http://onstak.com/"><img src="http://onstak.com/wp-content/uploads/2017/07/Picture1.png" class="img-responsive" style="max-width: 200px;width: 30%;"></a>
    <center><h4 style="padding: 3px 0;background-color: #1779ba;color:#fff">Reset Password</h4></center>
    <h4 class="">Hello,</h4>
    <p>A request to reset your account password was received. Click the button to reset your password and signin to your account. This link is valid for 24 hours.</p>
    <br>
    <center><a href="${DOMAIN + '/recover/validate/' + receiver.encoded_email + '/'+ receiver.recovery_time + '/' + receiver.recovery_code}" class="btn btn-primary" style="padding: 10px 20px;margin: 20px 0;margin:20px 0;background-color: #1779ba;color: #fff;text-decoration: none;">RESET YOUR PASSWORD</a></center>
    <br><br>
    <center>Or copy paste below link in your browser.</center>
    <center>${DOMAIN + '/recover/validate/' + receiver.encoded_email + '/'+ receiver.recovery_time + '/' + receiver.recovery_code}</center>
    <br>
    <p>Please chose a strong password for you account and keep it secure.</p>
    <p>You can safely disregard this email if you did't request a password reset and your password will not be changed.</p>
    <br>
    <p>Thanks.</p>
    <br>
    <p style="margin-top:40px;"><b>Notice :</b><br>This email is auto generated, do not reply. Information in this email is intented for the respected person only. In case of any query email to <a href="mailto:${EMAIL}">${EMAIL}</a> </p>
    <hr><p class="small"><small>Onstak Inc.<br>1st Floor, 39-A, XX Block, DHA, Lahore, Pakistan<br>Ph: +92 42 3569 3960, +92 317 5123888</small></p>
    </div></div></div>
    `;

        // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
    host: HOST,
    port: PORT,
    secure: false, // true for 465, false for other ports
    auth: {
    user: EMAIL, // generated ethereal user
    pass: PASSWORD // generated ethereal password
    },
    tls:{
        rejectUnauthorized : false
    }
});

let mailOptions = {
    from: '"Onstak" <' + EMAIL + '>', // sender address
    to: receiver.user_email, // list of receivers
    subject: "Reset Password", // Subject line
    text: "Hello world?", // plain text body
    html: mail // html body
};

transporter.sendMail(mailOptions, (emailError, info) => {
    if(emailError){
        console.log(emailError);
    }else{
        // console.log(info);
    }
});

}

module.exports.sendMail = sendMail;
module.exports.recoverPasswordMail = recoverPasswordMail;
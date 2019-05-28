const bcrypt = require('bcrypt');

function wn_function(){
    async function crypt(str){
        let salt = await bcrypt.genSalt(10);
        let hashed = await bcrypt.hash(str, salt);
        return hashed;
    }
}

// let obj = wn_function();
module.exports.wn = wn_function;
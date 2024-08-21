'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');

const SECRET = require('../config').secret;
const EXP_TIME = require('../config').tokenExpTmp;

//creaToken
//
//Devuelve un token tipo JWT
//formato JWT:
//      HEADER.PAYLOAD.VERIFY_SIGNATURE
//
//Donde:
//      HEADER

      /*{
          "alg": "HS256",
          "typ": "JWT"
      }*/

//      PAYOAD

    /*{
        "sub": "1234567890",
        "name": "John Doe",
        "iat": 1516239022
    }*/

//      VERIFY SIGNATURE
    /*{
         VERIFU_SIGNATURE = HMACSHA256 (base64UrlEncode(HEAD)+"."+base64UrlEncode(PAYLOAD), SECRET)        
    }*/


function creaToken (user){
    const payload = {
        sub:user._id,
        int: moment().unix(),
        exp: moment().add(EXP_TIME,'minutes').unix()
    };
    return jwt.encode(payload, SECRET);
}

//decodificaToken
//
//devuelve el identificador del usuairo
//

function decodificaToken (token){
    return new Promise((resolve, reject) => {

        try{
            const payload = jwt.decode(token, SECRET, true)  //al poner true no verifica caducidad y nos deja hacerlo nosotros
            console.log(payload)
 
            if (payload.exp <= moment().unix()){

                reject({
                    status: 401,
                    message: 'El token ha caducado'
                });
            }
            resolve(payload.sub);
        }
        catch{
            reject({
                status: 500,
                message: 'El token no es valido'
            });
        }
    });
}

module.exports = {
    creaToken,
    decodificaToken
};
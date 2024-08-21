'use strict'

const bcrypt = require('bcrypt');

//encriptaPassword
//
// Devuelve un hash con salt incluido en formato:
//      $2b$10$UnViHRe56Hc6LYzWwkCmweUX8OwwjCI8V5LWZORFfLKzC5FqacEWm
//      ****-- **********************+++++++++++++++++++++++++++++++
//      alg cost         salt                    hash
//
function encriptaPassword(password){
    return bcrypt.hash(password,10);
}

//comparaPassword
//
//Devuelve verdadero o falso si coincide o no el pass y hash
//
function comparaPassword(password, hash){
    return bcrypt.compare(password,hash);
}

module.exports = {
    encriptaPassword,
    comparaPassword
};
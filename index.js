'use strict'

const port = process.env.PORT || 4000;

const fs = require('fs');
const https = require('https');

const OPTIONS_HTTPS ={
    key: fs.readFileSync('./cert/key.pem'),
    cert: fs.readFileSync('./cert/cert.pem')
};

const TokenService = require('./services/token.service');
const passService = require('./services/pass.service');


const express = require('express');
const logger = require('morgan');
const mongojs = require('mongojs');
const cors = require('cors');
const helmet = require('helmet');
const moment = require('moment');

const app = express();

var db = mongojs("mongodb+srv://abel:abel@sd.u5nbx.mongodb.net/myFirstDatabase?retryWrites=true&w=majoritySD"); // Enlazamos con la DB "SD"
var id = mongojs.ObjectID; // Función para convertir un id textual en un objectID


// Declaraciones
var allowCrossTokenHeader = (req, res, next) => {
 res.header("Access-Control-Allow-Headers", "*");
return next();
};
var allowCrossTokenOrigin = (req, res, next) => {
 res.header("Access-Control-Allow-Origin", "*");
return next();
};

var auth = (req, res, next) => {

    const jwt = req.headers.authorization.split(' ')[1];

    TokenService.decodificaToken(jwt).then((userID) =>{

        req.user = {id:userID};
        return next();

    }).catch(err => res.status(400).json({result: 'KO', message: err}));
};

app.use(logger('dev')); // probar con: tiny, short, dev, common, combined
app.use(express.urlencoded({extended: false})) // parse application/x-www-form-urlencoded
app.use(express.json()) // parse application/json
app.use(cors());
app.use(allowCrossTokenHeader);
app.use(allowCrossTokenOrigin);
app.use(helmet()); 

//USER

//Declaramos nuestras rutas user, controladores y logica de negocio (patron mvc)
app.get('/api/user', auth , (req,res) => {

    db.user.find((err, coleccion) => {

        if (err){
            res.json(err);
        }
        else{
            res.json(coleccion); 
        }
        
    });
});

app.get('/api/user/:id', auth , (req,res) => {
    db.user.findOne({_id: id(req.params.id)}, (err, elemento) => {

        if (err){
            res.json(err);
        }
        else{
            res.json(elemento);
        }
        
    });
});

//no tiene que llevar auth ya que se esta registrando un usuario
app.post('/api/user', (req,res)=> {
    const elemento= req.body;
    
    if (!elemento.name) {
        res.status(400).json ({
            error: 'Bad data',
            description: 'Se precisa al menos un campo <name>'
        });
    } 

    else if (!elemento.email) {
        res.status(400).json ({
            error: 'Bad data',
            description: 'Se precisa al menos un campo <email>'
        });
    } 

    //todos los datos se han introducido
    else {

        //comprobamos la existencia del email en la base de datos
        db.user.findOne({email:elemento.email},(err, usuario)=>{
        
            if (err){
                res.json(err);
            }

            else{

                //el email existe
                if(usuario){
                    res.status(400).json({
                        error: "El usuario existe"
                    });
                }

                //el email no existe
                else{

                    //creamos usuario
                    elemento.signupDate=moment().unix();
                    elemento.lastLogin=moment().unix();

                    //guardamos todos los datos del usuario menos el token
                    db.user.save(elemento, (err, coleccionGuardada) => {

                        if (err){
                            res.json(err);
                        }
                        else{
                            
                            res.json({
                                result: 'OK',
                                token: TokenService.creaToken(coleccionGuardada),
                                usuario: 
                                    coleccionGuardada
                            });
                        }
                    });
                }
            }
        });  
    } 
});
//modificamos informacion de un usuario
app.put('/api/user/:id' ,auth, (req, res) => {
    let elementoId = req.params.id;
    let elementoNuevo = req.body;

    //en el caso de mandar un email no se puede modificar nada
    if(elementoNuevo.email){
        res.status(400).json({
            error: 'no se puede modificar el email'
        });
    }
    //se puede modificar
    else{
        db.user.update({_id: id(elementoId)}, {$set: elementoNuevo}, {safe: true, multi: false}, (err, result) => {

            if (err){
                res.json(err);
            }
            else{
                res.json(result);
            }
            
        });
    }
});

//eliminamos un usuario
app.delete('/api/user/:id' ,auth, (req, res) => {
    let elementoId = req.params.id;

    db.user.remove({_id: id(elementoId)}, (err, resultado) => {

        if (err){
            res.json(err);
        }
        else{
            res.json(resultado);
        }
        
    });
});

//AUTH

//Declaramos nuestras rutas para auth, controladores y logica de negocio (patron mvc)
app.get('/api/auth', auth  ,(req,res) => {

    //muestro solo el email, nombre y el id lo muestra por defecto
    db.user.find({},{email:1,name:1,_id:0},(err, coleccion) => {

        if (err){
            res.json(err);
        }
        else{
            res.json(coleccion); 
        } 
    });
});

app.get('/api/auth/me', auth , (req,res) => {

    console.log(req.user.id);
        
    db.user.findOne({_id: id(req.user.id)}, (error, elemento) => {

        if (error){
            res.json(err);
        }
        else{
            res.json(elemento);
        }
    });
});

app.post('/api/auth', (req,res)=> {
    const usuario= req.body;
    
    //comprobamos que el campo name no tiene email
    if (!usuario.email){
        res.status(400).json ({
            error: 'Bad data',
            description: 'Se precisa al menos un campo <email>'
        });
    }
    //comprobamos que el campo name no tiene pass
    else if (!usuario.password){
        res.status(400).json ({
            error: 'Bad data',
            description: 'Se precisa al menos un campo <pass>'
        });
    }

    //Todos los campos estan insertados
    else {
        signIn(usuario,res);
    }
});

//No hace falt usar auth ya que se esta registrando el usuario
app.post('/api/reg', (req,res)=> {
    const elemento= req.body;
    //comprobar si algun campo ha quedado sin contestar
    if (!elemento.name) {
        res.status(400).json ({
            error: 'Bad data',
            description: 'Se precisa al menos un campo <name>'
        });
    } 

    else if (!elemento.email) {
        res.status(400).json ({
            error: 'Bad data',
            description: 'Se precisa al menos un campo <email>'
        });
    } 

    else if (!elemento.password) {
        res.status(400).json ({
            error: 'Bad data',
            description: 'Se precisa al menos un campo <password>'
        });
    } 
    else{

        db.user.findOne({email:elemento.email},(err, usuario)=>{
        
            if (err){
                res.json(err);
            }

            else{

                //el email existe
                if(usuario){
                    res.status(400).json({
                        error: "El usuario existe"
                    });
                }

                //el email no existe
                else{ 
                    signUp(elemento,res);
                }
            }
        });
    }
});


function signIn(usuario,res){
    //buscamnos que el email del usuario exista
    db.user.findOne({email: usuario.email}, (err, coleccion) =>{
        if (err) {
            res.json(err);
        }
        //hemos encontrado usuario con ese email, falta verificar password
        else{

            if(!coleccion){
                res.status(400).json({
                    error: 'el email no esta registrado'
                })
            }
            else{
                //comprobamos que es igual a la de la base de datos
                passService.comparaPassword(usuario.password,coleccion.password).then((isOk) =>{
                    
                //es la misma
                if(isOk){
                    //modificamos el lastlogin del usuario
                    coleccion.lastLogin=moment().unix();

                    db.user.update({_id: id(coleccion._id)}, {$set: coleccion}, {safe: true, multi: false}, (err, result) => {

                        if (err){
                            res.json(err);
                        }
                        else{
                            res.json({
                                result: 'OK',
                                token: TokenService.creaToken(coleccion),
                                usuario: coleccion
                            });
                        }
                    });
                }

                //es distinta
                else{
                    res.status(400).json({
                        error: `La password introducida no corresponde con la del email:${coleccion.email}`
                    });
                }
            });
            }
        }
    });
}

function signUp(usuario,res){

    //encriptamos password  
    passService.encriptaPassword(usuario.password).then((passwordEncriptada) => {
        
        const user = {
            email: usuario.email,
            name: usuario.name,
            password:  passwordEncriptada,
            signupDate: moment().unix(),
            lastLogin: moment().unix(),
        }

        //guardamos todos los datos del usuario menos el token
        db.user.save(user, (err, coleccionGuardada) => {
            if (err){

                res.json(err);
            }
            else{
                //ahora el usuario ya tiene _id en la base de datos
                res.json({
                    result: 'OK',
                    token: TokenService.creaToken(coleccionGuardada),
                    usuario: coleccionGuardada
                });
            }
        });
    });            
}

https.createServer(OPTIONS_HTTPS,app).listen(port, () => {
    console.log((` WS API REST CRUD con DB ejecutándose en https://localhost:${port}/api/user`));
});
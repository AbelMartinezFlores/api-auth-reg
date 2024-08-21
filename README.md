# Backend CRUD API REST

_Ejemplo de Servicio Web tipo RESTFull de registro, autorización y autentificación_

## Comenzando 🚀

_Estas instrucciones te permitirán obtener una copia del proyecto en funcionamiento en tu máquina local para propósitos de desarrollo y pruebas._

### Pre-requisitos 📋

_Para replicar el proyecto necesitarás una maquina con:_

- 4GB de RAM
- 25GB de almacenamiento
- 2GHz de procesador

_En mi caso he utilizado una maquina con la última versión estable de 64 bits de la distribución Ubuntu de Linux (en ese momento la 20.04.03 LTS ). [Descargar ubuntu](https://ubuntu.com/download/desktop)_

_Empezamos a instalar  herramientas que nos serán útiles o que necesitamos para el proyecto._

_Instalamos última versión estable de Node JS para Ubuntu. Tenemos que realizar los siguientes pasos:_

- Instalar el gestor de paquetes de Node (npm)
```
sudo apt update
sudo apt install npm
```

- Instalamos con npm una utilidad para instarlar y mantener las versiones de Node (denominado con n)
```
sudo npm clean -f 
sudo npm i -g n
```

- Instalamos la última versión estable de Node JS a través de la utilidad n 
```
sudo n stable
```

_Instalamos MongoDB_
```
sudo apt install -y mongodb
```

_Ahora instalamos el gestor de repositorios (git) ya que es necesario para poder clonar el repositorio (en el caso de tenerlo instalado te puedes saltar este paso). Pondremos un ejemplo con un usuario inventado_
```
sudo apt install git 
git config --global user.name pepe
git config --global user.email pepe@gmail.com
git config --list
```

## Ejecución e Instalación 🔧

_Primero clonaremos el proyecto y despues instalaremos todas sus dependencias_

- Clonamos proyecto
```
git clone https://abelmartinezfloresUA@bitbucket.org/abelmartinezfloresua/api-auth-reg.git
```

- Nos movemos a api-auth-reg
```
cd api-auth-reg
```

- Instalamos dependencias
```
npm i
```

- Ejecutamos el proyecto
```
npm start
```

- Se va a explicar como conectar con la base de datos local o mongo atlas. Nos vamos [index.js](index.js) y en esta linea:
```
var db = mongojs("mongodb+srv://abel:abel@sd.u5nbx.mongodb.net/myFirstDatabase?retryWrites=true&w=majoritySD"); // Enlazamos con la DB "SD"
```
- Colocar entre paréntesis el enlace que se consigue en la opción de "conectar tu aplicación" en mongo atlas (para conectar tu propia base de datos online) o escribir el nombre de la base de datos local creada en tu máquina.

- En el caso de querer usar la base de datos local, realizar estos pasos para iniciar base de datos local en una nueva terminal, si usas mongo atlas dirígete directamente al apartado "Ejecutando las pruebas":

```
sudo systemctl start mongodb
```

- En otra terminal iniciamos el cliente mongo para gestionar la base de datos local

```
mongo --host localhost:27017
```

## Ejecutando las pruebas ⚙️

_En este apartado se van a explicar las pruebas que tiene el sistema_

### Analice las pruebas end-to-end 🔩

_Entre todos los archivos nos encontramos con el fichero [CRUD.postman_collection.json](CRUD.postman_collection.json)_

_Los endpoints que se encuentran son del tipo: GET, POST, PUT y DELETE_

_En este repositorio hay dos tipos de endpoints:_

_Endpoints para la gestión de usuarios:_

| Verbo HTTP | Ruta | Descripción |
| ------------- | ------------- | ------------- |
| GET | /api/user  | Obtenemos todos los usuarios registrados en el sistema |
| GET  | /api/user/\{id\} | Obtenemos el usuario indicado en \{id\} |
| POST  | /api/user | Registramos un nuevo usuario con toda su información |
| PUT  | /api/user/\{id\} | Modificamos el usuario \{id\} |
| DELETE  | /api/user/\{id\} | Eliminamos el usuario \{id\} |

_Endpoints para la autorización y autentificación:_

| Verbo HTTP | Ruta | Descripción |
| ------------- | ------------- | ------------- |
| GET | /api/auth  | Obtenemos todos los usuarios registrados en el sistema. Mostramos versión reducida de GET /api/user |
| GET  | /api/auth/me | Obtenemos el usuario a partir de un token válido |
| POST  | /api/auth | Realiza una identificación o login (signIn) y devuelve un token válido |
| POST  | /api/reg | Realiza un registro mínimo (signUp) de un usuario y devuelve un token válido |


_Ahora se va a exponer la documentación de los endpoints:_

En todos los endpoints nos puede dar un error interno de la base de datos o la comunicación con ella que sera:

status 500

Tambien en todos los endpoints que son del tipo: GET, PUT Y DELETE se necesita pasar en la petición en el apartado authorization un bearer token cuyo valor debe ser un token válido para poder seguir con el funcionamiento del endpoint, sino saldra que el token no es válido o esta caducado (el ejemplo es con un token no valido):

    
    {
        "result": "KO",
        "message": {
            "status": 500,
            "message": "El token no es valido"
        }
    }


Como puede suceder en todos se coloca aquí para no repetir el mismo error en todos los casos.

- GET /api/user

    -   caso correcto: nos devuelve la lista de usuarios registrados en el sistema
    
        status 200 OK 
    
        y el body de la respuesta será:
        ```
        {
            {
                "_id": "6242a4e3fa28bdd7221c1fa7",
                "email": "carlos@gmail.com",
                "name": "carlos",
                "password": "$2b$10$jj9WPMOaSp1HORISlic0POkKKHEIzskSDfMgGHEuw6tY6GEz.2a2G",
                "signupDate": 1648534755,
                "lastLogin": 1648534755
            },
            {
                "_id": "6243255bd2bad51c0edbcfcf",
                "email": "pamela@gmail.com",
                "name": "pamela",
                "password": "$2b$10$RMGlaQoE462A91OF.ujA4e1nH1nnYl3V9JpKI0AVPFFgA2kJYm1hO",
                "signupDate": 1648567643,
                "lastLogin": 1648567643
            }
        }
        ```

- GET /api/user/\{id\}

    ejemplo: https://localhost:3000/api/user/6242a4e3fa28bdd7221c1fa7

    -   caso correcto: nos devuelve el usuario con ese \{id\}
    
        status 200 OK 
    
        y el body de la respuesta será:
        ```
        {
            "_id": "6242a4e3fa28bdd7221c1fa7",
            "email": "carlos@gmail.com",
            "name": "carlos",
            "password": "$2b$10$jj9WPMOaSp1HORISlic0POkKKHEIzskSDfMgGHEuw6tY6GEz.2a2G",
            "signupDate": 1648534755,
            "lastLogin": 1648534755
        },
        ```

- POST /api/user

    Debemos mandarle un body en la petición con información del usuario (el name y email se deben mandar obligatoriamente, el resto es opcional):

    ```
    {
        "name":"pablito",
        "email":"pablito@gmail.com"
    }
    ```

    Hay tres posibles casos: 

    - caso correcto: registra al usuario
    
        status 200 OK 
    
        y el body de la respuesta será:

        ```
        {
            "result": "OK",
            "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2MjUyYmNjZTljNWY4MjJkOTcxMDA2NDMiLCJpbnQiOjE2NDk1ODk0NTQsImV4cCI6MTY1MDE5NDI1NH0.wvJLWjKj6Sd7yBWyUuA3edNm4rF3XQwmowH0TS8J5ek",
            "usuario": {
                "name": "pablito",
                "email": "pablito@gmail.com",
                "signupDate": 1649589454,
                "lastLogin": 1649589454,
                "_id": "6252bcce9c5f822d97100643"
            }
        }   
        ```

    - caso incorrecto, falta de parámetros: no se registra el usuario. Esto es porque en el body de la petición no se ha mandado el campo name o email (el ejemplo es con falta de email):

        status 400 Bad Request

        y el body de la respuesta será:
        ```
        {
            "error": "Bad data",
            "description": "Se precisa al menos un campo <email>"
        }
        ```

    - caso incorrecto, usuario existente: el email del usuario ya existe en la base de datos, entonces no se registra el usuario. La resuesta es así:

        status 400 Bad Request

        y el body de la respuesta será:

        ```
        {
            "error": "El usuario existe"
        }
        ```

- PUT /api/user/\{id\}

    Ejemplo: https://localhost:3000/api/user/6252bcce9c5f822d97100643

    Debemos mandarle un body en la petición con información del usuario para modificar:
    ```
    {
        "name": "lucas"
    }
    ```

    Hay dos posibles casos:

    - caso correcto: se modifica los datos del usuario 

        status 200 OK

        y el body de la respuesta será:

        ```
        {
            "n": 1,
            "electionId": "7fffffff0000000000000003",
            "opTime": {
                "ts": "7084933976527208449",
                "t": 3
            },
            "nModified": 1,
            "ok": 1,
            "$clusterTime": {
                "clusterTime": "7084933976527208449",
                "signature": {
                    "hash": "8ap84tnBrP2EX89Le563jIGzsjE=",
                    "keyId": "7072530171105902596"
                }
            },
            "operationTime": "7084933976527208449"
        }
        ```

    - caso incorrecto: en el body de la peticion hay un campo de email, entonces no se puede modificar el usuario.

        status 400 Bad Request

        y el body de la respuesta será:

        ```
        {
            "error": "no se puede modificar el email"
        }
        ```

- DELETE /api/user/\{id\}

    Ejemplo: https://localhost:3000/api/user/6252bcce9c5f822d97100643

    - caso correcto: se elimina el usuario con ese \{id\} de la base de datos. La respuesta será:

        status 200 OK

        y el body de la respuesta será:

        ```
        {
            "n": 1,
            "electionId": "7fffffff0000000000000003",
            "opTime": {
                "ts": "7084938082515943425",
                "t": 3
            },
            "ok": 1,
            "$clusterTime": {
                "clusterTime": "7084938082515943425",
                "signature": {
                    "hash": "VpbnZN3RnpZdBPZwWdzG6VNIJdk=",
                    "keyId": "7072530171105902596"
                }
            },
            "operationTime": "7084938082515943425",
            "deletedCount": 1
        }
        ```

- GET /api/auth

    - caso correcto: nos devuelve el nombre y email de todos los usuarios registrados del sistema:

        status 200 OK

        y el body de la respuesta:

        ```
        {

            {
                "email": "victor@gmail.com",
                "name": "victor"
            },
            {
                "name": "fran",
                "email": "fran@gmail.com"
            }
        }
        ```

- GET /api/auth/me

    - caso correcto: se identifica el usuario con el token pasado en el apartado authorization (al extraer el id de este):

        status 200 OK

        y el body de la respuesta será:

        ```
        {
            "_id": "624ca88d42d7d215684b108e",
            "email": "antonia@gmail.com",
            "name": "antonia",
            "password": "$2b$10$cOKOzYwy2hB42TzXAKT5G.DYUEcHJMvIn2ZIis5SxikpPUcFicOW2",
            "signupDate": 1649191053,
            "lastLogin": 1649191053
        } 
        ```

- POST /api/auth

    Debemos pasarle informacion de un usuario en la peticion. Esta información se colocará en el body (es obligatorio enviar el email y password):

    ```
    {
        "email":"juan@gmail.com",
        "password":"123"
    }
    ```

    - caso correcto: el usuario existe y tanto el email como password son correctos. Obtenemos en la respuesta la información de ese usuario:

        status 200 OK

        y en el body de la respuesta:

        ```
        {
            "result": "OK",
            "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2MjRjMTViMWIxZDdkYTBmODYzYmMwZmQiLCJpbnQiOjE2NDk2MDExNDAsImV4cCI6MTY1MDIwNTk0MH0.oyW2uE3lTWE2qbxobct9rVt85AYrPM41rVtFaaeTk2Q",
            "usuario": {
                "_id": "624c15b1b1d7da0f863bc0fd",
                "email": "juan@gmail.com",
                "name": "juan",
                "password": "$2b$10$.pllMZ5whymMAK41RJY/ueLNlMMYighF5LVEwdaA0S1RZCxEIC3rG",
                "signupDate": 1649153457,
                "lastLogin": 1649601140
            }
        }
        ```

    - caso incorrecto, ausencia de parámetros: no se han introducido los campos email o password en el body de la petición (el ejemplo es con la ausencia de email).

        status 400 Bad Request

        y el body de la respuesta:

        ```
        {
            "error": "Bad data",
            "description": "Se precisa al menos un campo <email>"
        }
        ```

    - caso incorrecto, email: se introduce un email que no existe:

        status 400 Bad Request

        y el body de la respuesta:

        ```
        {
            "error": "el email no esta registrado"
        }
        ```

    - caso incorrecto, password: la password no coincide con la password del email pasado en el body de la petición:

        status 400 Bad Request

        y el body de la respuesta:

        ```
        {
            "error": "La password introducida no corresponde con la del email:juan@gmail.com"
        }
        ```

- POST /api/reg

    Debemos pasarle informacion de un usuario en la peticion. Esta información se colocará en el body (es obligatorio enviar el name, email y password):

    ```
    {
        "name":"james",
        "email":"james@gmail.com",
        "password":"123"
    }
    ```

    - caso correcto: se registra el usuario con los datos mínimos:

        status 200 OK

        y el body de la respuesta:

        ```
        {
            "result": "OK",
            "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2MjUyZWUyZjY2ZjdmYzNjMmEyMDgwZDkiLCJpbnQiOjE2NDk2MDIwOTUsImV4cCI6MTY1MDIwNjg5NX0.aPqgG-6QxjNQQpuOONZlcRsrv3lvWcdHncGa2rehWt8",
            "usuario": {
                "email": "james@gmail.com",
                "name": "james",
                "password": "$2b$10$LmbIHqt2jr4haOJLNkCe4e/yp2bXHvrj3Bw7HIe0lUodcD1P5THte",
                "signupDate": 1649602095,
                "lastLogin": 1649602095,
                "_id": "6252ee2f66f7fc3c2a2080d9"
            }
        }
        ```

    - caso incorrecto, ausencia de parámetros: no se han introducido los campos name, email o password en el body de la petición (el ejemplo es con la ausencia de name).

        status 400 Bad Request

        y el body de la respuesta:

        ```
        {
            "error": "Bad data",
            "description": "Se precisa al menos un campo <name>"
        }
        ```
    - caso incorrecto, email: se intenta registrar un usuario y el email ya existe en la base de datos:

        status 400 Bad Request

        y el body de la respuesta:

        ```
        {
            "error": "El usuario existe"
        }
        ```


## Construido con 🛠️

_Herramientas utilizadas para crear el proyecto_

* [NodeJS](https://nodejs.org/es/) - Para el desarrollo del back-end
* [MongoDB](https://www.mongodb.com/) - Gestor de DB
* [MongoJS](https://www.npmjs.com/package/mongojs) - Cliente DB
* [Morgan](https://www.npmjs.com/package/morgan) - Motor de registro
* [Express](https://www.npmjs.com/package/express) - Framework para API HTTP
* [bcrypt](https://www.npmjs.com/package/bcrypt) - Encriptación con hash y salt
* [cors](https://www.npmjs.com/package/cors) - Mecanismo adicional cabeceras HTTP
* [helmet](https://www.npmjs.com/package/helmet) - Proteger vulnerabilidades web
* [jwt-simple](https://www.npmjs.com/package/jwt-simple) - Encriptación con tokens
* [moment](https://momentjs.com/) - Para el manejo de fechas

## Versionado 📌

Usamos [SemVer](http://semver.org/) para el versionado. Para todas las versiones disponibles, mira los [tags en este repositorio](https://github.com/tu/proyecto/tags).

## Autores ✒️

* **Abel Martínez** - Desarrollador - [abelmartinezfloresua](https://bitbucket.org/abelmartinezfloresua/)

## Licencia 📄

Este proyecto está bajo la Licencia MIT - mira el archivo [LICENSE](LICENSE) para más detalles

## Expresiones de Gratitud 🎁

* Realizar este proyecto ha sido muy útil para aprender sobre muchas nuevas tecnologías y herramientas 🤓
* También ha servido para aprender a ser más autodidacta 🌟
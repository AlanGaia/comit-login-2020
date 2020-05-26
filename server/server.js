const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();

app.use(bodyParser.json());

let userList = [];

// GET de página inicial
app.get("/", (req, res) => {
  // Retorna página inicial
  res.sendFile(path.join(__dirname, "../client/index.html"));
});

// GET de página de registro
app.get("/register-page", (req, res) => {
  // Retorna página de registro
  res.sendFile(path.join(__dirname, "../client/register.html"));
});

// GET de página de HOME cuando estamos logueados
app.get("/home", (req, res) => {
  // Retorna página de registro
  res.sendFile(path.join(__dirname, "../client/home.html"));
});


app.get('/phrases', (req, res) =>{

  const phrases =  require('./phrases.json')

  //With Filter
  if (req.query.keyboard) {
    const phrasesFiltered = phrases.filter(phrase => phrase.includes(req.query.keyboard));
    return res.json(phrasesFiltered);
  }
  //no filter
  res.json(phrases);
});



//ACA LLEGA MI SOLICITUD AJAX de Register.html

// Metodo Post - Endpoint /register -  Registrar usuarix
app.post("/register", (req, res) => {

  // Llegaron mis datos al backend vacios o no
  // dependiendo de nuestra validación en el front 
  // Guardados en req.body

  console.log(req.body); // { username: 'admin', password: 'admin', confirmPassword: 'admin' }

  // Verificar si recibí los datos y validarlos
  if (!req.body.username || !req.body.password) {
    res.status(400).send("No se recibieron los datos correctos.");
    console.log(res.statusCode);
    return;
    //En este caso voy a la linea 75 de register.html con un statusCode 400
    //Y mensaje de respuesta: No se recibieron los datos correctos
  }

  // Tengo los dos datos, los valido

  //Validar las password 
  if (req.body.password !== req.body.confirmPassword){
    res.status(400).send("Las contraseñas no coinciden");
    console.log(res.statusCode);
    return;
    //En este caso voy a la linea 75 de register.html con un statusCode 400
    //Y mensaje de respuesta: Las contraseñas no coinciden
  }

  // Valido si existe el nombre de usuarix
  if (userList.filter(user => user.username === req.body.username).length > 0) {
    res.status(409).send("Ya existe usuarix con ese nombre.");
    return;
    //En este caso voy a la linea 75 de register.html con un statusCode 409
    //Y mensaje de respuesta: Ya existe un usuarix con ese nombre
  }

  //Si los datos son ingresados, coinciden las contraseñas y ese usuario esta disponible. Registro al usuario
  userList.push({
    username: req.body.username,
    password: req.body.password
  });
  // muestro la lista de usuarios 
  console.log(userList);
  
  
  res.status(200).send("Usuarix registradx.");
  console.log(res.statusCode);
    //En este caso voy a la linea 75 de register.html con un statusCode 200
    //Y mensaje de respuesta: Usuarix registradx.
});

// POST /login - login de usuarix
app.post("/login", (req, res) => {

  console.log(req.body);

  // Verificar si recibí los datos y validarlos
  if (!req.body.username || !req.body.password) {
    res.status(400).send("No se recibieron los datos correctos.");
    return;
  }

  if (userList.filter(user => user.username === req.body.username && user.password === req.body.password).length > 0) {
    res.status(200).send();
  } else {
    res.status(403).send();
  }

});

app.listen(4000, () => {
  console.log("Server iniciado en puerto 4000...")
});

 import express from "express"; 
 import cors from "cors";  
 import {Alumno} from './models/alumno.js';
 import {sumar, restar, multiplicar, dividir} from "./modules/matematica.js";
 import {OMDBSearchByPage, OMDBSearchComplete, OMDBGetByImdbID} from "./modules/omdb-wrapper.js";
 import ValidacionesHelper from './modules/validaciones-helper.js';
 import DateTimeHelper from './modules/datetime-helper.js'


 
const app = express();
const port = 3000;
app.use(cors()); // Middleware de CORS
app.use(express.json()); // Middleware para parsear y comprender JSON


//1
app.get('/', (req, res) => {  
    res.status(200).send('Ya estoy respondiendo!'); //funciona http://localhost:3000/
})
//2
app.get('/saludar/:nombre', (req, res) => { 
    const nombre= req.params.nombre;
    res.status(200).send(`Hola ${nombre}`);
})
//3
app.get('/validarfecha/:ano/:mes/:dia', (req, res) => { 
    const Fecha = req.params.ano +"-"+req.params.mes+"-"+req.params.dia ;
    const validar = (Fecha) => (Date.parse(Fecha));
    if (validar(Fecha)) {
        res.status(200).send(`Fecha válida`);
    }
    else res.status(400).send(`Fecha inválida`);
    console.log(validar(Fecha));
})

//MATEMÁTICA
//1
app.get('/matematica/sumar', (req, res) => {
    let {n1,n2}=req.query;
    n1 = ValidacionesHelper.getIntegerOrDefault(n1, 0);
    n2 = ValidacionesHelper.getIntegerOrDefault(n2, 0);
    var suma= sumar(n1, n2);

    res.status(200).send(`Resultado: ${suma}`);
});
//2
app.get('/matematica/restar', (req, res) => {
    const {n1,n2}=req.query;
    var resta= restar(parseFloat(n1), parseFloat(n2));
    res.status(200).send(`Resultado: ${resta}`);
});

//3
app.get('/matematica/multiplicar', (req, res) => {
    const {n1,n2}=req.query;
    var multiplicacion= multiplicar(parseFloat(n1), parseFloat(n2));
    res.status(200).send(`Resultado: ${multiplicacion}`);
});

//4
app.get('/matematica/dividir', (req, res) => {
    const {n1,n2}=req.query;
    var division= dividir(parseFloat(n1), parseFloat(n2));
    res.status(200).send(`Resultado: ${division}`);
});


//omdb-wrapper.js
//1
app.get('/omdb/searchbypage', async (req, res) => {
    let {search,p}=req.query;
    search=ValidacionesHelper.getStringOrDefault(search, '');
    p= ValidacionesHelper.getIntegerOrDefault(p, 1);

    console.log(search, p);
    var resultado= await OMDBSearchByPage(search,p);
    res.status(200).send(resultado);
});

//2
app.get('/omdb/searchcomplete', async (req, res) => {
    let search=ValidacionesHelper.getStringOrDefault(req.query.search, '');
    var resultado= await OMDBSearchComplete(search);
    res.status(200).send(resultado);
});

//3
app.get('/omdb/getbyomdbid', async (req, res) => {
    let imdbID=ValidacionesHelper.getStringOrDefault(req.query.imdbID,'');
    var resultado= await OMDBGetByImdbID(imdbID);
    res.status(200).send(resultado);
});

//Alumnos
const alumnosArray = [];
alumnosArray.push(new Alumno("Esteban Dido" , "22888444", 20));
alumnosArray.push(new Alumno("Matias Queroso", "28946255", 51));
alumnosArray.push(new Alumno("Elba Calao" , "32623391", 18));
console.log(alumnosArray);

//1
app.get('/alumnos', async (req, res) => {
    try {
        res.status(200).send(alumnosArray);
    } catch (error) {
        res.status(500).send('Error al obtener los alumnos');
    }
});

//2
app.get('/alumnos/:dni', async (req, res) => {
    const dni= req.params.dni;
    console.log(dni);
    var alumno = alumnosArray.find(obj => obj.DNI === dni);
    res.status(500).send(alumno);
});

//3
app.post('/alumnos',  (req, res) => {
    const objRecibido = req.body;
    alumnosArray.push(objRecibido);
    //poner JSON en Body --> No es texto
    res.status(201).send("Created");
});

//4
app.delete('/alumnos', (req, res) => {
    
    const dnirecibido = req.body.dni;
    let  alumnoIndex = alumnosArray.findIndex(item => item.DNI === dnirecibido);
    let alumnos=alumnosArray.splice(alumnoIndex);
    if(alumnoIndex==-1) res.status(404).send("Not Found");
    else res.status(200).send("OK");
        
});




// FECHAS, angie nos dijo que pasemos al siguiente trabajo :)b

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
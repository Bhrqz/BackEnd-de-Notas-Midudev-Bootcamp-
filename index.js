const { request, response } = require("express")
const express = require("express") //importamos express
const cors = require("cors") //esto es para evitar el problema del CORS Crossed Origin bla bla. Cualquier origen, funcionarìa


app.use(cors())


/*
const http = require('http') esto es CommonJS
Lo de arriba puede escribirse como ECMAScript, asi como esto
import http from "Http"
y esto es para poder usar http para realizar los request, pero mejor usemos "express"
*/

const app = express() 
//es IMPORTANTISIMO crear la app primero, pa que funcione express
app.use(express.json())
//se especifica que en las request es necesario que el express jsonee las request


let notes = [
    {
      id: 1,
      content: "HTML is easy, 4relal",
      date: "2019-05-30T17:30:31.098Z",
      important: true
    },
    {
      id: 2,
      content: "Browser can execute only Javascript",
      date: "2019-05-30T18:39:34.091Z",
      important: false
    },
    {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      date: "2019-05-30T19:20:14.298Z",
      important: true
    }
  ]

app.get("/", (request, response) => {
    response.send("<h1>hello World</h1></br><p>En /notas estan las notas y con /notas/elnumeroDeLaNota puedes acceder a una en especifico")
    //importante: aqui la respuesta es una pagina HTML
    // es que el content type fue correctamente definido por el framework
    //"hey es una html, tratamelo bien"ghjg
})

app.get("/notas", (request, response) => {
    response.json(notes) // no hace falta poner el stringify
})

//pero no vamos a colocar un path por cada request, no?
//Hagamos un path dinamico. Un path por el id de la nota

app.get("/notas/:id", (request, response) => {
    const id = Number(request.params.id) //sin el number el id se leeria como una string. seria inutil
    const note = notes.find(note => note.id === id)

    if (note) {
        response.json(note)
    } else {
        response.status(404).end()
    }

})

app.delete("/notas/:id", (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id != id)
})


app.post("/notas", (request, response) => {
    const note = request.body
    
    //el content de la nota es requerido, so

    if (!note || !note.content) {
        return response.status(400).json({
            error: "note.content no puede faltar"
        })
    }


    const ids = notes.map(note => note.id)
    const maxID = Math.max(...ids)

    const newNote = {
        id : maxID +1,
        content : note.content,
        important : typeof note.important != "undefined" ? note.important : false,
        date: new Date().toISOString()
    }

    notes = [ ...notes, newNote] // or notes.concat(newNote)

    response.status(201).json(newNote)
})


  /*lo siguiente serìa si trabajaramos con http

const app = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' }) //hay que tener mucho cuidado y especificar el content type correcto
  response.end(JSON.stringify(notes))
    //este argumento del response.end convierte al objeto notes
    //en un string que puede ser enviado y recuperado en el server
    //esa es la funcion del JSON.Striguifai

})
*/


const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
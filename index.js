const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

app.use(bodyParser.json())  // Takes the raw data from the requests that's stored in the request object, 
                            // parses it into a JavaScript object and assigns it to the request object as a new property body.
app.use(cors()) // By default, only http requests from the same origin are allowed. This allows requests from all origins.

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
  }

app.use(requestLogger) // All of these are middleware

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

let persons = [
    { 
      name: "Arto Hellas", 
      number: "040-123456",
      id: 1
    },
    {
      name: "Ada Lovelace", 
      number: "39-44-5323523",
      id: 2
    },
    { 
      name: "Dan Abramov", 
      number: "12-43-234345",
      id: 3
    },
    { 
      name: "Mary Poppendieck", 
      number: "39-23-6423122",
      id: 4
    }
  ]

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    const message = `Phonebook has info for ${persons.length} people ${new Date()}`
    res.send(message)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

const generateId = () => Math.floor(Math.random() * 10000)

const createPerson = (name, number) => {
    const person = {
        name: name,
        number: number,
        id: generateId()
    }
    persons = persons.concat(person)
    return(person)
}

app.post('/api/persons', (req, res) => {
    const name = req.body.name
    const number = req.body.number
    if (!name) {
        return res.status(400).json({
            error: 'name missing'
        })  
    }
    if (!number) {
        return res.status(400).json({
            error: 'number missing'
        })
    }
    if (persons.find(person => person.name === name)) {
        return res.status(400).json({
            error: 'name must be unique'
        })
    }
    res.json(createPerson(name, number))
})

app.put('/api/persons', (req, res) => {
    const name = req.body.name
    const number = req.body.number
    if (!name) {
        return res.status(400).json({
            error: 'number missing'
        })
    }
    if (!number) {
        return res.status(400).json({
            error: 'number missing'
        })
    }
    persons = persons.filter(person => person.name !== name)
    res.json(createPerson(name, number))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


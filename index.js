const express = require('express')
const path = require('path')
const fs = require('fs')

const app = express()

const PORT = 3000

const dbFilePath = path.join(__dirname, './db/db.json')

// requires the uuid package
const { v4: uuidv4 } = require('uuid')

app.use(express.static('./public'))
app.use(express.json())



// API ROUTES
// sets up a route that handles GET requests to /api/notes
//
// get is used for retrieving the data
//  /api/notes: Represents the endpoint path that the client will use to access this specific API route
app.get('/api/notes', (req, res) => {
    // reads the contents of the db.json file
    fs.readFile(dbFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err)
            return res.status(500).json({ error: 'Internal server error' })
        }

        // parse the JSON data from db.json
        const notes = JSON.parse(data)

        // send the notes as JSON response
        res.json(notes)
    })
})

//
// complete function! - 
// generates a unique ID for the new note that has been submitted via a post /api/notes request
let notes = []

app.post('/api/notes', (req, res) => {
    const newNote = req.body
    newNote.id = uuidv4() // here is where a unique ID is generated

    // Adds the new note to the notes array
    notes.push(newNote)

    // Writes the updated notes array to the db.json file
    fs.writeFile(dbFilePath, JSON.stringify(notes), (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to save note' });
        }

        console.log('Note saved successfully');
        // Send the response only after the file is written successfully
        res.json(newNote);
    });

    //console.log('Notes Array:', notes); // Log the notes array

    //res.json(newNote)
})

// HTML ROUTES
// Define a route in Express that serves the notes.html file when a GET request is made
// callback function  that is executed when a GET request is made to /notes
app.get('/notes', (req, res) => {
    // sends the notes.html file as the response when the /notes route is accessed
    res.sendFile(path.join(__dirname, './public/notes.html'))
})


// wildcard route that will serve the index.html file for a path requested
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
})


// sets up server to listen on a specific port
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})




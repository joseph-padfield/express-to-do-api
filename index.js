const express = require('express')
const ejs = require('ejs')
const app = express()
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()

app.use(cors())
app.engine('html', ejs.renderFile)
app.use(express.static('public'))
app.use(express.json())

app.use(express.urlencoded({extended: true}))

const mysql = require('promise-mysql')

const connection = mysql.createConnection({
    host:process.env.HOST,
    user:process.env.USER,
    password:process.env.PASSWORD,
    database:process.env.DATABASE,
})

app.get('/', function (req, res) {
    res.send('Working')
})

app.post('/', function (req, res) {
    res.send('Post request working')
})

app.get('/tasks', async (req, res) => {
    const db = await connection
    const tasks = await db.query('SELECT * FROM `task-list`')
    res.json({message: "Success", data: tasks})
})

app.get('/tasks/:id', async (req, res) => {
    const id = req.params.id
    const db = await connection
    const task = await db.query('SELECT * FROM `task-list` WHERE `id` = ?', [req.params.id])
    res.json({message: "Success", data: task})
})

app.post('/tasks', async (req, res) => {
    const db = await connection
    const newTask = await db.query('INSERT INTO `task-list` (`title`, `description`) VALUES (?, ?)', [req.body.title, req.body.description])
    res.json({message: "Success", data: newTask})
})

app.put('/tasks/:id', async (req, res) => {
    const id = req.params.id
    const db = await connection
    const task = await db.query('UPDATE `task-list` SET `title` = ?, `description` = ? WHERE `id` = ?',
        [req.body.title, req.body.description, req.params.id])
    res.json({message: "Success", data: task})
})

app.delete('/tasks/:id', async (req, res) => {
    const id = req.params.id
    const db = await connection
    const task = db.query('DELETE FROM `task-list` WHERE `id` = ?', [req.params.id])
    res.json({message: req.params.id + " sucessfully deleted", data: task})
})

app.listen(3000)
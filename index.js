const express = require('express')
const { names, uniqueNamesGenerator } = require('unique-names-generator');
const mysql = require('mysql2')
const app = express()

const PORT = process.env.PORT || 3000
const config = {
    host: process.env.MYSQL_HOST || 'localhost',
    port: process.env.MYSQL_PORT || 3366,
    user: process.env.MSYQL_USER || 'root',
    password: process.env.MSYQL_PASSWORD || '123456',
    database: process.env.MYSQL_DATABASE || 'simpleapp',
    waitForConnections: true
}

app.get('/', async (_, res) => {
    try {
        const randomName = uniqueNamesGenerator({ dictionaries: [names] });
        await createPerson(randomName)
        const people = await getPeople()
        res.send('<h1>Full Cycle Rocks!</h1>' + makePeopleList(people))
    } catch (err) {
        res.status(500).send()
    }
})

app.get('/health', (_, res) => res.send(200))

const connection = mysql.createConnection(config)

connection.connect((err) => {
    if (err) {
        throw err;
    }
    app.listen(PORT, () => {

        console.log('listenning port ' + PORT)
    })
})

const makePeopleList = (people) => {
    return `<ul>${people.map((item) => `<li>${item.name}</li>`).join('')}</ul>`
}

const createPerson = (name) => {
    return new Promise((resolve, reject) => {
        connection.query('INSERT INTO people SET ?', { name }, (err) => {
            if (err) {
                console.error(err)
                return reject(err)
            }
            resolve()
        })
    })
}

const getPeople = () => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM people', (err, results) => {
            if (err) {
                console.error(err)
                return reject(err)
            }

            resolve(results)
        })
    })
}








const fastCsv = require("fast-csv");
const fs = require('fs');

const express = require('express')
const cors = require('cors')
const path = require('path')

// Configure express server
const app = express()
const port = 3000

function read_data(inputFile) {
    return new Promise((resolve, reject) => {
        let data = []
        fs.createReadStream(inputFile)
            .pipe(fastCsv.parse({ delimiter: ',', headers: true }))
            .on('data', row => {
                data.push(row)
            })
            .on('end', () => {
                resolve(data)
            })
            .on('error', error => {
                reject(error)
            })
    })
}

app.use(cors())
app.use('/static', express.static(path.join(__dirname, 'static')));

// root endpoint
app.get('/', (req, res) => {
  res.json({"message": "Hello World"})
})

// data endpoint
app.get('/data', async (req, res) => {
    let data = await read_data("./data.csv")
    res.json(data)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

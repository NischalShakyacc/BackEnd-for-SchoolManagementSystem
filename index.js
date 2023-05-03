const connectToMongo = require('./db');

connectToMongo();

const express = require('express')
const app = express()
const port = 6000

app.use(express.json());

//Available Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/studentInfo', require('./routes/studentInfo'))
app.use('/api/result', require('./routes/result'))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
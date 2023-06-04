const connectToMongo = require('./db');
//using cors
var cors = require('cors')

connectToMongo();

const express = require('express')
const app = express()
const port = 5000

app.use(cors());
app.use(express.json())


//Available Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/users', require('./routes/users'))
app.use('/api/result', require('./routes/result'))
app.use('/api/notice', require('./routes/notice'))
app.use('/api/studentusers', require('./routes/studentusers'))

app.listen(port, () => {
  console.log(`School app listening on port ${port}`)
})


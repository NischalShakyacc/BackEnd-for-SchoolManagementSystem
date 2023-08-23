const connectToMongo = require('./db');
//using cors
const cors = require('cors')
const path = require('path')

connectToMongo();

const express = require('express')
const app = express()
const port = 5000

app.use(cors());
app.use(express.json())

app.use(express.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, 'public')))

//Available Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/users', require('./routes/users'))
app.use('/api/result', require('./routes/result'))
app.use('/api/notice', require('./routes/notice'))
app.use('/api/studentusers', require('./routes/studentusers'))
app.use('/api/enroll', require('./routes/enroll'))

app.listen(port, () => {
  console.log(`School app listening on port ${port}`)
})


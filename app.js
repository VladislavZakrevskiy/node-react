const express = require('express')
const app=express()
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const commentsRoutes = require('./routes/comments')
const usersRoutes = require('./routes/users')
const postsRoutes = require('./routes/posts')



app.use(morgan('dev'))
app.use(cors())
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(express.json())
app.use('/api/comments', commentsRoutes)
app.use('/api/users',usersRoutes)
app.use('/api/posts',postsRoutes)



module.exports = app
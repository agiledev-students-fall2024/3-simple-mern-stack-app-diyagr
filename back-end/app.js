require('dotenv').config({ silent: true }) // load environmental variables from a hidden file named .env
const express = require('express') // CommonJS import style!
const morgan = require('morgan') // middleware for nice logging of incoming HTTP requests
const cors = require('cors') // middleware for enabling CORS (Cross-Origin Resource Sharing) requests.
const mongoose = require('mongoose')
const path = require('path');


const app = express() // instantiate an Express object
app.use(morgan('dev', { skip: (req, res) => process.env.NODE_ENV === 'test' })) // log all incoming requests, except when in unit test mode.  morgan has a few logging default styles - dev is a nice concise color-coded style
app.use(cors()) // allow cross-origin resource sharing

// use express's builtin body-parser middleware to parse any data included in a request
app.use(express.json()) // decode JSON-formatted incoming POST data
app.use(express.urlencoded({ extended: true })) // decode url-encoded incoming POST data

app.use('/public', express.static(path.join(__dirname, 'public')));

// connect to database
mongoose
  .connect(`${process.env.DB_CONNECTION_STRING}`)
  .then(data => console.log(`Connected to MongoDB`))
  .catch(err => console.error(`Failed to connect to MongoDB: ${err}`))

// load the dataabase models we want to deal with
const { Message } = require('./models/Message')
const { User } = require('./models/User')

// a route to handle fetching all messages
app.get('/messages', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({})
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})

// a route to handle fetching a single message by its id
app.get('/messages/:messageId', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({ _id: req.params.messageId })
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})


// a route to handle logging out users
app.post('/messages/save', async (req, res) => {
  // try to save the message to the database
  try {
    const message = await Message.create({
      name: req.body.name,
      message: req.body.message,
    })
    return res.json({
      message: message, // return the message we just saved
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    return res.status(400).json({
      error: err,
      status: 'failed to save the message to the database',
    })
  }
})

// new route for About Us
app.get('/about', (req, res) => {
  const aboutContent = {
    name: "Diya Agrawal",
    description: "My name is Diya Agrawal. I am a junior majoring in Computer Science & Data Science. I am a member  of a few clubs on campus. One of them is the Women in Data Science Club, where I am a member of the events  committee. I am passionate about promoting diversity in computer science and data science   enjoy being a part of a space that creates that kind of community. I am also part of a club called NY Masti,  which is a female South Asian acapella club. I love singing and am very passionate about music, so I have enjoyed being a part of this club. Last year we had the oppurtunity to sing the national anthem for the Brooklyn Nets, during AAPI month which was really cool!" ,
    imageUrl: "http://localhost:5003/public/image.jpg" 
  };
  
  res.json(aboutContent);
});

const PORT = 5003;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

// export the express app we created to make it available to other modules
module.exports = app // CommonJS export style!

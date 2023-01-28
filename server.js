require('dotenv').config();
const express = require("express");
const path = require("path");
const errorHandler = require("./middlewares/errorHandler");
const app = express();
const {requestLogger, logEvents} = require('./middlewares/logger');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const connectDB = require('./config/dbConn');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3500;
const staticPath = path.join(__dirname, 'public');

console.log(process.env.NODE_ENV);

//connect to the database
connectDB();

//logs every request, middleware
app.use(requestLogger);

//custom cors middleware with custom configs.
app.use(cors(corsOptions));

//json parser middleware, handle are request where content-type is json
app.use(express.json());

//cookie parser middleware
app.use(cookieParser());

//exposes static files for public access
app.use('/', express.static(staticPath));

//root router handler
app.use('/', require('./routes/root'))

// /users router handler
app.use('/users', require('./routes/usersRouter'))

// /notes router handler
app.use('/notes', require('./routes/notesRouter'))


//fallback mechanism if req url dosent match with any router(404)
app.all('*', (req, res) => {
  res.status(404);
  //check headers to send apt response
  if(req.accepts('html')){
    let errorFilePath = path.join(__dirname, 'views', '404.html');
    res.sendFile(errorFilePath);
  }else if(req.accepts('json')){
    res.json({'message':'Not Found'});
  }else{
    res.type('txt').send('Not Found')
  }
})

//middleware for handling all errors encountered on the server
app.use(errorHandler)

//event listner for mongoose when database is connected and connection gets opened
mongoose.connection.once('open',  () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  })
});


//event listener for mongo connection error
mongoose.connection.on('error', (error) => {
  console.log(error);
  let mongoErrorMessage = `${error.no}: ${error.code}\t${error.sysCall}\t${error.hostname}`
  logEvents(mongoErrorMessage, 'mongoErrLog.log');
})
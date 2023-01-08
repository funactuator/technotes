require('dotenv').config();
const express = require("express");
const path = require("path");
const errorHandler = require("./middlewares/errorHandler");
const app = express();
const {logger, logEvents} = require('./middlewares/logger');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const connectDB = require('./config/dbConn');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3500;
const staticPath = path.join(__dirname, 'public');

console.log(process.env.NODE_ENV);

connectDB();

app.use(logger);

app.use(cors(corsOptions));

app.use(express.json());

app.use(cookieParser());

app.use('/', express.static(staticPath));

app.use('/', require('./routes/root'))

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

app.use(errorHandler)

mongoose.connection.once('open',  () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  })
});

mongoose.connection.on('error', (error) => {
  console.log(error);
  let mongoErrorMessage = `${error.no}: ${error.code}\t${error.sysCall}\t${error.hostname}`
  logEvents(mongoErrorMessage, 'mongoErrLog.log');
})
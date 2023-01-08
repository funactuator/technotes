require('dotenv').config();
const express = require("express");
const path = require("path");
const errorHandler = require("./middlewares/errorHandler");
const app = express();
const {logger} = require('./middlewares/logger');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const PORT = process.env.PORT || 3500;
const staticPath = path.join(__dirname, 'public');

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

console.log(process.env.NODE_ENV);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})
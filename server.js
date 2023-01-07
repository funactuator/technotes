const express = require("express");
const path = require("path");
const app = express();

const PORT = process.env.PORT || 3500;
const staticPath = path.join(__dirname, '/public');

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})
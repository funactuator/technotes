const {logEvents} = require('./logger');

const ERR_LOG_FILE = 'errLog.log'

const errorHandler = (err, req, res, next) => {
  const errorMessage = `${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`;
  logEvents(errorMessage, ERR_LOG_FILE);
  console.log(err.stack);

  const status = res.statusCode || 500; //server error;
  res.status(status);

  res.json({message:err.message});
}

module.exports = errorHandler;
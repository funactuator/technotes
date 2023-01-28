const { format} = require('date-fns');
const {v4:uuid} = require('uuid');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const DEFAUT_LOG_DIRECTORY = path.join(__dirname, '..', 'logs');
const REQUEST_LOG_FILE = 'reqLog.log';

/**
 * function for logging any message
 * @param {*} message message which is to be logged
 * @param {*} logFileName fileName in which message will be logged
 */
const logEvents = async (message, logFileName) => {
  const dateTime = format(new Date(), 'ddMMyyyy\tHH:mm:ss');

  //log entry item based on date and message and unique id;
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

  try{
    if(!fs.existsSync(DEFAUT_LOG_DIRECTORY)){
      await fsPromises.mkdir(DEFAUT_LOG_DIRECTORY);
    }
    await fsPromises.appendFile(path.join(DEFAUT_LOG_DIRECTORY, logFileName), logItem)
  }catch(error){
    console.log(error);
  }

}

/**
 * middleware which logs every request 
 * @param {*} req request object
 * @param {*} res response object
 * @param {*} next next object
 */
const requestLogger = (req, res, next) => {
  const message = `${req.method}\t${req.url}\t${req.headers.origin}`
  logEvents(message, REQUEST_LOG_FILE);
  console.log(`${req.method} ${req.path}`);
  next();
}

module.exports = {logEvents, requestLogger}
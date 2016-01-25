var r = require('rethinkdb');
var config = require("./config.js")

function createConnection(req, res, next) {
  r.connect(config.rethinkdb, function(error, conn) {
    if (error) {
      handleError(res, error);
    } else {
      // Save the connection in `req`
      req._rdbConn = conn;
      // Pass the current request to the next middleware
      next();
    }
  });
}

function handleError(res, error) {
    return res.status(500).send({'error': error.message});
}

module.exports = createConnection;

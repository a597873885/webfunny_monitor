var app = require('../app');
    var { accountInfo } = require("../config/AccountConfig")
    
    global.serverType = "slave"
    
    var port = normalizePort(process.env.PORT || accountInfo.localServerPort);
    app.listen(port);
    
    function normalizePort(val) {
      var port = parseInt(val, 10);
    
      if (isNaN(port)) {
        // named pipe
        return val;
      }
    
      if (port >= 0) {
        // port number
        return port;
      }
    
      return false;
    }
    
var io = require('socket.io');
module.exports = function(argv) {
    io.listen(argv.websocketPort || 3300);
};

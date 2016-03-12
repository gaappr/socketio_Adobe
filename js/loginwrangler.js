var events = require('./events.js');

module.exports = {

    checkLogin: function(userName) {
        return userName === "Graham";
    },

    loginFailed: function(){
        socket.emit(events.loginFailure, {} );
    }
}
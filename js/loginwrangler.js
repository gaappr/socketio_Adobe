var events = require('lpevents');

module.exports = {

    checkLogin: function(userName) {
        return userName === "Graham";
    },

    loginFailed: function(){
        socket.emit(events.loginFailure, {} );
    }
}
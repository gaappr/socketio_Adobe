module.exports = {

    checkLogin: function(userName) {
        return userName === "Graham" ? true : false;
    },

    loginFailed: function(){
        socket.emit('loginFailure', {} );
    }
}
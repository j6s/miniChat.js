/**
 * Created by thephpjo on 8/13/14.
 */

var Promise = require("promise");
var tim = require("tinytim").tim;



Client = function (socket) {
    this.socket = socket;
    this.vars = {
        remote: socket.Address
    }
    this.init();
}

Client.prototype = {
    /**
     * empty function: constructor
     */
    init: function () {

    },

    /**
     * authenticate user
     * @returns {Promise}   resolved, when user has choosen a username
     *                      has the username as argument
     */
    auth: function () {
        var self = this;

        return new Promise(function (resolve, reject) {
            self.socket.write("choose a username: ");

            self.socket.on("data", function (data) {

                self.username = data.toString().replace("\n","");

                self.socket.removeAllListeners("data");
                GLOBAL.clients.systemMessageToAll(self.username + " has joined")

                resolve(self.username);
            })
        });
    },

    /**
     * Sends a message to this user
     * @param msg
     */
    send: function(msg){
        this.socket.write(msg);
    },

    /**
     * Initializes the listeners for normal chatting:
     * Should be called, when auth is resolved
     */
    listen: function(){
        var self = this;

        /**
         * Listener for incoming data:
         * Checks if the data is a command. If not it is a message, that belongs to everyone
         * Available commands:
         *  "/exit" - leaves the room
         *  "/info" - prints info about yourself
         */
        this.socket.on("data",function(data){
            switch(data.toString().replace("\n","")){
                case "/exit":
                    self.destroy();
                    self.socket.destroy();
                    return;
                case "/info":
                    var msg = tim("{{ user.username }} - {{ user.socket.remoteAddress }} - {{ user.socket.bytesRead }}bytes sent, {{ user.socket.bytesWritten }}bytes received", {user: self});
                    GLOBAL.clients.systemMessageToAll(msg);
                    return;
            }
            GLOBAL.clients.messageToAll(self.username,data.toString());
        });

        /**
         * Remove this Client from the Collection, if the connection was closed
         */
        this.socket.on("close",function(){
            self.destroy();
        });
    },

    /**
     * Removes this Client from the Collection
     */
    destroy: function(){
        GLOBAL.clients.removeClient(this);
    }
}

module.exports = Client
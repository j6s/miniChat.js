/**
 * Created by thephpjo on 8/13/14.
 */

var tim = require("tinytim").tim;
var S   = require("string");

/**
 * ClientCollection: holder for all the clients.
 * Does all the sending work.
 * @constructor
 */
var ClientCollection = function(){
    this.clients = [];
}

ClientCollection.prototype = {
    /**
     * Add a client to the list.
     * This client will receive all the messages
     * @param client
     */
    addClient: function(client){
        this.clients.push(client);
    },

    /**
     * Remove a client from the list
     * @param client
     */
    removeClient: function(client){
        for(c in this.clients){
            if(client == this.clients[c]){
                delete this.clients[c];
                GLOBAL.clients.systemMessageToAll(client.username + " has left");
            }
        }
    },

    /**
     * Send something to all the clients
     * @param msg
     */
    sendToAll: function(msg){
        console.log(msg);
        for(c in this.clients){
            this.clients[c].send(msg)
        }
    },

    /**
     * Send a Chatmessage to everyone
     * @param sender
     * @param msg
     */
    messageToAll: function(sender,msg){
        var message = tim("{{ sender }}{{ msg }}",{
            sender: S(sender).padRight(25),
            msg: msg
        });

        this.sendToAll(message);
    },

    /**
     * Send a SystemMessage to everyone
     * @param msg
     */
    systemMessageToAll: function(msg){
        var message = tim("<{{ msg }}>",{msg: msg});
        this.sendToAll(message);
    },

}

module.exports = ClientCollection;
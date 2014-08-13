/**
 * Created by thephpjo on 8/13/14.
 */
var Client = require("./Client");
var Promise = require("promise");
var ClientCollection = require("./ClientCollection");
var net = require("net");


var server = new net.Server();

/**
 * Our ClientCollection is a global Object: It is accessed by the individual Clients
 * @type {ClientCollection}
 */
GLOBAL.clients = new ClientCollection();

/**
 * If there is a new Connection, create a new Client object
 * and ask it to authenticate. Then add it to the ClientCollection
 */
server.on("connection",function(socket){
    var client = new Client(socket);

    client.auth().then(function(username){
        client.listen();
        GLOBAL.clients.addClient(client);
    })
});

/**
 * Server runs on port 55555 by default
 */
var port = process.argv[2] || 55555;
server.listen(port,function(err){
    if(err){
        console.log(err);
        return;
    }
    console.log("Listening on port " + port);
})



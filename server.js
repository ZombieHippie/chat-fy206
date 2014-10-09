var http = require('http'),
    WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({port: 6078});

var clients = [];
var date = new Date();
var lastMessages = []

wss.on('connection', function (ws) {
    console.log(date.getDate() +" - "+ date.getHours() +":"+ date.getMinutes() + " A client has connected");
    lastMessages.forEach(ws.send.bind(ws))
    ws.send("s:Welcome to Fuck Yeah 206!");
    //for (var i = 0; i < clients.length; i++) {
    //    clients[i].send("s:Another drawer joined!");
    //}
    clients.push(ws);
    ws.send("s:Now there are " + clients.length + " chatters connected");
    ws.on('close', function (ws) {
        var whoToSplice = -1;
        for (var i = 0; i < clients.length; i++) {
            if (clients[i].readyState == 3) {
                whoToSplice = i;
            }
        }
        if (whoToSplice != -1) {
            clients.splice(whoToSplice, 1);
            console.log(date.getDate() +" - "+ date.getHours() +":"+ date.getMinutes() + "Removed a client from server");
            //for (var i = 0; i < clients.length; i++) {
            //    clients[i].send("s:We've lost an artist.");
            //}
        }
    });
    ws.on('message', function (message) {
        lastMessages.push("m:"+message)
        if (lastMessages.length > 100) {
            lastMessages.pop()
        }
        for (var i = 0; i < clients.length; i++) {
            clients[i].send("m:"+message);
        }
    });
});
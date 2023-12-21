const ws = require('ws');
const { randomUUID } = require("crypto");
const { EventEmitter } = require('events')

class Client extends EventEmitter {
    constructor(name, color) {
        super()
    }
    sendChat = (msg) => {
        this.cl.send(`42["message",{"content":"${msg}"}]`)
    }
    connect = (aname, acolor) => {
        this.cl = new ws("wss://chat.owo69.me/socket.io/?EIO=4&transport=websocket");
        this.cl.addEventListener("message", (evt) => {
            try {
                var jsondata = (evt.data.startsWith("0")) ? JSON.parse(evt.data.substring(1)) : JSON.parse(evt.data.substring(2))
                
                if(evt.data.startsWith("0")) {
                    this.cl.send("40")
                    var timees = 2
                    setInterval(async () => {
                        this.cl.send(timees)
                        timees++
                    }, jsondata.pingInterval);
                }
                if(evt.data.startsWith("40")) {
                    this.cl.send(`42[
                        "user",
                        {
                        "uuid": "${randomUUID()}",
                        "secret": "${randomUUID()}",
                        "name": "${aname || "Client"}",
                        "color": "${acolor || "#5555ff"}"
                        }
                    ]`)
                }
                if(evt.data.startsWith(`42["users`)) {
                    this.emit("connected", "")
                }
                if(evt.data.startsWith(`42["message`)) {
                    if(JSON.stringify(jsondata[1]).startsWith("{")) this.emit("message", jsondata[1]);
                }
            } catch(e) {console.log("Error while processing messages.")}
        })
    }
}

module.exports = Client;
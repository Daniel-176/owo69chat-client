const ws = require('ws');
const { randomUUID } = require("crypto");
const { EventEmitter } = require('events')

class Client extends EventEmitter {
    constructor(name, color) {
        super()
        this.uuid = randomUUID()
    }
    
    sendChat = (msg) => {
        this.cl.send(`42["message",{"content":"${msg}"}]`)
    }
    
    connect = (aname, acolor) => {
        this.cl = new ws("wss://chat.owo69.me/socket.io/?EIO=4&transport=websocket");
        this.cl.addEventListener("message", (evt) => {
            try {
                // console.log(evt.data)
                // if(evt.data == "2") this.cl.send("3");
                var jsondata = (evt.data.startsWith("0{")) ? JSON.parse(evt.data.substring(1)) : JSON.parse(evt.data.substring(2))
                var rawdata = (evt.data).toString()
                if(rawdata.startsWith("0")) {
                    this.cl.send("40")
                    setInterval(() => {
                        this.cl.send("3")
                        console.log("3")
                    }, jsondata.pingInterval);
                    
                }
                if(rawdata.startsWith("40")) {
                    this.cl.send(`42[
                        "user",
                        {
                        "uuid": "${this.uuid}",
                        "secret": "${randomUUID()}",
                        "name": "${aname || "Client"}",
                        "color": "${acolor || "#5555ff"}"
                        }
                    ]`)
                }
                if(rawdata.startsWith(`42["users`)) {
                    this.emit("connected", "")
                }
                if(rawdata.startsWith(`42["message"`)) {
                    // console.log(JSON.stringify(jsondata[1]))
                    if(JSON.stringify(jsondata[1]).startsWith(`{"`)) this.emit("message", jsondata[1]);
                }
            } catch(e) {console.log("Error while processing messages. "+e+" - "+evt.data)}
        })
    }
}

module.exports = Client;

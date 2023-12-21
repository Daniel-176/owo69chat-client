const ws = require("ws")
const Client = require("./Client")
const client = new Client();

client.on("connected", () => {
    console.log("Connected")
})

client.on("message", msg => {
    //example of msg usage:
    if(msg.content.startsWith("!hi")) {
        client.sendChat(`Hello! [${msg.user.uuid}]${msg.user.name}`)
    }
})

client.connect("Client", "#5555ff")
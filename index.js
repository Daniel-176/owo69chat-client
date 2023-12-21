const ws = require("ws")
const Client = require("./Client")
const client = new Client();

client.on("connected", () => {
    console.log("Connected")
})

client.on("message", msg => {
    console.log(msg.content, msg.user.name)
})

client.connect("hello", "#5555ff")
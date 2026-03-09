const express = require("express");
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 10000;

/*
Initialize WhatsApp Client
*/
const client = new Client({
  authStrategy: new LocalAuth({
    clientId: "blitz-bot"
  }),
  puppeteer: {
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu"
    ]
  }
});

/*
QR Code Event
*/
client.on("qr", (qr) => {
  console.log("Scan this QR Code to login:");
  qrcode.generate(qr, { small: true });
});

/*
Client Ready
*/
client.on("ready", () => {
  console.log("✅ WhatsApp Client is Ready!");
});

/*
Authenticated
*/
client.on("authenticated", () => {
  console.log("✅ WhatsApp Authenticated");
});

/*
Auth Failure
*/
client.on("auth_failure", (msg) => {
  console.error("❌ Authentication failed:", msg);
});

/*
Disconnected
*/
client.on("disconnected", (reason) => {
  console.log("⚠️ WhatsApp disconnected:", reason);
});

/*
Receive Messages
*/
client.on("message", async (msg) => {
  console.log(`📩 Message from ${msg.from}: ${msg.body}`);

  // Example auto reply
  if (msg.body.toLowerCase() === "hi") {
    msg.reply("Hello 👋 Welcome to Blitz Academy!");
  }
});

/*
Start WhatsApp Client
*/
client.initialize();

/*
Health Check Route
*/
app.get("/", (req, res) => {
  res.send("🚀 WhatsApp Bot Running");
});

/*
API: Send WhatsApp Message
POST /send-message
Body:
{
 "number": "919876543210",
 "message": "Hello from Blitz Academy"
}
*/
app.post("/send-message", async (req, res) => {
  try {
    const { number, message } = req.body;

    if (!number || !message) {
      return res.status(400).send("Number and message are required");
    }

    const chatId = number + "@c.us";

    await client.sendMessage(chatId, message);

    res.send({
      status: "success",
      message: "Message sent successfully"
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Error sending message");
  }
});

/*
Start Express Server
*/
app.listen(PORT, () => {
  console.log(`🌐 Server running on port ${PORT}`);
});

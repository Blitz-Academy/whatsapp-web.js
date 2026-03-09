const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

/*
Initialize WhatsApp Client
*/
const client = new Client({
    authStrategy: new LocalAuth({
        clientId: "blitz-bot"
    }),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

/*
QR Code Event
*/
client.on('qr', (qr) => {
    console.log("Scan the QR Code below:");
    qrcode.generate(qr, { small: true });
});

/*
Ready Event
*/
client.on('ready', () => {
    console.log('✅ WhatsApp Client is Ready!');
});

/*
Auth Success
*/
client.on('authenticated', () => {
    console.log('✅ WhatsApp Authenticated');
});

/*
Auth Failure
*/
client.on('auth_failure', msg => {
    console.error('❌ Authentication failure', msg);
});

/*
Disconnected
*/
client.on('disconnected', reason => {
    console.log('⚠️ Client was logged out', reason);
});

/*
Start WhatsApp Client
*/
client.initialize();

/*
Health Check Route
*/
app.get('/', (req, res) => {
    res.send("WhatsApp Bot Running 🚀");
});

/*
Send Message API
POST /send-message
Body:
{
  "number": "919876543210",
  "message": "Hello from bot"
}
*/
app.post('/send-message', async (req, res) => {
    try {
        const number = req.body.number;
        const message = req.body.message;

        if (!number || !message) {
            return res.status(400).send("Number and message required");
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
Receive Incoming Messages
*/
client.on('message', async msg => {
    console.log(`📩 Message from ${msg.from}: ${msg.body}`);

    if (msg.body.toLowerCase() === "hi") {
        msg.reply("Hello 👋 How can I help you?");
    }
});

/*
Start Express Server
*/
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

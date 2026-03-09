const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    executablePath: '/opt/render/.cache/puppeteer/chrome/linux-146.0.7680.31/chrome-linux64/chrome',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu'
    ]
  }
});

client.on('qr', (qr) => {
  console.log("Scan QR Code:");
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log("WhatsApp Ready");
});

client.initialize();

app.get("/", (req,res)=>{
  res.send("Bot running");
});

app.post('/send-message', async (req,res)=>{
  const number = req.body.number;
  const message = req.body.message;

  const chatId = number + "@c.us";

  await client.sendMessage(chatId, message);

  res.send("Message sent");
});

app.listen(PORT, ()=>{
  console.log("Server running on port " + PORT);
});

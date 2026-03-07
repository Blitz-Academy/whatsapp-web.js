const express = require("express");
const { Client, LocalAuth } = require("whatsapp-web.js");

const app = express();
const PORT = process.env.PORT || 3000;

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  }
});

client.initialize();

client.on("ready", () => {
  console.log("WhatsApp bot is ready");
});

app.get("/", (req, res) => {
  res.send("WhatsApp bot running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

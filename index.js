'use strict';

const Constants = require('./src/util/Constants');

module.exports = {
    Client: require('./src/Client'),
    
    version: require('./package.json').version,

    // Structures
    Chat: require('./src/structures/Chat'),
    PrivateChat: require('./src/structures/PrivateChat'),
    GroupChat: require('./src/structures/GroupChat'),
    Channel: require('./src/structures/Channel'),
    Message: require('./src/structures/Message'),
    MessageMedia: require('./src/structures/MessageMedia'),
    Contact: require('./src/structures/Contact'),
    PrivateContact: require('./src/structures/PrivateContact'),
    BusinessContact: require('./src/structures/BusinessContact'),
    ClientInfo: require('./src/structures/ClientInfo'),
    Location: require('./src/structures/Location'),
    Poll: require('./src/structures/Poll'),
    ScheduledEvent: require('./src/structures/ScheduledEvent'),
    ProductMetadata: require('./src/structures/ProductMetadata'),
    List: require('./src/structures/List'),
    Buttons: require('./src/structures/Buttons'),
    Broadcast: require('./src/structures/Broadcast'),
    
    // Auth Strategies
    NoAuth: require('./src/authStrategies/NoAuth'),
    LocalAuth: require('./src/authStrategies/LocalAuth'),
    RemoteAuth: require('./src/authStrategies/RemoteAuth'),
    
    ...Constants
};

const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const app = express();
app.use(express.json());

const client = new Client({
  authStrategy: new LocalAuth()
});

client.on('qr', qr => {
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('WhatsApp Ready');
});

client.initialize();

app.post('/send-message', async (req, res) => {
  const number = req.body.number;
  const message = req.body.message;

  const chatId = number + "@c.us";

  await client.sendMessage(chatId, message);

  res.send("Message sent");
});

app.listen(3000, () => {
  console.log("Server running");
});

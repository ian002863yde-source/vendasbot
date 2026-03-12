const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");
const config = require("../config.json");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages
  ],
  partials: [Partials.Channel]
});

client.config = config;
client.eventsLoaded = new Collection();

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith(".js"));

for (const file of eventFiles) {
  const event = require(path.join(eventsPath, file));
  client.eventsLoaded.set(event.name, true);

  if (event.once) {
    client.once(event.name, (...args) => event.execute(client, ...args));
  } else {
    client.on(event.name, (...args) => event.execute(client, ...args));
  }
}

client.login(config.token);
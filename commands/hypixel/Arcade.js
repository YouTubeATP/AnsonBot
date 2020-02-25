const Discord = require("discord.js"),
  Hypixel = require("hypixel"),
  Enmap = require("enmap"),
  fs = require("fs");

const config = require("/app/util/config"),
  fn = require("/app/util/fn"),
  shared = require("/app/index.js");

const MinecraftUUID = new Enmap({
  name: "link",
  fetchAll: false,
  autoFetch: true,
  cloneLevel: "deep"
});

let hypixel,
  hypixel1 = new Hypixel({ key: process.env.HYAPI1 }),
  hypixel2 = new Hypixel({ key: process.env.HYAPI2 });

shared.client.gamemodes = new Discord.Collection();
const gamemodeFiles = fs
  .readdirSync("/app/commands/hypixel")
  .filter(file => file.endsWith(".js"));
for (const file of gamemodeFiles) {
  const gamemode = require(`./hypixel/${file}`);
  shared.client.gamemodes.set(gamemode.name, gamemode);
}

module.exports = {
  name: "Arcade",
  run: async (client, message, args, shared) => {
    
  }
};

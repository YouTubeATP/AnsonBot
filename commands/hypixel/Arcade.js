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

module.exports = {
  name: "Arcade",
  run: async (
    client,
    message,
    args,
    shared,
    username,
    player,
    uuid,
    rank,
    rankcolor,
    stats,
    username2,
    player2,
    uuid2,
    rank2,
    rankcolor2,
    stats2
  ) => {
    return message.channel.send(
      fn.embed(client, {
        title: "Coming soon!",
        description: `Game-specific stats for Arcade Games are still a work in progress. Sorry for the inconvenience caused!`
      })
    );
  }
};

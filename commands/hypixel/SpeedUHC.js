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
  name: "SpeedUHC",
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
    stats
  ) => {
    return message.channel.send(
      fn.embed(client, {
        title: "Coming soon!",
        description: `Game-specific stats for Speed UHC are still a work in progress. Sorry for the inconvenience caused!`
      })
    );
  }
};

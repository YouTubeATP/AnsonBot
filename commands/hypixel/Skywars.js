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

const modes = {
  solo_normal: "Solo (Normal)",
  solo_insane: "Solo (Insane)",
  teams_normal: "Doubles (Normal)",
  teams_insane: "Doubles (Insane)",
  mega_doubles: "Mega",
  eight_two_rush: "Doubles Rush",
  four_four_rush: "4v4v4v4 Rush",
  eight_two_ultimate: "Doubles Ultimate",
  four_four_ultimate: "4v4v4v4 Ultimate",
  eight_two_voidless: "Doubles Voidless",
  four_four_voidless: "4v4v4v4 Voidless",
  eight_two_armed: "Doubles Armed",
  four_four_armed: "4v4v4v4 Armed",
  eight_two_lucky: "Doubles Lucky Blocks",
  four_four_lucky: "4v4v4v4 Lucky Blocks",
  castle: "Castle"
};

module.exports = {
  name: "Skywars",
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
        description: `Game-specific stats for SkyWars are still a work in progress. Sorry for the inconvenience caused!`
      })
    );
  }
};

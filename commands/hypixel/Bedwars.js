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
  name: "Bedwars",
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
    thumbnailURL,
    stats
  ) => {
    return message.channel.send(
      fn.embed(client, {
        title: "Coming soon!",
        description: `Game-specific stats for BedWars are still a work in progress. Sorry for the inconvenience caused!`
      })
    );
    let embeds = [];
    let level = getLevelForExp(stats.Experience);
    const EASY_LEVELS = 4;
    const EASY_LEVELS_XP = 7000;
    const XP_PER_PRESTIGE = 96 * 5000 + EASY_LEVELS_XP;
    const LEVELS_PER_PRESTIGE = 100;
    const HIGHEST_PRESTIGE = 10;

    function getExpForLevel(level) {
      if (level == 0) return 0;

      var respectedLevel = getLevelRespectingPrestige(level);
      if (respectedLevel > EASY_LEVELS) {
        return 5000;
      }

      switch (respectedLevel) {
        case 1:
          return 500;
        case 2:
          return 1000;
        case 3:
          return 2000;
        case 4:
          return 3500;
      }
      return 5000;
    }

    function getLevelRespectingPrestige(level) {
      if (level > HIGHEST_PRESTIGE * LEVELS_PER_PRESTIGE) {
        return level - HIGHEST_PRESTIGE * LEVELS_PER_PRESTIGE;
      } else {
        return level % LEVELS_PER_PRESTIGE;
      }
    }

    function getLevelForExp(exp) {
      var prestiges = Math.floor(exp / XP_PER_PRESTIGE);
      var level = prestiges * LEVELS_PER_PRESTIGE;
      var expWithoutPrestiges = exp - prestiges * XP_PER_PRESTIGE;

      for (let i = 1; i <= EASY_LEVELS; ++i) {
        var expForEasyLevel = getExpForLevel(i);
        if (expWithoutPrestiges < expForEasyLevel) {
          break;
        }
        level++;
        expWithoutPrestiges -= expForEasyLevel;
      }
      //returns players bedwars level, remove the Math.floor if you want the exact bedwars level returned
      return level + Math.floor(expWithoutPrestiges / 5000);
    }
    embeds.push(
      new Discord.RichEmbed()
        .setColor(rankcolor)
        .setThumbnail(thumbnailURL)
        .setTitle(`[${rank}] ${username}`)
        .setDescription("BedWars = **Overall**")
        .setURL(`https://hypixel.net/player/${username}`)
        .addField("Level", `\`${netlvl}\``, true)
        .addField("Karma", `\`${player.karma}\``, true)
        .addField("Karma", `\`${player.karma}\``, true)
        .setFooter(
          `UUID: ${player.uuid} | ${client.user.username}`,
          client.user.avatarURL
        )
    );
  }
};

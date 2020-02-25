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

const EASY_LEVELS = 4,
  EASY_LEVELS_XP = 7000,
  XP_PER_PRESTIGE = 96 * 5000 + EASY_LEVELS_XP,
  LEVELS_PER_PRESTIGE = 100,
  HIGHEST_PRESTIGE = 10;

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
    stats
  ) => {
    let embeds = [];
    let thumbnailURL =
      "https://hypixel.net/styles/hypixel-uix/hypixel/game-icons/BedWars-64.png";
    let bwlvl = getLevelForExp(stats.Experience);
    let eight_one_played = stats.eight_one_games_played_bedwars,
      eight_two_played = stats.eight_two_games_played_bedwars,
      four_three_played = stats.four_three_games_played_bedwars,
      four_four_played = stats.four_four_games_played_bedwars,
      two_four_played = stats.two_four_games_played_bedwars,
      total_played =
        eight_one_played +
        eight_two_played +
        four_three_played +
        four_four_played +
        two_four_played;
    return message.channel.send(
      new Discord.RichEmbed()
        .setColor(rankcolor)
        .setThumbnail(thumbnailURL)
        .setTitle(`[${rank}] ${username}`)
        .setDescription("**Bed Wars | Overall**")
        .setURL(`https://hypixel.net/player/${username}`)
        .addField("Level", `${bwlvl}`, true)
        .addField("Coins", `${stats.coins}`, true)
        .addField("Win Streak", `${stats.winstreak}`, true)
        .addField("Games Played", `${total_played}`)
        .addField("Wins", `${stats.wins_bedwars}`, true)
        .addField("Losses", `${stats.losses_bedwars}`, true)
        .addField(
          "Win/Loss Ratio",
          `${Math.floor((stats.wins_bedwars / stats.losses_bedwars) * 100) /
            100}`
        )
        .addField("Kills", `${stats.kills_bedwars}`, true)
        .addField("Deaths", `${stats.deaths_bedwars}`, true)
        .addField(
          "Kill/Death Ratio",
          `${Math.floor((stats.kills_bedwars / stats.deaths_bedwars) * 100) /
            100}`
        )
        .addField("Final Kills", `${stats.final_kills_bedwars}`, true)
        .addField("Final Deaths", `${stats.final_deaths_bedwars}`, true)
        .addField(
          "Final Kill/Death Ratio",
          `${Math.floor(
            (stats.final_kills_bedwars / stats.final_deaths_bedwars) * 100
          ) / 100}`
        )
        .addField("Beds Broken", `${stats.beds_broken_bedwars}`, true)
        .addField("Beds Lost", `${stats.beds_lost_bedwars}`, true)
        .addField(
          "Beds Broken/Lost Ratio",
          `${Math.floor(
            (stats.beds_broken_bedwars / stats.beds_lost_bedwars) * 100
          ) / 100}`
        )
        .setFooter(
          `UUID: ${player.uuid} | ${client.user.username}`,
          client.user.avatarURL
        )
    );
    embeds.push(
      new Discord.RichEmbed()
        .setColor(rankcolor)
        .setThumbnail(thumbnailURL)
        .setTitle(`[${rank}] ${username}`)
        .setDescription("**Bed Wars | Overall**")
        .setURL(`https://hypixel.net/player/${username}`)
        .addField("Level", `${bwlvl}`, true)
        .addField("Coins", `${stats.coins}`, true)
        .addField("Win Streak", `${stats.winstreak}`, true)
        .addField("Games Played", `${total_played}`)
        .addField("Wins", `${stats.wins_bedwars}`, true)
        .addField("Losses", `${stats.losses_bedwars}`, true)
        .addField(
          "Win/Loss Ratio",
          `${Math.floor((stats.wins_bedwars / stats.losses_bedwars) * 100) /
            100}`
        )
        .addField("Kills", `${stats.kills_bedwars}`, true)
        .addField("Deaths", `${stats.deaths_bedwars}`, true)
        .addField(
          "Kill/Death Ratio",
          `${Math.floor((stats.kills_bedwars / stats.deaths_bedwars) * 100) /
            100}`
        )
        .addField("Final Kills", `${stats.final_kills_bedwars}`, true)
        .addField("Final Deaths", `${stats.final_deaths_bedwars}`, true)
        .addField(
          "Final Kill/Death Ratio",
          `${Math.floor(
            (stats.final_kills_bedwars / stats.final_deaths_bedwars) * 100
          ) / 100}`
        )
        .addField("Beds Broken", `${stats.beds_broken_bedwars}`, true)
        .addField("Beds Lost", `${stats.beds_lost_bedwars}`, true)
        .addField(
          "Beds Broken/Lost Ratio",
          `${Math.floor(
            (stats.beds_broken_bedwars / stats.beds_lost_bedwars) * 100
          ) / 100}`
        )
        .setFooter(
          `UUID: ${player.uuid} | ${client.user.username}`,
          client.user.avatarURL
        ),
      new Discord.RichEmbed()
        .setColor(rankcolor)
        .setThumbnail(thumbnailURL)
        .setTitle(`[${rank}] ${username}`)
        .setDescription("**Bed Wars | Solo**")
        .setURL(`https://hypixel.net/player/${username}`)
        .addField("Games Played", `${total_played}`)
        .addField("Wins", `${stats.wins_bedwars}`, true)
        .addField("Losses", `${stats.losses_bedwars}`, true)
        .addField(
          "Win/Loss Ratio",
          `${Math.floor((stats.wins_bedwars / stats.losses_bedwars) * 100) /
            100}`
        )
        .addField("Kills", `${stats.kills_bedwars}`, true)
        .addField("Deaths", `${stats.deaths_bedwars}`, true)
        .addField(
          "Kill/Death Ratio",
          `${Math.floor((stats.kills_bedwars / stats.deaths_bedwars) * 100) /
            100}`
        )
        .addField("Final Kills", `${stats.final_kills_bedwars}`, true)
        .addField("Final Deaths", `${stats.final_deaths_bedwars}`, true)
        .addField(
          "Final Kill/Death Ratio",
          `${Math.floor(
            (stats.final_kills_bedwars / stats.final_deaths_bedwars) * 100
          ) / 100}`
        )
        .addField("Beds Broken", `${stats.beds_broken_bedwars}`, true)
        .addField("Beds Lost", `${stats.beds_lost_bedwars}`, true)
        .addField(
          "Beds Broken/Lost Ratio",
          `${Math.floor(
            (stats.beds_broken_bedwars / stats.beds_lost_bedwars) * 100
          ) / 100}`
        )
        .setFooter(
          `UUID: ${player.uuid} | ${client.user.username}`,
          client.user.avatarURL
        )
    );

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
      return level + Math.floor(expWithoutPrestiges / 5000);
    }
  }
};

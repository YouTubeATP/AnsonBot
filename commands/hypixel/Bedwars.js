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

const modes = {
  eight_one: "Solo",
  eight_two: "Doubles",
  four_three: "3v3v3v3",
  four_four: "4v4v4v4",
  two_four: "4v4",
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
    embeds.push(
      new Discord.RichEmbed()
        .setColor(rankcolor)
        .setThumbnail(thumbnailURL)
        .setTitle(`[${rank}] ${username}`)
        .setDescription("**Bed Wars | Overall**")
        .setURL(`https://hypixel.net/player/${username}`)
        .addField("Level", `${bwlvl || 0}`)
        .addField("Coins", `${stats.coins || 0}`)
        .addField("Win Streak", `${stats.winstreak || 0}`)
        .addField("Games Played", `${stats.games_played_bedwars || 0}`)
        .addField("Kills", `${stats.kills_bedwars || 0}`, true)
        .addField("Deaths", `${stats.deaths_bedwars || 0}`, true)
        .addField(
          "Kill/Death Ratio",
          `${Math.floor((stats.kills_bedwars / stats.deaths_bedwars) * 100) /
            100}`
        )
        .addField("Final Kills", `${stats.final_kills_bedwars || 0}`, true)
        .addField("Final Deaths", `${stats.final_deaths_bedwars || 0}`, true)
        .addField(
          "Final Kill/Death Ratio",
          `${Math.floor(
            (stats.final_kills_bedwars / stats.final_deaths_bedwars) * 100
          ) / 100}`
        )
        .addField("Wins", `${stats.wins_bedwars || 0}`, true)
        .addField("Losses", `${stats.losses_bedwars || 0}`, true)
        .addField(
          "Win/Loss Ratio",
          `${Math.floor((stats.wins_bedwars / stats.losses_bedwars) * 100) /
            100}`
        )
        .addField("Beds Broken", `${stats.beds_broken_bedwars || 0}`, true)
        .addField("Beds Lost", `${stats.beds_lost_bedwars || 0}`, true)
        .addField(
          "Beds Broken/Lost Ratio",
          `${Math.floor(
            (stats.beds_broken_bedwars / stats.beds_lost_bedwars) * 100
          ) / 100}`
        )
        .addField(
          "Average Final Kills/Game",
          `${Math.floor(
            (stats.final_kills_bedwars / stats.games_played_bedwars) * 100
          ) / 100 || 0}`,
          true
        )
        .addField(
          "Average Beds Broken/Game",
          `${Math.floor(
            (stats.beds_broken_bedwars / stats.games_played_bedwars) * 100
          ) / 100 || 0}`,
          true
        )
        .setFooter(
          `UUID: ${player.uuid} | ${client.user.username}`,
          client.user.avatarURL
        )
    );

    for (var i in modes) {
      embeds.push(
        new Discord.RichEmbed()
          .setColor(rankcolor)
          .setThumbnail(thumbnailURL)
          .setTitle(`[${rank}] ${username}`)
          .setDescription(`**Bed Wars | ${modes[i]}**`)
          .setURL(`https://hypixel.net/player/${username}`)
          .addField(
            "Games Played",
            `${stats[`${i}_games_played_bedwars`] || 0}`
          )
          .addField("Kills", `${stats[`${i}_kills_bedwars`] || 0}`, true)
          .addField("Deaths", `${stats[`${i}_deaths_bedwars`] || 0}`, true)
          .addField(
            "Kill/Death Ratio",
            `${Math.floor(
              (stats[`${i}_kills_bedwars`] / stats[`${i}_deaths_bedwars`]) * 100
            ) / 100}`
          )
          .addField(
            "Final Kills",
            `${stats[`${i}_final_kills_bedwars`] || 0}`,
            true
          )
          .addField(
            "Final Deaths",
            `${stats[`${i}_final_deaths_bedwars`] || 0}`,
            true
          )
          .addField(
            "Final Kill/Death Ratio",
            `${Math.floor(
              (stats[`${i}_final_kills_bedwars`] /
                stats[`${i}_final_deaths_bedwars`]) *
                100
            ) / 100}`
          )
          .addField("Wins", `${stats[`${i}_wins_bedwars`] || 0}`, true)
          .addField("Losses", `${stats[`${i}_losses_bedwars`] || 0}`, true)
          .addField(
            "Win/Loss Ratio",
            `${Math.floor(
              (stats[`${i}_wins_bedwars`] / stats[`${i}_losses_bedwars`]) * 100
            ) / 100}`
          )
          .addField(
            "Beds Broken",
            `${stats[`${i}_beds_broken_bedwars`] || 0}`,
            true
          )
          .addField(
            "Beds Lost",
            `${stats[`${i}_beds_lost_bedwars`] || 0}`,
            true
          )
          .addField(
            "Beds Broken/Lost Ratio",
            `${Math.floor(
              (stats[`${i}_beds_broken_bedwars`] /
                stats[`${i}_beds_lost_bedwars`]) *
                100
            ) / 100}`
          )
          .addField(
            "Average Final Kills/Game",
            `${Math.floor(
              (stats[`${i}_final_kills_bedwars`] /
                stats[`${i}_games_played_bedwars`]) *
                100
            ) / 100 || 0}`,
            true
          )
          .addField(
            "Average Beds Broken/Game",
            `${Math.floor(
              (stats[`${i}_beds_broken_bedwars`] /
                stats[`${i}_games_played_bedwars`]) *
                100
            ) / 100 || 0}`,
            true
          )
          .setFooter(
            `UUID: ${player.uuid} | ${client.user.username}`,
            client.user.avatarURL
          )
      );
    }

    await message.channel.send(embeds[0]).then(msg => {
      fn.paginator(message.author.id, msg, embeds, 0, client);
    });

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

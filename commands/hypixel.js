const Discord = require("discord.js"),
  Hypixel = require("hypixel"),
  MojangAPI = require("mojang-api");

const config = require("/app/util/config"),
  fn = require("/app/util/fn");

let hypixel,
  hypixel1 = new Hypixel({ key: process.env.HYAPI1 }),
  hypixel2 = new Hypixel({ key: process.env.HYAPI2 });

module.exports = {
  name: "hypixel",
  usage: "hypixel <username/UUID> [gamemode]",
  description: "Shows Hypixel statistics.",
  category: "Minecraft",
  run: async (client, message, args, shared) => {
    hypixel1.getKeyInfo((err, info) => {
      if (err) hypixel = hypixel2;
      else hypixel = hypixel1;
      init(hypixel);
    });

    function init(hypixel) {
      let rawcontent = message.content.slice(shared.prefix.length + 8).trim();
      if (!rawcontent) {
        return message.channel.send(
          fn.embed(client, {
            title: "Command used incorrectly!",
            description: `Please follow the format below:\n\`${shared.customPrefix}hypixel <username/UUID> [gamemode]\``
          })
        );
      }

      let username = args.shift();
      checkUsername(username);
    }

    function checkUsername(username) {
      hypixel.getPlayerByUsername(username, (err, player) => {
        if (err || player === null) {
          checkUuid(username);
        } else {
          MojangAPI.nameToUuid(username, function(err, res) {
            if (err) console.log(err);
            else checkGuildInfo(res[0].name, res[0].id, player);
          });
        }
      });
    }

    function checkUuid(Uuid) {
      hypixel.getPlayer(Uuid, (err, player) => {
        if (err || player === null) {
          return message.channel.send(
            fn.embed(client, {
              title: "Username/UUID not found!",
              description: `Please follow the format below:\n\`${shared.customPrefix}hypixel <username/UUID> [gamemode]\``
            })
          );
        } else {
          MojangAPI.profile(Uuid, function(err, res) {
            if (err) console.log(err);
            else checkGuildInfo(res.name, res.id, player);
          });
        }
      });
    }

    function checkGuildInfo(username, uuid, player) {
      hypixel.findGuildByPlayer(uuid, (err, guildId) => {
        if (err || guildId === null || guildId === undefined) console.log(err);
        else
          hypixel.getGuild(guildId, (err, guild) => {
            if (err || guild === null || guild === undefined) console.log(err);
            else checkGamemode(username, player, guild);
          });
      });
    }

    function checkGamemode(username, player, guildInfo) {
      let rank,
        rankcolor,
        thumbnailURL =
          "https://cdn.glitch.com/018cc8ba-350d-4bd4-847b-a54addad6e97%2FHypixel-Thumbnail.png?v=1582188330345";
      if (player.prefix === "§c[OWNER]") {
        rank = "OWNER";
        rankcolor = "RED";
      } else if (player.prefix === "§c[SLOTH]") {
        rank = "SLOTH";
        rankcolor = "RED";
      } else if (player.prefix === "§c[ANGUS]") {
        rank = "ANGUS";
        rankcolor = "RED";
      } else if (player.prefix === "§3[MIXER]") {
        rank = "MIXER";
        rankcolor = "RED";
      } else if (player.prefix === "§6[APPLE]") {
        rank = "APPLE";
        rankcolor = "RED";
      } else if (player.prefix === "§6[EVENTS]") {
        rank = "EVENTS";
        rankcolor = "GOLD";
      } else if (player.prefix === "§6[MOJANG]") {
        rank = "MOJANG";
        rankcolor = "GOLD";
      } else if (player.prefix === "§d[PIG§b+++§d]") {
        rank = "PIG+++";
        rankcolor = "0xFF69B4";
      } else if (player.prefix === "§3[BUILD TEAM]") {
        rank = "BUILD TEAM";
        rankcolor = "DARK_AQUA";
      } else if (player.rank && player.rank !== "NORMAL") {
        if (player.rank === "HELPER") {
          rank = "HELPER";
          rankcolor = "DARK_BLUE";
        } else if (player.rank === "MODERATOR") {
          rank = "MOD";
          rankcolor = "DARK_GREEN";
        } else if (player.rank === "YOUTUBER") {
          rank = "YOUTUBE";
          rankcolor = "RED";
        } else {
          rank = `[${player.rank}]`;
          rankcolor = "RED";
        }
      } else if (player.monthlyPackageRank === "SUPERSTAR") {
        rank = "MVP++";
        if (player.rankPlusColor === "WHITE") rankcolor = "0xfefefe";
        else if ((player.rankPlusColor === undefined) | null)
          rankcolor = "0xFF4f4f";
        else rankcolor = player.rankPlusColor;
        thumbnailURL =
          "https://cdn.glitch.com/018cc8ba-350d-4bd4-847b-a54addad6e97%2FMVP%2B%2B.png?v=1582193229141";
      } else if (player.newPackageRank === "MVP_PLUS") {
        rank = "MVP+";
        if (player.rankPlusColor === "WHITE") rankcolor = "0xfefefe";
        else if ((player.rankPlusColor === undefined) | null)
          rankcolor = "0xFF4f4f";
        else rankcolor = player.rankPlusColor;
        thumbnailURL =
          "https://cdn.glitch.com/018cc8ba-350d-4bd4-847b-a54addad6e97%2FMVP%2B.png?v=1582193204722";
      } else if (player.newPackageRank === "MVP") {
        rank = "MVP";
        rankcolor = "AQUA";
        thumbnailURL =
          "https://cdn.glitch.com/018cc8ba-350d-4bd4-847b-a54addad6e97%2FMVP.png?v=1582193204571";
      } else if (player.newPackageRank === "VIP_PLUS") {
        rank = "VIP+";
        rankcolor = "GREEN";
        thumbnailURL =
          "https://cdn.glitch.com/018cc8ba-350d-4bd4-847b-a54addad6e97%2FVIP%2B.png?v=1582193202907";
      } else if (player.newPackageRank === "VIP") {
        rank = "VIP";
        rankcolor = "GREEN";
        thumbnailURL =
          "https://cdn.glitch.com/018cc8ba-350d-4bd4-847b-a54addad6e97%2FVIP.png?v=1582193202255";
      } else {
        rank = "NON";
        rankcolor = "0x505050";
      }
      let gamemode = message.content
        .slice(shared.prefix.length + 8 + username.length)
        .trim();
      if (!player[gamemode] || !gamemode) {
        let netlvl =
          Math.round(
            ((Math.sqrt(player.networkExp + 15312.5) - 125 / Math.sqrt(2)) /
              (25 * Math.sqrt(2))) *
              10
          ) / 10;
        let guildName = guildInfo.name;
        let embed = new Discord.RichEmbed()
          .setColor(rankcolor)
          .setThumbnail(thumbnailURL)
          .setTitle(`[${rank}] ${username}`)
          .setURL(`https://hypixel.net/player/${username}`)
          .addField("Rank", `\`${rank}\``, true)
          .addField("Level", `\`${netlvl}\``, true)
          .addField("Karma", `\`${player.karma}\``, true)
          .addField("First Login", `\`${fn.date(player.firstLogin)} (${fn.ago(player.firstLogin)})\``)
          .addField("Last Login", `\`${fn.date(player.lastLogin)} (${fn.ago(player.lastLogin)})\``)
          .addField("Discord", player.socialMedia.links.DISCORD, true)
          .addField(
            "Guild",
            `[${guildName}](https://hypixel.net/guilds/${guildName.replace(
              " ",
              "%20"
            )})`,
            true
          )
          .addField("Forums", `[View forum account](${player.socialMedia.links.HYPIXEL})`)
          .setFooter(
            `UUID: ${player.uuid} | ${client.user.username}`,
            client.user.avatarURL
          );
        return message.channel.send(embed);
      }
    }
  }
};

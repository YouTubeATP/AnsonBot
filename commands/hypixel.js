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
            else checkGamemode(res[0].name, player);
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
            else checkGamemode(res.name, player);
          });
        }
      });
    }

    function checkGamemode(username, player) {
      console.log(player.rank);
      let rank,
        rankcolor,
        thumbnailURL =
          "https://cdn.glitch.com/018cc8ba-350d-4bd4-847b-a54addad6e97%2FHypixel-Thumbnail.png?v=1582188330345";
      if (player.prefix === "§d[PIG§b+++§d]") {
        rank = "[PIG+++]";
        rankcolor = "0xFF69B4";
        thumbnailURL;
      } else if (player.rank !== "NORMAL") {
        if (player.rank === "HELPER") {
          rank = "[HELPER]";
          rankcolor = "BLUE";
        } else if (player.rank === "MODERATOR") {
          rank = "[MOD]";
          rankcolor = "DARK_GREEN";
        } else if (player.rank === "YOUTUBER") rank = "[YOUTUBE]";
        else {
          rank = `[${player.rank}]`;
        rankcolor = "RED";
        thumbnailURL;
      } else if (player.monthlyPackageRank === "SUPERSTAR") {
        rank = "[MVP++]";
        if (player.rankPlusColor === "WHITE") rankcolor = "0xfefefe";
        else rankcolor = player.rankPlusColor;
      } else if (player.newPackageRank === "MVP_PLUS") {
        rank = "[MVP+]";
        if (player.rankPlusColor === "WHITE") rankcolor = "0xfefefe";
        else rankcolor = player.rankPlusColor;
      } else if (player.newPackageRank === "MVP") {
        rank = "[MVP]";
        rankcolor = "AQUA";
      } else if (player.newPackageRank === "VIP_PLUS") {
        rank = "[VIP+]";
        rankcolor = "GREEN";
      } else if (player.newPackageRank === "VIP") {
        rank = "[VIP]";
        rankcolor = "GREEN";
      } else {
        rank = "[NON]";
        rankcolor = "0x505050";
      }
      let gamemode = message.content
        .slice(shared.prefix.length + 8 + username.length)
        .trim();
      if (!player[gamemode] || !gamemode) {
        let embed = new Discord.RichEmbed()
          .setColor(rankcolor)
          .setThumbnail(client.user.avatarURL)
          .setTitle(`${rank} ${username}`)
          .setDescription("test")
          .setFooter(client.user.username, client.user.avatarURL)
          .setTimestamp();
        return message.channel.send(embed);
      }
    }
  }
};

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
            else checkGamemode(username, player);
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
      let rank, rankcolor;
      if (player.prefix === "§d[PIG§b+++§d]") {
        rank = "[PIG+++]";
        rankcolor = "PINK";
      } else if (player.rank === "YOUTUBER") {
        rank = "[YouTube]";
        rankcolor = "RED";
      } else if (player.monthlyPackageRank === "SUPERSTAR") {
        rank = "[MVP++]";
        if (player.rankPlusColor === "WHITE") rankcolor = "fefefe";
        else rankcolor = player.rankPlusColor;
      } else if (player.newPackageRank === "MVP_PLUS") {
        rank = "[MVP+]";
        if (player.rankPlusColor === "WHITE") rankcolor = "fefefe";
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
        rank = "[Default]";
        rankcolor = "GRAY";
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

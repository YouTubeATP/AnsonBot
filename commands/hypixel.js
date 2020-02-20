const Discord = require("discord.js"),
  hypixel = require("hypixeljs");

const config = require("/app/util/config"),
  fn = require("/app/util/fn");

hypixel.login([process.env.HYAPI1, process.env.HYAPI2]);

module.exports = {
  name: "hypixel",
  usage: "hypixel <username/UUID> [gamemode]",
  description: "Shows Hypixel statistics.",
  category: "Minecraft",
  run: async (client, message, args, shared) => {
    let rawcontent = message.content.slice(shared.prefix.length + 8).trim();
    if (!rawcontent) {
      return message.channel
        .send(
          fn.embed(client, {
            title: "Command used incorrectly!",
            description: `Please follow the format below:\n\`${shared.customPrefix}hypixel <username/UUID> [gamemode]\``
          })
        )
        .then(() => message.delete());
    }

    let username = args.shift();
    checkUsername(username);

    function checkUsername(username) {
      hypixel.getPlayer.byName(username, (err, player) => {
        if (err) {
          checkUuid(username);
        }
        checkGamemode(player);
      });
    }

    function checkUuid(username) {
      hypixel.getPlayer.byUuid(username, (err, player) => {
        if (err) {
          return message.channel
            .send(
              fn.embed(client, {
                title: "Username/UUID not found!",
                description: `Please follow the format below:\n\`${shared.customPrefix}hypixel <username/UUID> [gamemode]\``
              })
            )
            .then(() => message.delete());
        }
        checkGamemode(player);
      });
    }

    function checkGamemode(player) {
      let gamemode = message.content
        .slice(shared.prefix.length + 8 + username.length)
        .trim();
      if (!player[gamemode] || !gamemode) {
        let embed = new Discord.RichEmbed()
          .setColor(shared.embedColor)
          .setThumbnail(client.user.avatarURL)
          .setTitle(`${player.rank}${username}`)
          .setDescription("test")
          .setFooter(client.user.username, client.user.avatarURL)
          .setTimestamp();
        message.channel.send(embed).then(() => message.delete());
      }
    }
  }
};

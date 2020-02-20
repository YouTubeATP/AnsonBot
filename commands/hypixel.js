const Discord = require("discord.js"),
  Hypixel = require("hypixel");

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
    }

    function checkUsername(username) {
      hypixel.getPlayer(username, (err, player) => {
        if (err) {
          console.log(err);
        }
        checkGamemode(player.username, player);
      });
    }

    function checkGamemode(username, player) {
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

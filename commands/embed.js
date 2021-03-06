const Discord = require("discord.js");

const config = require("/app/util/config"),
  fn = require("/app/util/fn");

module.exports = {
  name: "embed",
  usage: "embed [color] <message>",
  description: "Embeds your message.",
  category: "Utility",
  run: async (client, message, args, shared) => {
    let i;

    function sayEmbed(message, args) {
      let color = args.shift();
      let content = message.content.slice(shared.prefix.length + 12).trim();
      let rawcontent = message.content.slice(shared.prefix.length + 5).trim();

      if (!rawcontent) {
        message.delete();
        return message.reply("you cannot embed an empty message.");
      }

      if (
        !content &&
        color.length == 6 &&
        ((color[0] >= "0" && color[0] <= "9") ||
          (color[0] >= "a" && color[0] <= "f") ||
          (color[0] >= "A" && color[0] <= "F")) &&
        ((color[1] >= "0" && color[1] <= "9") ||
          (color[1] >= "a" && color[1] <= "f") ||
          (color[1] >= "A" && color[1] <= "F")) &&
        ((color[2] >= "0" && color[2] <= "9") ||
          (color[2] >= "a" && color[2] <= "f") ||
          (color[2] >= "A" && color[2] <= "F")) &&
        ((color[3] >= "0" && color[3] <= "9") ||
          (color[3] >= "a" && color[3] <= "f") ||
          (color[3] >= "A" && color[3] <= "F")) &&
        ((color[4] >= "0" && color[4] <= "9") ||
          (color[4] >= "a" && color[4] <= "f") ||
          (color[4] >= "A" && color[4] <= "F")) &&
        ((color[5] >= "0" && color[5] <= "9") ||
          (color[5] >= "a" && color[5] <= "f") ||
          (color[5] >= "A" && color[5] <= "F"))
      ) {
        message.delete();
        return message.reply("you cannot embed an empty message.");
      } else if (
        color.length == 6 &&
        ((color[0] >= "0" && color[0] <= "9") ||
          (color[0] >= "a" && color[0] <= "f") ||
          (color[0] >= "A" && color[0] <= "F")) &&
        ((color[1] >= "0" && color[1] <= "9") ||
          (color[1] >= "a" && color[1] <= "f") ||
          (color[1] >= "A" && color[1] <= "F")) &&
        ((color[2] >= "0" && color[2] <= "9") ||
          (color[2] >= "a" && color[2] <= "f") ||
          (color[2] >= "A" && color[2] <= "F")) &&
        ((color[3] >= "0" && color[3] <= "9") ||
          (color[3] >= "a" && color[3] <= "f") ||
          (color[3] >= "A" && color[3] <= "F")) &&
        ((color[4] >= "0" && color[4] <= "9") ||
          (color[4] >= "a" && color[4] <= "f") ||
          (color[4] >= "A" && color[4] <= "F")) &&
        ((color[5] >= "0" && color[5] <= "9") ||
          (color[5] >= "a" && color[5] <= "f") ||
          (color[5] >= "A" && color[5] <= "F"))
      ) {
        color = parseInt(`0x${color}`);
        var embed = new Discord.MessageEmbed()
          .setAuthor(message.author.tag, message.author.avatarURL())
          .setColor(color)
          .setDescription(content)
          .setFooter(client.user.username, client.user.avatarURL())
          .setTimestamp();
        message.channel
          .send(embed)
          .then(message.delete())
          .catch(e => {
            shared.printError(message, e, `I couldn't make your embed!`);
          });
      } else {
        var embed = new Discord.MessageEmbed()
          .setAuthor(message.author.tag, message.author.avatarURL())
          .setDescription(rawcontent)
          .setFooter(client.user.username, client.user.avatarURL())
          .setTimestamp();
        message.channel
          .send(embed)
          .then(message.delete())
          .catch(e => {
            shared.printError(message, e, `I couldn't make your embed!`);
          });
      }
    }

    if (shared.censor === "on") {
      for (i = 0; i < shared.bannedwords.length; i++) {
        if (message.content.toLowerCase().includes(shared.bannedwords[i])) {
          message.delete().catch(O_o => {});
          return message
            .reply("please refrain from using such contemptable words.")
            .then(m => m.delete({ timeout: 5000 }));
        }
      }

      sayEmbed(message, args);
    } else {
      sayEmbed(message, args);
    }
  }
};

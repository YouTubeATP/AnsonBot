const Discord = require("discord.js"),
  eightball = require("8ball");

const config = require("/app/util/config"),
  fn = require("/app/util/fn");

module.exports = {
  name: "8ball",
  usage: "8ball <question>",
  description: "Gives you a random fortune.",
  category: "Misc",
  run: async (client, message, args, shared) => {
    let question = message.content.slice(shared.prefix.length + 5).trim();
    if (!question) {
      let embed = new Discord.RichEmbed()
        .setColor("RED")
        .setAuthor(message.author.tag, message.author.avatarURL)
        .setThumbnail(client.user.displayAvatarURL)
        .setTitle(`No question provided! | :8ball:`)
        .setDescription("Provide a question and try again.")
        .setFooter(client.user.username, client.user.avatarURL)
        .setTimestamp();

      return message.channel.send(embed);
    } else {
      let embed = new Discord.RichEmbed()
        .setColor(config.embedColor)
        .setAuthor(message.author.tag, message.author.avatarURL)
        .setThumbnail(client.user.displayAvatarURL)
        .setTitle(`${question} | :8ball:`)
        .setDescription(eightball)
        .setFooter(client.user.username, client.user.avatarURL)
        .setTimestamp();

      return message.channel.send(embed);
    }
  }
};

const Discord = require("discord.js");

const config = require("/app/util/config"),
  fn = require("/app/util/fn"),
  fortunes = require("/app/util/fortunes.json");

module.exports = {
  name: "fortune",
  usage: "fortune",
  aliases: ["cookie"],
  description: "Gives you a random fortune.",
  category: "Misc",
  run: async (client, message, args, shared) => {
    let fortune = fortunes[Math.floor(Math.random() * fortunes.length)];
    let embed = new Discord.RichEmbed()
      .setColor(config.embedColor)
      .setAuthor(message.author.tag, message.author.avatarURL())
      .setDescription(fortune)
      .setFooter(client.user.username, client.user.avatarURL())
      .setTimestamp();

    return message.channel.send(embed);
  }
};

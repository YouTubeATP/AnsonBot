const Discord = require("discord.js");

const config = require("/app/util/config"),
  fn = require("/app/util/fn"),
  fortunes = require("/app/util/fortunes.json");

module.exports = {
  name: "fortune",
  usage: "fortune",
  aliases: ["fortunecookie", "cookie"],
  description: "Gives you a random fortune.",
  category: "Misc",
  run: async (client, message, args, shared) => {
    let fortune = fortunes[Math.floor(Math.random() * fortunes.length)];
    let embed = new Discord.MessageEmbed()
      .setColor(config.embedColor)
      .setAuthor(message.author.tag, message.author.avatarURL())
      .setTitle("Fortune Cookie")
      .setDescription(fortune)
      .setThumbnail(
        "https://cdn.discordapp.com/attachments/503935982945435679/742791616414220288/cookie_PNG13656.png"
      )
      .setFooter(client.user.username, client.user.avatarURL())
      .setTimestamp();

    return message.channel.send(embed);
  }
};

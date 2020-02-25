const Discord = require("discord.js"),
      eightball = require("8ball");

const config = require("/app/util/config"),
  fn = require("/app/util/fn");

module.exports = {
  name: "8ball",
  usage: "8ball",
  aliases: ["8-ball", "eightball", "eight-ball"],
  description: "Gives you a random fortune.",
  category: "Misc",
  run: async (client, message, args, shared) => {
    let fortune = fortunes[Math.floor(Math.random() * fortunes.length)];
    let embed = new Discord.RichEmbed()
        .setColor(config.embedColor)
        .setAuthor(message.author.tag, message.author.avatarURL)
        .setThumbnail(client.user.displayAvatarURL)
        .setDescription(fortune)
        .setFooter(client.user.username, client.user.avatarURL);

      return message.channel.send(embed);
  }
};

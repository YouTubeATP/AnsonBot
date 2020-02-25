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
    var nope = new Discord.RichEmbed()
        .setColor("RED")
        .setAuthor(message.author.tag, message.author.avatarURL)
        .setThumbnail(client.user.displayAvatarURL)
        .setTitle("You can't play a playlist right now!")
        .setDescription(
          "We're finding the most efficient way to support this in the future. For now, however, sorry for the inconvenience caused."
        )
        .setFooter(client.user.username, client.user.avatarURL);

      return message.channel.send(nope).then(m => m.delete(10000));
  }
};

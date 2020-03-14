const Discord = require("discord.js");

const config = require("/app/util/config"),
  fn = require("/app/util/fn");

module.exports = {
  name: "ping",
  usage: "ping",
  aliases: ["pong"],
  description: "Pings the bot and shows its latency.",
  category: "Utility",
  run: async (client, message, args, shared) => {
    message.channel.send("Pinging...").then(m => {
      let pingMessage = `Latency: \`${Math.round(client.ping)}\`ms`;
      let embed = new Discord.MessageEmbed()
        .setColor("GREEN")
        .setAuthor(message.author.tag, message.author.avatarURL())
        .setThumbnail(client.user.avatarURL())
        .setTitle("Ping Received!")
        .setDescription(pingMessage)
        .setFooter(client.user.username, client.user.avatarURL())
        .setTimestamp();

      message.channel
        .send(embed)
        .then(msg => {
          m.delete();
          message.delete();
          msg.delete(5000);
        })
        .catch(console.error);
    });
  }
};

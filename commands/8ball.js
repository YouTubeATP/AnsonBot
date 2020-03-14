const Discord = require("discord.js");

const config = require("/app/util/config"),
  fn = require("/app/util/fn"),
  eightball = require("/app/util/8ball.json");

let i;

module.exports = {
  name: "8ball",
  usage: "8ball <question>",
  aliases: ["8-ball", "eightball", "eight-ball"],
  description: "Have the trusty 8-ball answer all your questions!",
  category: "Misc",
  run: async (client, message, args, shared) => {
    let command = message.content
      .trim()
      .slice(shared.prefix.length)
      .split(/\s+/u)[0];
    let question = message.content
      .slice(shared.prefix.length + command.length + 1)
      .trim();
    if (!question) {
      let embed = new Discord.RichEmbed()
        .setColor("RED")
        .setAuthor(message.author.tag, message.author.avatarURL())
        .setThumbnail(
          "https://cdn.glitch.com/018cc8ba-350d-4bd4-847b-a54addad6e97%2F33571_preview.png?v=1582621594066"
        )
        .setTitle(`No question provided!`)
        .setDescription("Provide a question and try again.")
        .setFooter(client.user.username, client.user.avatarURL())
        .setTimestamp();

      return message.channel.send(embed);
    } else {
      question = question[0].toUpperCase() + question.slice(1);
      let mentions = message.mentions.users.array();
      if (mentions)
        for (i = 0; i < mentions.length; i++) {
          question = question.replace(`<@${mentions[i].id}>`, mentions[i].tag);
          question = question.replace(`<@!${mentions[i].id}>`, mentions[i].tag);
        }
      if (question.endsWith("." | "," | ":" | ";"))
        question = question.slice(0, -1);
      if (!question.endsWith("?")) question = `${question}?`;
      question = question.replace(" i ", " I ");
      question = question.replace(" i?", " I?");
      let answer = eightball[Math.floor(Math.random() * eightball.length)];
      let embed = new Discord.RichEmbed()
        .setColor(config.embedColor)
        .setAuthor(message.author.tag, message.author.avatarURL())
        .setThumbnail(
          "https://cdn.glitch.com/018cc8ba-350d-4bd4-847b-a54addad6e97%2F33571_preview.png?v=1582621594066"
        )
        .setTitle(question)
        .setDescription(answer)
        .setFooter(client.user.username, client.user.avatarURL())
        .setTimestamp();

      return message.channel.send(embed);
    }
  }
};

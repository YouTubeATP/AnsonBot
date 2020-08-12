const Discord = require("discord.js"),
  db = require("quick.db"),
  moment = require("moment");

const userData = new db.table("USERDATA"),
  guildData = new db.table("GUILDDATA"),
  modCases = new db.table("MODCASES"),
  botData = new db.table("BOTDATA");

const config = require("/app/util/config"),
  fn = require("/app/util/fn");

module.exports = {
  name: "eval",
  usage: "eval <code>",
  description: "Evaluates JavaScript code.",
  category: "Bot Staff",
  botStaffOnly: true,
  run: async (client, message, args, shared) => {
    const msg = message,
      bot = client;

    let modifier = "-e";

    if (
      args[args.length - 1] == "-t" ||
      args[args.length - 1] == "-l" ||
      args[args.length - 1] == "-e"
    ) {
      modifier = args.pop();
    }

    try {
      var out = eval(args.join(" "));
      out = JSON.stringify(out);

      if (modifier == "-e" && out.length <= 1024 - 8)
        message.channel
          .send(
            new Discord.MessageEmbed()
              .setColor("GREEN")
              .setTitle(
                `<:yes:743138102943416351> Evaluation Success!`
              )
              .addField(`Expression`, "```js\n" + args.join(" ") + "```")
              .addField(`Result`, "```js\n" + out + "```")
              .setFooter(client.user.username, client.user.avatarURL())
          )
          .catch(console.error);
      else if (
        out.length <= 2000 - 8 &&
        (modifier == "-t" || (modifier == "-e" && out.length > 1024 - 8))
      )
        message.channel.send("```js\n" + out + "```");
      else if ((modifier = "-l"))
        console.log(`${fn.time()} | Evaluation Result | ${out}`);
      else {
        console.log(`${fn.time()} | Evaluation Result | ${out}`);
        message.channel
          .send(
            new Discord.MessageEmbed()
              .setColor("GREEN")
              .setTitle(
                `<:yes:743138102943416351> Evaluation Success!`
              )
              .addField(`Expression`, "```js\n" + args.join(" ") + "```")
              .addField(
                `Result`,
                "```js\nOutput too long. Check console log.```"
              )
              .setFooter(client.user.username, client.user.avatarURL())
          )
          .catch(console.error);
      }
    } catch (e) {
      var embed = new Discord.MessageEmbed()
        .setColor("RED")
        .setTitle(
          `<:no:743138103195205763> Evaluation Failed!`
        )
        .addField(`Expression`, "```js\n" + args.join(" ") + "```")
        .addField(`Error Message`, "```js\n" + e + "```")
        .setFooter(client.user.username, client.user.avatarURL());
      message.channel.send(embed).catch(console.error);
    }
  }
};

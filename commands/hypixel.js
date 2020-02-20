const Discord = require("discord.js"),
  hypixel = require("hypixeljs");

const config = require("/app/util/config"),
  fn = require("/app/util/fn");

hypixel.login([
  "e41bf3c0-fc9a-4e72-b5ae-54135818622a",
  "493776b7-4ac3-43a2-bf52-b051a34ee654"
]);

module.exports = {
  name: "hypixel",
  usage: "hypixel <username> [gamemode]",
  description: "Shows Hypixel statistics.",
  category: "Minecraft",
  run: async (client, message, args, shared) => {
    let rawcontent = message.content.slice(shared.prefix.length + 7).trim();
    if (!rawcontent) {
      message.delete();
      return message.channel.send(
        fn.embed(client, {
          title: "Command used incorrectly!",
          description: `Please follow the format as shown below:\n\`${shared.customPrefix}hypixel <username> [gamemode]\``
        })
      );
    }
    let username = args.shift();
    let gamemode = message.content
      .slice(shared.prefix.length + 7 + username.length)
      .trim();
  }
};

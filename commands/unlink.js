const Discord = require("discord.js"),
  Hypixel = require("hypixel"),
  Enmap = require("enmap");

const config = require("/app/util/config"),
  fn = require("/app/util/fn"),
  shared = require("/app/index.js");

const talkedRecently = new Set();

const MinecraftUUID = shared.Minecraft

let hypixel,
  hypixel1 = new Hypixel({ key: process.env.HYAPI1 }),
  hypixel2 = new Hypixel({ key: process.env.HYAPI2 });

module.exports = {
  name: "unlink",
  usage: "unlink",
  description: `If your Mojang account is linked to your Discord account, it will be unlinked.\n\nLinking your Mojang account to the bot:\n1. In Minecraft Java Edition, join \`mc.hypixel.net\`.\n2. Switch to slot 2 (My Profile) and right click.\n3. Left-click on the icon at row 3, column 4 (Social Media).\n4. Left-click on the icon at row 4, column 8 (Discord).\n5. The game will prompt you to paste the required information in chat. Paste in your Discord username and discriminator in \`User#9999\` format.\n6. Return to Discord and use the command \`link <your username>\`.`,
  category: "Minecraft",
  run: async (client, message, args, shared) => {
    let nameOrID = args[0],
      rawcontent = message.content.slice(shared.prefix.length + 8).trim();

    if (talkedRecently.has(message.author.id)) {
      message.channel.send(
        fn.embed(client, {
          title: "Woah! Slow down!",
          description:
            "This command has a cooldown. Wait a bit before trying again."
        })
      );
    } else {
      talkedRecently.add(message.author.id);
      await MinecraftUUID.defer;
      console.log("MinecraftUUID: " + MinecraftUUID.size + " keys loaded");
      if (MinecraftUUID.get(message.author.id)) {
        MinecraftUUID.delete(message.author.id);
        message.channel.send(
          fn.embed(client, {
            title: "Mojang account unlinked!",
            description: `The Minecraft Java user associated with ${message.author} is no longer linked.`
          })
        );
      } else
        message.channel.send(
          fn.embed(client, {
            title: "No Mojang account linked!",
            description: `No Minecraft Java user was found associated with ${message.author}.\n\nLinking your Mojang account to the bot:\n1. In Minecraft Java Edition, join \`mc.hypixel.net\`.\n2. Switch to slot 2 (My Profile) and right click.\n3. Left-click on the icon at row 3, column 4 (Social Media).\n4. Left-click on the icon at row 4, column 8 (Discord).\n5. The game will prompt you to paste the required information in chat. Paste in your Discord username and discriminator in \`User#9999\` format.\n6. Return to Discord and use the command \`hypixel <your username>\`.`
          })
        );
      setTimeout(() => {
        talkedRecently.delete(message.author.id);
      }, 5000);
    }
  }
};

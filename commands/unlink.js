const Discord = require("discord.js"),
  Hypixel = require("hypixel"),
  Enmap = require("enmap");

const config = require("/app/util/config"),
  fn = require("/app/util/fn"),
  shared = require("/app/index.js");

const talkedRecently = new Set();

const MinecraftUUID = new Enmap({
  name: "link",
  fetchAll: false,
  autoFetch: true,
  cloneLevel: "deep"
});

let hypixel,
  hypixel1 = new Hypixel({ key: process.env.HYAPI1 }),
  hypixel2 = new Hypixel({ key: process.env.HYAPI2 });

module.exports = {
  name: "unlink",
  usage: "unlink",
  description: `If your Mojang account is linked to your Discord account, it will be unlinked.\n\nLinking your Mojang account to the bot:\n1. In Minecraft Jave Edition, join \`mc.hypixel.net\`.\n2.Switch to slot 2 (My Profile) and right click.\n3.Left-click on the icon at row 3, column 4 (Social Media).\n4. Left-click on the icon at row 4, column 8 (Discord).\n5. The game will prompt you to paste the required information in chat. Paste in your Discord username and discriminator in \`User#9999\` format.\n6. Return to Discord and use the command \`hypixel <your username>\`.`,
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
      
      setTimeout(() => {
        talkedRecently.delete(message.author.id);
      }, 5000);
    }

    function init() {
      if (!rawcontent) {
        if (MinecraftUUID.get(message.member.id) === null) {
          return message.channel.send(
            fn.embed(client, {
              title: "Command used incorrectly!",
              description: `Please follow the format below:\n\`${shared.customPrefix}hypixel <username/UUID> [gamemode]\``
            })
          );
        } else checkUuid(MinecraftUUID.get(message.member.id));
      } else checkUsername(nameOrID);
    }

    function checkUsername(nameOrID) {
      hypixel.getPlayerByUsername(nameOrID, (err, player) => {
        if (err || player === null) {
          checkUuid(nameOrID);
        } else skin(player.displayname, player.uuid, player);
      });
    }

    function checkUuid(Uuid) {
      hypixel.getPlayer(Uuid, (err, player) => {
        if (err || player === null) {
          if (MinecraftUUID.get(message.member.id) === null) {
            return message.channel.send(
              fn.embed(client, {
                title: "Username/UUID not found!",
                description: `Please follow the format below:\n\`${shared.customPrefix}hypixel <username/UUID> [gamemode]\``
              })
            );
          } else checkUuid(MinecraftUUID.get(message.member.id));
        } else skin(player.displayname, player.uuid, player);
      });
    }

    function skin(username, uuid, player) {
      let thumbnailURL = `https://visage.surgeplay.com/face/${uuid}`,
        modelURL = `https://visage.surgeplay.com/full/${uuid}`,
        skinURL = `https://visage.surgeplay.com/skin/${uuid}`;
      let embed = new Discord.RichEmbed()
        .setColor(config.embedColor)
        .setThumbnail(thumbnailURL)
        .setTitle(username)
        .setURL(skinURL)
        .setDescription("Click on the hyperlink above to download this skin.")
        .setImage(modelURL)
        .setFooter(
          `UUID: ${player.uuid} | ${client.user.username}`,
          client.user.avatarURL
        );
      return message.channel.send(embed);
    }
  }
};

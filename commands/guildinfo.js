const Discord = require("discord.js"),
  db = require("quick.db"),
  moment = require("moment");

const config = require("/app/util/config"),
  fn = require("/app/util/fn");

const userData = new db.table("USERDATA"),
  guildData = new db.table("GUILDDATA"),
  modCases = new db.table("MODCASES");

module.exports = {
  name: "guildinfo",
  usage: "guildinfo",
  description: "Shows information about the guild.",
  category: "Utility",
  aliases: ["serverinfo", "guild", "server"],
  guildPerms: ["SEND_MESSAGES"],
  run: async (client, message, args, shared) => {
    let guild = message.guild;
    if (shared.user.botStaff && args.length)
      guild = client.guilds.find(
        g =>
          g.id == args[0] ||
          g.name.toLowerCase().startsWith(args.join(" ").toLowerCase())
      );

    let embed = new Discord.MessageEmbed()
      .setColor(config.embedColor)
      .setTitle(`${guild} | Information`)
      .setThumbnail(guild.iconURL())
      .addField("Name", `${guild}`, true)
      .addField("Owner", `${guild.owner}`, true)
      .addField("Region", `${guild.region}`, true)
      .addField(
        "Created",
        `${fn.date(guild.createdAt)} (${fn.ago(guild.createdAt)})`
      )
      .addField(
        `Member${guild.members.cache.size == 1 ? "" : "s"} [${guild.members.cache.size}]`,
        `${guild.members.cache.filter(member => !member.user.bot).size} Human${
          guild.members.cache.filter(member => !member.user.bot).size == 1
            ? ""
            : "s"
        } (${
          guild.members.cache.filter(
            member =>
              !member.user.bot && member.user.presence.status != "offline"
          ).size
        } Online)\n${
          guild.members.cache.filter(member => member.user.bot).size
        } Bot${
          guild.members.cache.filter(member => member.user.bot).size == 1
            ? ""
            : "s"
        }`,
        true
      )
      .addField(
        `Channel${guild.channels.cache.size == 1 ? "" : "s"} [${
          guild.channels.cache.size
        }]`,
        `${
          guild.channels.cache.filter(
            channel =>
              channel.type == "text" ||
              channel.type == "news" ||
              channel.type == "store"
          ).size
        } Text Channel${
          guild.channels.cache.filter(
            channel =>
              channel.type == "text" ||
              channel.type == "news" ||
              channel.type == "store"
          ).size == 1
            ? ""
            : "s"
        }\n${
          guild.channels.cache.filter(channel => channel.type == "voice").size
        } Voice Channel${
          guild.channels.cache.filter(channel => channel.type == "voice")
            .size == 1
            ? ""
            : "s"
        }\n${
          guild.channels.cache.filter(channel => channel.type == "category")
            .size
        } Categor${
          guild.channels.cache.filter(channel => channel.type == "category")
            .size == 1
            ? "y"
            : "ies"
        }`,
        true
      )
      .addField(
        `Role${guild.roles.cache.size == 1 ? "" : "s"}${
          guild.channels.cache.size <= 44 ? ` [${guild.roles.cache.size}]` : ""
        }`,
        `${
          guild.roles.cache.size <= 43
            ? guild.roles.cache
                .sort((a, b) => {
                  if (a.position < b.position) return 1;
                  if (a.position > b.position) return -1;
                })
                .map(r => `${r}`)
                .join(" ")
            : guild.roles.cache.size - 1
        }`
      )
      .setFooter(
        `ID: ${guild.id} | ${client.user.username}`,
        client.user.avatarURL()
      );

    message.channel.send(embed);
  }
};

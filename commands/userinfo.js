const Discord = require("discord.js"),
  db = require("quick.db"),
  moment = require("moment");

const config = require("/app/util/config"),
  fn = require("/app/util/fn");

const userData = new db.table("USERDATA"),
  guildData = new db.table("GUILDDATA"),
  modCases = new db.table("MODCASES");

let activity = ["Playing", "Streaming", "Listening to", "Watching", ""];
let statuses = {
  online: "Online",
  idle: "Idle",
  dnd: "DND",
  offline: "Offline"
};

module.exports = {
  name: "userinfo",
  usage: "userinfo [user]",
  aliases: ["user"],
  description:
    "Shows information about the provided user, or yourself if none is provided.",
  category: "Utility",
  run: async (client, message, args, shared) => {
    const promises = [
      client.shard.broadcastEval(`this.guilds.cache.size`),
      client.shard.broadcastEval(
        `this.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0)`
      )
    ];
    let target = message.member;
    if (args[0]) target = fn.getMember(message.guild, args[0]);
    if (
      [`<@${client.user.id}> `, `<@!${client.user.id}> `].includes(
        shared.prefix
      ) &&
      message.mentions.members.first().user.id == client.user.id
    )
      target = message.mentions.members.first(2)[1];
    else if (message.mentions.members.size)
      target = message.mentions.members.first();

    if (!target)
      return message.channel.send(
        fn.embed(client, {
          title: "User not found!",
          description:
            "The user you provided is either invalid or a non-cached user."
        })
      );

    if (userData.has(target.user.id)) var user = userData.get(target.user.id);
    else var user = { botStaff: false, blacklisted: false, commandsUsed: 0 };

    if (target.id === client.user.id) {
      return Promise.all(promises).then(results => {
        const totalGuilds = results[0].reduce(
          (prev, guildCount) => prev + guildCount,
          0
        );
        const totalMembers = results[1].reduce(
          (prev, memberCount) => prev + memberCount,
          0
        );

        function getMemoryUsage() {
          let total_rss = require("fs")
            .readFileSync("/sys/fs/cgroup/memory/memory.stat", "utf8")
            .split("\n")
            .filter(l => l.startsWith("total_rss"))[0]
            .split(" ")[1];
          return Math.round(Number(total_rss) / 1e6);
        }
        const bicon = client.user.displayAvatarURL();
        const bot = fn.getMember(message.guild, client.user);
        let embed = new Discord.MessageEmbed()
          .setColor(config.embedColor)
          .setTitle(`${client.user.tag} | Information`)
          .setAuthor(message.author.tag, message.author.avatarURL())
          .setThumbnail(bicon)
          .addField(client.user.bot ? "Bot" : "User", `${client.user}`, true)
          .addField("Custom Prefix", "`" + shared.customPrefix + "`", true)
          .addField(
            "Developers",
            "<@344335337889464357>, <@336389636878368770>",
            true
          )
          .addField(
            client.user.bot ? "Created" : "Joined Discord",
            `${fn.date(client.user.createdAt)} (${fn.ago(
              client.user.createdAt
            )})`
          )
          .addField("Status", `${statuses[client.user.presence.status]}`, true)
          .addField(
            "Presence",
            target.user.presence.activities[0]
              ? `${activity[target.user.presence.activities[0].type]} ${
                  target.user.presence.activities[0].type === "CUSTOM_STATUS"
                    ? target.user.presence.activities[0].state
                    : target.user.presence.activities[0].name
                }`
              : "None",
            true
          )
          .addField(
            `Role${bot.roles.cache.size == 2 ? "" : "s"} [${bot.roles.cache
              .size - 1}]`,
            bot.roles.cache
              .sort((a, b) => {
                if (a.position < b.position) return -1;
                if (a.position > b.position) return 1;
              })
              .map(r => `${r}`)
              .slice(1)
              .reverse()
              .join(" ")
          )
          .addField("Guilds", `\`${totalGuilds}\``, true)
          .addField("Users", `\`${totalMembers}\``, true)
          .addField("Memory Used", `\`${getMemoryUsage()}\`MB`, true)
          .addField("Library", "discord.js")
          .setFooter(
            `ID: ${client.user.id} | ${client.user.username}`,
            client.user.avatarURL()
          );

        return message.channel
          .send(embed)
          .then(message.delete())
          .catch(e => {
            shared.printError(message, e, `I couldn't fetch the bot's info!`);
          });
      });
    } else {
      let embed = new Discord.MessageEmbed()
        .setColor(config.embedColor)
        .setTitle(`${target.user.tag} | Information`)
        .setAuthor(message.author.tag, message.author.avatarURL())
        .setThumbnail(target.user.displayAvatarURL())
        .addField(target.user.bot ? "Bot" : "User", `${target}`, true)
        .addField(
          target.user.bot ? "Created" : "Joined Discord",
          `${fn.date(target.user.createdAt)} (${fn.ago(target.user.createdAt)})`
        )
        .addField("Status", `${statuses[target.user.presence.status]}`, true)
        .addField(
          "Presence",
          target.user.presence.activities[0]
            ? `${activity[target.user.presence.activities[0].type]} ${
                target.user.presence.activities[0].type === "CUSTOM_STATUS"
                  ? target.user.presence.activities[0].state
                  : target.user.presence.activities[0].name
              }`
            : "None",
          true
        )
        .setFooter(
          `ID: ${target.id} | ${client.user.username}`,
          client.user.avatarURL()
        );
      if (target.roles.cache.size > 1)
        embed.addField(
          `Role${target.roles.cache.size == 2 ? "" : "s"} [${target.roles.cache
            .size - 1}]`,
          target.roles.cache
            .sort((a, b) => {
              if (a.position < b.position) return -1;
              if (a.position > b.position) return 1;
            })
            .map(r => `${r}`)
            .slice(1)
            .reverse()
            .join(" ")
        );

      message.channel.send(embed);
    }
  }
};

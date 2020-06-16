const Discord = require("discord.js");

const config = require("/app/util/config"),
  fn = require("/app/util/fn");

let activity = {
  PLAYING: "Playing",
  STREAMING: "Streaming",
  LISTENING: "Listening to",
  WATCHING: "Watching",
  CUSTOM_STATUS: ""
};

let statuses = {
  online: "Online",
  idle: "Idle",
  dnd: "DND",
  offline: "Offline"
};

module.exports = {
  name: "botinfo",
  usage: "botinfo",
  aliases: ["bot", "info", "status"],
  description: "Shows information about the bot.",
  category: "Utility",
  run: async (client, message, args, shared) => {
    const promises = [
      client.shard.broadcastEval(`this.guilds.cache.size`),
      client.shard.broadcastEval(
        `this.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0)`
      )
    ];
    return Promise.all(promises).then(results => {
      const totalGuilds = results[0].reduce(
        (prev, guildCount) => prev + guildCount,
        0
      );
      const totalMembers = results[1].reduce(
        (prev, memberCount) => prev + memberCount,
        0
      );

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
          `${fn.date(client.user.createdAt)} (${fn.ago(client.user.createdAt)})`
        )
        .addField("Status", `${statuses[client.user.presence.status]}`, true)
        .addField(
          "Presence",
          client.user.presence.activities[0]
            ? `${activity[client.user.presence.activities[0].type]} ${
                client.user.presence.activities[0].type === "CUSTOM_STATUS"
                  ? client.user.presence.activities[0].emoji
                    ? !client.user.presence.activities[0].emoji.url ||
                      client.emojis.cache.get(
                        client.user.presence.activities[0].emoji.id
                      )
                      ? `${client.user.presence.activities[0].emoji} ${client.user.presence.activities[0].state}`
                      : client.user.presence.activities[0].state
                    : client.user.presence.activities[0].state
                  : client.user.presence.activities[0].name
              }`
            : "None",
          true
        )
        .addField(
          `Role${bot.roles.cache.size == 2 ? "" : "s"} [${bot.roles.cache.size -
            1}]`,
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
        .addField("Memory Used", `\`${Math.round(process.memoryUsage().rss * 10 / 1024 / 1024) / 10}\`MB`, true)
        .addField("Library", "discord.js")
        .setFooter(
          `ID: ${client.user.id} | ${client.user.username}`,
          client.user.avatarURL()
        );

      message.channel.send(embed).catch(e => {
        shared.printError(message, e, `I couldn't fetch the bot's info!`);
      });
    });
  }
};

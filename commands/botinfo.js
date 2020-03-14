const Discord = require("discord.js");

const config = require("/app/util/config"),
  fn = require("/app/util/fn");

module.exports = {
  name: "botinfo",
  usage: "botinfo",
  aliases: ["bot", "info", "status"],
  description: "Shows information about the bot.",
  category: "Utility",
  run: async (client, message, args, shared) => {
    const promises = [
      client.shard.broadcastEval("this.guilds.size"),
      client.shard.broadcastEval(
        "this.guilds.reduce((prev, guild) => prev + guild.memberCount, 0)"
      )
    ];

    let activities = ["Playing", "Streaming", "Listening to", "Watching", ""];
    let statuses = {
      online: "Online",
      idle: "Idle",
      dnd: "DND",
      offline: "Offline"
    };

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
          `${fn.date(client.user.createdAt)} (${fn.ago(client.user.createdAt)})`
        )
        .addField("Status", `${statuses[client.user.presence.status]}`, true)
        .addField(
          "Presence",
          client.user.presence.game
            ? `${activities[client.user.presence.game.type]} ${
                client.user.presence.game.type == 4
                  ? client.user.presence.game.state
                  : client.user.presence.game.name
              }`
            : "None",
          true
        )
        .addField(
          `Role${bot.roles.size == 2 ? "" : "s"} [${bot.roles.size - 1}]`,
          bot.roles
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

      message.channel
        .send(embed)
        .then(message.delete())
        .catch(e => {
          shared.printError(message, e, `I couldn't fetch the bot's info!`);
        });
    });
  }
};

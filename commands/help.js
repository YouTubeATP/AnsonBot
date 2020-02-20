const Discord = require("discord.js");

const config = require("/app/util/config"),
  fn = require("/app/util/fn"),
  shared = require("/app/index.js");

module.exports = {
  name: "help",
  usage: "help [command]",
  description: "Shows command information.",
  category: "Utility",
  run: async (client, message, args, shared) => {
    const { commands } = message.client;
    let mapped = commands.map(
      command => `${shared.guild.prefix}${command.name}\n`
    );

    let perms = {};
    perms.bot = commands.map(
      command => !(command.botStaffOnly && !shared.user.botStaff)
    );
    perms.guild = commands.map(
      command =>
        !(
          command.guildPerms &&
          !message.member.hasPermission(command.guildPerms)
        )
    );
    let cmdCats = commands.map(command => command.category);

    let userCommands = {};
    for (var i = 0; i < mapped.length; i++) {
      if (perms.bot[i] && perms.guild[i]) {
        if (!userCommands[cmdCats[i]]) userCommands[cmdCats[i]] = [];
        userCommands[cmdCats[i]].push(mapped[i]);
      }
    }

    if (args.length == 0) {
      let embeds = [];
      for (var i in userCommands) {
        embeds.push(
          new Discord.RichEmbed()
            .setTitle(`${i} Commands`)
            .setColor(config.embedColor)
            .setThumbnail(client.user.avatarURL)
            .setDescription(
              userCommands[i].join("") +
                "\nDo `help [command]` to get information about specific commands!"
            )
            .setFooter(client.user.username, client.user.avatarURL)
            .setTimestamp()
        );
      }
      await message.author
        .send(embeds[0])
        .then(msg => {
          let sentEmbed = new Discord.RichEmbed()
            .setColor(config.embedColor)
            .setAuthor(message.author.tag, message.author.avatarURL)
            .setTitle(`Check your DMs!`)
            .setDescription(
              `My interactive help menu has been sent to your DMs.`
            )
            .setThumbnail(client.user.avatarURL)
            .setFooter(client.user.username, client.user.avatarURL)
            .setTimestamp();
          message.channel.send(sentEmbed);
          fn.paginator(message.author.id, msg, embeds, 0, client);
        })
        .catch(err => {
          message.channel.send(
            fn.embed(
              client,
              "I couldn't send my help menu to your DMs! Make sure I have permissions to do so."
            )
          );
        });
    } else {
      const name = args[0].toLowerCase();
      const command =
        commands.get(name) ||
        commands.find(c => c.aliases && c.aliases.includes(name));

      if (!command) {
        let embed = new Discord.RichEmbed()
          .setColor(config.embedColor)
          .setTitle(`I can't recognize this command!`)
          .setDescription(
            `Maybe a typo? Do \`${shared.customPrefix}help\` for a list of available commands.`
          )
          .setThumbnail(message.guild.iconURL)
          .setFooter(client.user.username, client.user.avatarURL)
          .setTimestamp();
        return message.channel.send(embed).then(m => {
          message.delete();
          m.delete(5000);
        });
      }

      if (command.botStaffOnly && !shared.user.botStaff)
        return message.channel.send(
          fn.embed(client, "You do not have permission to use this command!")
        );

      if (
        command.guildPerms &&
        !message.member.hasPermission(command.guildPerms)
      )
        return message.channel.send(
          fn.embed(client, "You do not have permission to use this command!")
        );

      let embed = new Discord.RichEmbed()
        .setColor(config.embedColor)
        .setAuthor(message.author.tag, message.author.avatarURL)
        .setTitle(`Detailed Command Information`)
        .setDescription(`**${shared.customPrefix}${command.name}**`)
        .setThumbnail(client.user.avatarURL)
        .setFooter(client.user.username, client.user.avatarURL)
        .setTimestamp();

      if (command.aliases)
        embed.addField(`Aliases`, command.aliases.join(", "));
      if (command.description)
        embed.addField(`Description`, command.description);
      if (command.usage)
        embed.addField(
          `Usage`,
          typeof command.usage == "string"
            ? `\`${command.usage}\``
            : command.usage.map(i => `\`${i}\``).join("\n")
        );

      message.channel.send(embed).then(message.delete());
    }
  }
};

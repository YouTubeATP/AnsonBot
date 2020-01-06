const Discord = require("discord.js");

const config = require("/app/util/config"),
  fn = require("/app/util/fn");

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
            .setColor(shared.embedColor)
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
          fn.paginator(message.author.id, msg, embeds, 0);
          message.channel
            .send(fn.embed(client, "Check your DMs!"))
            .then(m => m.delete(5000));
        })
        .catch(err => {
          message.channel.send(embed).catch(error => {
            message.channel.send(
              "I can't DM you, nor can I send my help information here!\nThe `Embed Links` permissions is crucial to me, so please enable it whereever I should be!"
            );
          });
        });
    } else {
      const name = args[0].toLowerCase();
      const command =
        commands.get(name) ||
        commands.find(c => c.aliases && c.aliases.includes(name));

      if (!command) {
        return message.reply("that's not a valid command!");
      }

      var embed = new Discord.RichEmbed()
        .setColor(shared.embedColor)
        .setTitle(`Detailed Command Information`)
        .setDescription(`**${shared.prefix}${command.name}**`)
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

const Discord = require("discord.js"),
  db = require("quick.db"),
  moment = require("moment");

const config = require("/app/util/config"),
  fn = require("/app/util/fn");

const userData = new db.table("USERDATA"),
  guildData = new db.table("GUILDDATA"),
  modCases = new db.table("MODCASES");

module.exports = {
  name: "removerole",
  usage: "removerole <user> <role>",
  description: "Removes roles from users.",
  category: "Moderation",
  aliases: ["delrole"],
  guildPerms: ["MANAGE_ROLES"],
  run: async (client, message, args, shared) => {
    if (!args[0])
      return message.channel.send(
        fn.embed(
          client,
          "Please mention the user you want to remove a role from."
        )
      );
    let target = message.mentions.members
      .filter(member => member.user.id != client.user.id)
      .first();
    if (!target) target = fn.getMember(message.guild, args[0]);
    if (!target)
      return message.channel.send(
        fn.embed(
          client,
          "Please mention the user you want to remove a role from."
        )
      );

    if (!args[1])
      return message.channel.send(
        fn.embed(client, "Please mention the role you want to remove.")
      );
    let role = message.mentions.roles
      .filter(role => role.name != "@everyone")
      .first();
    if (!role) role = fn.getRole(message.guild, args[1]);
    if (!role)
      return message.channel.send(
        fn.embed(client, "Please mention the role you want to remove.")
      );

    if (!message.guild.me.hasPermission("MANAGE_ROLES"))
      return message.channel.send(
        fn.embed(client, "I do not have permissions to remove roles.")
      );
    if (role.position >= message.guild.me.roles.highest.position)
      return message.channel.send(
        fn.embed(client, "I do not have permissions to remove this role.")
      );

    target.roles
      .remove(role)
      .then(() => {
        message.channel.send(
          new Discord.MessageEmbed()
            .setColor(config.embedColor)
            .setTitle("Role Removed")
            .setThumbnail(target.user.displayAvatarURL())
            .addField(target.user.bot ? "Bot" : "User", `${target}`)
            .addField("Role", `${role}`)
            .setFooter(client.user.username, client.user.avatarURL())
            .setTimestamp()
        );
      })
      .catch(error => {
        message.channel.send(
          fn.error(
            client,
            `I cannot remove ${role.name} from ${target.user.tag}!`,
            error
          )
        );
      });
  }
};

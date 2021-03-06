const Discord = require("discord.js"),
  db = require("quick.db"),
  moment = require("moment");

const config = require("/app/util/config"),
  fn = require("/app/util/fn");

const userData = new db.table("USERDATA"),
  guildData = new db.table("GUILDDATA"),
  modCases = new db.table("MODCASES");

module.exports = {
  name: "mute",
  usage: "mute <user> [duration] [reason]",
  description:
    "Mute rule-breakers. For duration, use `d` for days, `h` for hours and `m` for minutes without spacing. User is permanently muted if duration is not provided.",
  category: "Moderation",
  guildPerms: ["KICK_MEMBERS"],
  run: async (client, message, args, shared) => {
    if (!args[0])
      return message.channel.send(
        fn.embed(client, "Please mention the user you want to mute.")
      );
    let target = message.mentions.members
      .filter(member => member.user.id != client.user.id)
      .first();
    if (!target) target = fn.getMember(message.guild, args[0]);
    if (!target)
      return message.channel.send(
        fn.embed(client, "Please mention the user you want to mute.")
      );

    if (
      target.hasPermission("BAN_MEMBERS") ||
      target.hasPermission("KICK_MEMBERS") ||
      (target.hasPermission("ADMINISTRATOR") &&
        message.guild.ownerID != message.author.id)
    )
      return message.channel.send(
        fn.embed(client, "You cannot mute a moderator!")
      );

    if (
      target.roles.highest.comparePositionTo(message.member.roles.highest) >= 0 &&
      message.guild.ownerID != message.author.id
    )
      return message.channel.send(
        fn.embed(
          client,
          `You do not have permissions to mute ${target.user.username}!`
        )
      );
    if (
      !message.guild.members.cache.get(client.user.id).hasPermission("MANAGE_ROLES")
    )
      return message.channel.send(
        fn.embed(
          client,
          `I do not have permissions to mute ${target.user.username}!`
        )
      );

    let muteRole = message.guild.roles.cache.get(shared.guild.muteRole);
    if (!muteRole) {
      muteRole = message.guild.roles.cache
        .find(role => role.name.toLowerCase().startsWith("mute"))
        .first();
      if (!muteRole) {
        muteRole = await message.guild.createRole(
          { name: "Muted", color: 0xa8a8a8 },
          `I was told to mute someone when there is no mute role!`
        );
        message.channel.send(
          fn.embed(client, {
            title: `I cannot find a mute role, so I made one for you!`,
            description: `${muteRole}`
          })
        );
      }
      if (!muteRole)
        return message.channel.send(
          fn.embed(client, `I cannot find a mute role, nor can I create one!`)
        );
      guildData.set(`${message.guild.id}.muteRole`, muteRole.id);
    }

    if (target.roles.cache.has(muteRole.id))
      return message.channel.send(
        fn.embed(client, `${target} is already muted!`)
      );

    let modlog = message.guild.channels.cache.find(
      channel => channel.id == shared.guild.modlog
    );

    let cases = [];
    if (modCases.has(message.guild.id)) cases = modCases.get(message.guild.id);

    let time = args[1],
      reason;
    if (!time) reason = "Unspecified";
    else {
      var days = parseInt(time.toLowerCase().match(/\d+d/g));
      var hours = parseInt(time.toLowerCase().match(/\d+h/g));
      var mins = parseInt(time.toLowerCase().match(/\d+m/g));
      if (Number.isNaN(days)) days = 0;
      if (Number.isNaN(hours)) hours = 0;
      if (Number.isNaN(mins)) mins = 0;
      var length = ((days * 24 + hours) * 60 + mins) * 60 * 1000;

      if (Number.isNaN(length) || length == 0)
        reason = args.slice(1).join(" ") || "Unspecified";
      else reason = args.slice(2).join(" ") || "Unspecified";
    }

    if (!time || Number.isNaN(length) || length == 0) {
      let modCase = new fn.ModCase(
        client,
        cases.length + 1,
        "MUTE",
        target,
        message,
        reason
      );
      let embed = fn.modCaseEmbed(client, modCase);

      target
        .roles.add(muteRole)
        .then(() => {
          modCases.push(message.guild.id, modCase);

          console.log(
            `${message.guild.name} | Muted ${target.user.tag} (${target.user.id})`
          );

          if (shared.commandName != "smute") {
            message.channel.send(fn.embed(client, `${target} has been muted!`));
            message.channel.send(embed);
          }

          target.user.send(
            fn.embed(
              client,
              `You have been permanently muted from **${message.guild.name}**!`
            )
          );
          target.user
            .send(embed)
            .catch(error =>
              message.channel.send(
                fn.embed(client, `I cannot DM ${target.user.tag}!`)
              )
            );

          let modlog = message.guild.channels.cache.find(
            channel => channel.id == shared.guild.modlog
          );

          if (modlog) {
            modlog
              .send(embed)
              .catch(() =>
                message.channel.send(
                  fn.embed(client, `I cannot log in ${modlog}!`)
                )
              );
          }
        })
        .catch(error => {
          message.channel.send(
            fn.error(client, `I was unable to give ${muteRole} to ${target}!`)
          );
        });

      return undefined;
    } else {
      let modCase = new fn.ModCase(
        client,
        cases.length + 1,
        "MUTE",
        target,
        message,
        reason,
        length
      );
      let embed = fn.modCaseEmbed(client, modCase);

      target
        .roles.add(muteRole)
        .then(() => {
          modCases.push(message.guild.id, modCase);
          if (!guildData.has(`${message.guild.id}.tempmutes`))
            guildData.set(`${message.guild.id}.tempmutes`, []);
          guildData.push(`${message.guild.id}.tempmutes`, {
            case: modCase.id,
            user: target.user.id,
            unmute: moment().add(length / 1000 / 60, "m")
          });

          console.log(
            `${message.guild.name} | Muted ${target.user.tag} (${
              target.user.id
            }) for ${length / 1000 / 60} minutes.`
          );

          message.channel.send(
            fn.embed(client, `${target} has been temporarily muted!`)
          );
          message.channel.send(embed);

          target.user.send(
            fn.embed(
              client,
              `You have been temporarily muted from **${message.guild.name}**!`
            )
          );
          target.user
            .send(embed)
            .catch(error =>
              message.channel.send(
                fn.embed(client, `I cannot DM ${target.user.tag}!`)
              )
            );

          let modlog = message.guild.channels.cache.find(
            channel => channel.id == shared.guild.modlog
          );

          if (modlog) {
            modlog
              .send(embed)
              .catch(() =>
                message.channel.send(
                  fn.embed(client, `I cannot log in ${modlog}!`)
                )
              );
          }
        })
        .catch(error => {
          message.channel.send(
            fn.error(client, `I was unable to give ${muteRole} to ${target}!`)
          );
        });

      return undefined;
    }
  }
};

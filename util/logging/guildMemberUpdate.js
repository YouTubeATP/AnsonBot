const Discord = require("discord.js"),
  db = require("quick.db");

const guildData = new db.table("GUILDDATA");

const config = require("/app/util/config"),
  fn = require("/app/util/fn");

module.exports = client => {
  client.on("guildMemberUpdate", async (oldMember, newMember) => {
    let logChannelID = guildData.get(`${newMember.guild.id}.botlog`);
    let logChannel = client.channels.get(logChannelID);
    if (!logChannel) return;

    // Check for given roles
    newMember.roles.forEach(role => {
      if (!oldMember.roles.find(r => r.id == role.id)) {
        return logChannel.send(
          new Discord.RichEmbed()
            .setColor(config.embedColor)
            .setTitle("Role Given")
            .setThumbnail(newMember.user.displayAvatarURL)
            .addField(
              newMember.user.bot ? "Bot" : "User",
              `${newMember} (${newMember.user.tag})`
            )
            .addField("Role", `${role} (${role.name})`)
            .setFooter(client.user.username, client.user.avatarURL)
            .setTimestamp()
        );
      }
    });

    // Check for removed roles
    oldMember.roles.forEach(role => {
      if (!newMember.roles.find(r => r.id == role.id)) {
        return logChannel.send(
          new Discord.RichEmbed()
            .setColor(config.embedColor)
            .setTitle("Role Removed")
            .setThumbnail(newMember.user.displayAvatarURL)
            .addField(
              newMember.user.bot ? "Bot" : "User",
              `${newMember} (${newMember.user.tag})`
            )
            .addField("Role", `${role} (${role.name})`)
            .setFooter(client.user.username, client.user.avatarURL)
            .setTimestamp()
        );
      }
    });

    if (oldMember.user.tag != newMember.user.tag)
      return logChannel.send(
        new Discord.RichEmbed()
          .setColor(config.embedColor)
          .setTitle("User Tag Updated")
          .setThumbnail(newMember.user.displayAvatarURL)
          .addField(
            newMember.user.bot ? "Bot" : "User",
            `${newMember} (${newMember.user.tag})`
          )
          .addField("Before", `${oldMember.user.tag}`, true)
          .addField("After", `${newMember.user.tag}`, true)
          .setFooter(client.user.username, client.user.avatarURL)
          .setTimestamp()
      );

    if (oldMember.displayName != newMember.displayName)
      return logChannel.send(
        new Discord.RichEmbed()
          .setColor(config.embedColor)
          .setTitle("Member Nickname Updated")
          .setThumbnail(newMember.user.displayAvatarURL)
          .addField(
            newMember.user.bot ? "Bot" : "User",
            `${newMember} (${newMember.user.tag})`
          )
          .addField("Before", `${oldMember.displayName}`, true)
          .addField("After", `${newMember.displayName}`, true)
          .setFooter(client.user.username, client.user.avatarURL)
          .setTimestamp()
      );

    if (oldMember.user.avatarURL != newMember.user.avatarURL)
      return logChannel.send(
        new Discord.RichEmbed()
          .setColor(config.embedColor)
          .setTitle("User Avatar Updated")
          .setThumbnail(newMember.user.displayAvatarURL)
          .addField(
            newMember.user.bot ? "Bot" : "User",
            `${newMember} (${newMember.user.tag})`
          )
          .addField("Before", `[Link](${oldMember.user.avatarURL})`, true)
          .addField("After", `[Link](${newMember.user.avatarURL})`, true)
          .setFooter(client.user.username, client.user.avatarURL)
          .setTimestamp()
      );
    if (newMember.premiumSinceTimestamp != null)
      return logChannel.send(
        new Discord.RichEmbed()
          .setColor(config.embedColor)
          .setTitle("Server Boosted")
          .setThumbnail(newMember.user.displayAvatarURL)
          .addField(
            newMember.user.bot ? "Bot" : "User",
            `${newMember} (${newMember.user.tag})`
          )
          .addField("Before", `[Link](${oldMember.user.avatarURL})`, true)
          .addField("After", `[Link](${newMember.user.avatarURL})`, true)
          .setFooter(client.user.username, client.user.avatarURL)
          .setTimestamp()
      );
      return newMember.guild.channels
        .get(653091798498934825)
        .send(`${newMember} boosted **MusicSounds's Hangout**! Hallelujah!`);
  });
};

const Discord = require("discord.js"),
  db = require("quick.db");

const guildData = new db.table("GUILDDATA");

const config = require("/app/util/config"),
  fn = require("/app/util/fn");

module.exports = client => {
  client.on("voiceStateUpdate", async (oldMember, newMember) => {
    let logChannelID = guildData.get(`${newMember.guild.id}.botlog`);
    let logChannel = client.channels.get(logChannelID);
    if (!logChannel) return;
    if (oldMember.deaf != newMember.deaf) {
      if (newMember.deaf)
        return logChannel.send(
          new Discord.RichEmbed()
            .setColor(config.embedColor)
            .setAuthor("Member Deafened")
            .setThumbnail(newMember.user.displayAvatarURL)
            .addField(
              newMember.user.bot ? "Bot" : "User",
              `${newMember} (${newMember.user.tag})`
            )
            .setFooter(client.user.username, client.user.avatarURL)
            .setTimestamp()
        );
      else
        return logChannel.send(
          new Discord.RichEmbed()
            .setColor(config.embedColor)
            .setAuthor("Member Undeafened")
            .setThumbnail(newMember.user.displayAvatarURL)
            .addField(
              newMember.user.bot ? "Bot" : "User",
              `${newMember} (${newMember.user.tag})`
            )
            .setFooter(client.user.username, client.user.avatarURL)
            .setTimestamp()
        );
    }

    if (oldMember.mute != newMember.mute) {
      if (newMember.mute)
        return logChannel.send(
          new Discord.RichEmbed()
            .setColor(config.embedColor)
            .setAuthor("Member Muted")
            .setThumbnail(newMember.user.displayAvatarURL)
            .addField(
              newMember.user.bot ? "Bot" : "User",
              `${newMember} (${newMember.user.tag})`
            )
            .setFooter(client.user.username, client.user.avatarURL)
            .setTimestamp()
        );
      else
        return logChannel.send(
          new Discord.RichEmbed()
            .setColor(config.embedColor)
            .setAuthor("Member Unmuted")
            .setThumbnail(newMember.user.displayAvatarURL)
            .addField(
              newMember.user.bot ? "Bot" : "User",
              `${newMember} (${newMember.user.tag})`
            )
            .setFooter(client.user.username, client.user.avatarURL)
            .setTimestamp()
        );
    }

    if (oldMember.voiceChannel != newMember.voiceChannel) {
      if (!oldMember.voiceChannel)
        return logChannel.send(
          new Discord.RichEmbed()
            .setColor(config.embedColor)
            .setAuthor("Voice Connected")
            .setThumbnail(newMember.user.displayAvatarURL)
            .addField(
              newMember.user.bot ? "Bot" : "User",
              `${newMember} (${newMember.user.tag})`
            )
            .addField(
              "Voice Channel",
              `${newMember.user.voiceChannel} (${newMember.user.voiceChannel.name})`,
              true
            )
            .addField("ID", newMember.user.voiceChannel.id, true)
            .setFooter(client.user.username, client.user.avatarURL)
            .setTimestamp()
        );
      else if (!newMember.voiceChannel)
        return logChannel.send(
          new Discord.RichEmbed()
            .setColor(config.embedColor)
            .setAuthor("Voice Disconnected")
            .setThumbnail(newMember.user.displayAvatarURL)
            .addField(
              newMember.user.bot ? "Bot" : "User",
              `${newMember} (${newMember.user.tag})`
            )
            .addField(
              "Voice Channel",
              `${oldMember.user.voiceChannel} (${oldMember.user.voiceChannel})`,
              true
            )
            .addField("ID", oldMember.user.voiceChannel.id, true)
            .setFooter(client.user.username, client.user.avatarURL)
            .setTimestamp()
        );
      else
        return logChannel.send(
          new Discord.RichEmbed()
            .setColor(config.embedColor)
            .setAuthor("Channel Switched")
            .setThumbnail(newMember.user.displayAvatarURL)
            .addField(
              newMember.user.bot ? "Bot" : "User",
              `${newMember} (${newMember.user.tag})`
            )
            .addField(
              "Previous Voice Channel",
              `${oldMember.user.voiceChannel} (${oldMember.user.voiceChannel.name})`,
              true
            )
            .addField("ID of Previous Channel", oldMember.user.voiceChannel.id, true)
            .addField(
              "Current Voice Channel",
              `${newMember.user.voiceChannel} (${newMember.user.voiceChannel.name})`,
              true
            )
            .addField("ID of Current Channel", newMember.user.voiceChannel.id, true)
            .setFooter(client.user.username, client.user.avatarURL)
            .setTimestamp()
        );
    }
  });
};

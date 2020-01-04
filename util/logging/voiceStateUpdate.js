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
            .addField("Voice Channel", `${newMember.voiceChannel.name}`, true)
            .addField("ID", `${newMember.voiceChannel.id}`, true)
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
            .addField("Voice Channel", `${oldMember.voiceChannel.name}`, true)
            .addField("Voice Channel", `${oldMember.voiceChannel.id}`, true)
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
              `${oldMember.voiceChannel.name}`,
              true
            )
            .addField(
              "Current Voice Channel",
              `${newMember.voiceChannel.name}`,
              true
            )
            .setFooter(client.user.username, client.user.avatarURL)
            .setTimestamp()
        );
    }
  });
};

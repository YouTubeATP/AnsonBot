const Discord = require("discord.js"),
  db = require("quick.db");

const guildData = new db.table("GUILDDATA");

const config = require("/app/util/config"),
  fn = require("/app/util/fn");

module.exports = client => {
  client.on("voiceStateUpdate", async (oldState, newState) => {
    let logChannelID = guildData.get(`${newState.guild.id}.botlog`);
    let logChannel = client.channels.cache.get(logChannelID);
    if (!logChannel) return;
    if (oldState.voiceChannel != newState.voiceChannel) {
      if (!oldState.voiceChannel)
        return logChannel.send(
          new Discord.MessageEmbed()
            .setColor(config.embedColor)
            .setTitle("Voice Connected")
            .setThumbnail(newState.user.displayAvatarURL())
            .addField(
              newState.user.bot ? "Bot" : "User",
              `${newState} (${newState.user.tag})`
            )
            .addField("Voice Channel", `${newState.voiceChannel.name}`)
            .addField("ID", `${newState.voiceChannel.id}`)
            .setFooter(client.user.username, client.user.avatarURL())
            .setTimestamp()
        );
      else if (!newState.voiceChannel)
        return logChannel.send(
          new Discord.MessageEmbed()
            .setColor(config.embedColor)
            .setTitle("Voice Disconnected")
            .setThumbnail(newState.user.displayAvatarURL())
            .addField(
              newState.user.bot ? "Bot" : "User",
              `${newState} (${newState.user.tag})`
            )
            .addField("Voice Channel", `${oldState.voiceChannel.name}`)
            .addField("ID", `${oldState.voiceChannel.id}`)
            .setFooter(client.user.username, client.user.avatarURL())
            .setTimestamp()
        );
      else
        return logChannel.send(
          new Discord.MessageEmbed()
            .setColor(config.embedColor)
            .setTitle("Channel Switched")
            .setThumbnail(newState.user.displayAvatarURL())
            .addField(
              newState.user.bot ? "Bot" : "User",
              `${newState} (${newState.user.tag})`
            )
            .addField(
              "Previous Voice Channel",
              `${oldState.voiceChannel.name}`
            )
            .addField(
              "Current Voice Channel",
              `${newState.voiceChannel.name}`
            )
            .setFooter(client.user.username, client.user.avatarURL())
            .setTimestamp()
        );
    }
  });
};

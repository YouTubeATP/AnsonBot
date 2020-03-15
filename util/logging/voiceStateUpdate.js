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
    if (oldState.channel != newState.channel) {
      if (!oldState.channel)
        return logChannel.send(
          new Discord.MessageEmbed()
            .setColor(config.embedColor)
            .setTitle("Voice Connected")
            .setThumbnail(newState.member.user.displayAvatarURL())
            .addField(
              newState.member.bot ? "Bot" : "User",
              `${newState.member.user} (${newState.member.user.tag})`
            )
            .addField("Voice Channel", `${newState.channel.name}`)
            .addField("ID", `${newState.channel.id}`)
            .setFooter(client.user.username, client.user.avatarURL())
            .setTimestamp()
        );
      else if (!newState.channel)
        return logChannel.send(
          new Discord.MessageEmbed()
            .setColor(config.embedColor)
            .setTitle("Voice Disconnected")
            .setThumbnail(newState.member.user.displayAvatarURL())
            .addField(
              newState.member.bot ? "Bot" : "User",
              `${newState.member.user} (${newState.member.user.tag})`
            )
            .addField("Voice Channel", `${oldState.channel.name}`)
            .addField("ID", `${oldState.channel.id}`)
            .setFooter(client.user.username, client.user.avatarURL())
            .setTimestamp()
        );
      else
        return logChannel.send(
          new Discord.MessageEmbed()
            .setColor(config.embedColor)
            .setTitle("Channel Switched")
            .setThumbnail(newState.member.user.displayAvatarURL())
            .addField(
              newState.member.bot ? "Bot" : "User",
              `${newState.member.user} (${newState.member.user.tag})`
            )
            .addField("Previous Voice Channel", `${oldState.channel.name}`)
            .addField("Current Voice Channel", `${newState.channel.name}`)
            .setFooter(client.user.username, client.user.avatarURL())
            .setTimestamp()
        );
    }
  });
};

const Discord = require("discord.js"),
  db = require("quick.db");

const guildData = new db.table("GUILDDATA");

const config = require("/app/util/config"),
  fn = require("/app/util/fn");

module.exports = client => {
  client.on("guildBanAdd", async (guild, user) => {
    let logChannelID = guildData.get(`${guild.id}.botlog`);
    let logChannel = client.channels.cache.get(logChannelID);
    if (!logChannel) return;

    logChannel.send(
      new Discord.RichEmbed()
        .setColor(config.embedColor)
        .setTitle("User Banned")
        .setThumbnail(user.displayAvatarURL)
        .addField(user.bot ? "Bot" : "User", `${user} (${user.tag})`)
        .addField("ID", user.id)
        .addField("Joined", fn.time(user.joinedTimestamp))
        .setFooter(client.user.username, client.user.avatarURL)
        .setTimestamp()
    );
  });
};

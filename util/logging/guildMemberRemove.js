const Discord = require("discord.js"),
  db = require("quick.db");

const guildData = new db.table("GUILDDATA");

const config = require("/app/util/config"),
  fn = require("/app/util/fn");

module.exports = client => {
  client.on("guildMemberRemove", async member => {
    let memberLogID = guildData.get(`${member.guild.id}.memberlog`);
    let memberLog = client.channels.cache.get(memberLogID);
    if (memberLog) {
      memberLog.send(
        new Discord.MessageEmbed()
          .setColor(config.embedColor)
          .setTitle("Member Left")
          .setThumbnail(member.user.displayAvatarURL())
          .setDescription(
            `There are now ${member.guild.memberCount} members in ${member.guild}.`
          )
          .addField(
            member.user.bot ? "Bot" : "User",
            `${member} (${member.user.tag})`
          )
          .addField("ID", member.id)
          .setFooter(client.user.username, client.user.avatarURL())
          .setTimestamp()
      );
    }
  });
};

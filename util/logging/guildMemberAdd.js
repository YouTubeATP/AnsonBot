const Discord = require("discord.js"),
  db = require("quick.db");

const guildData = new db.table("GUILDDATA");

const config = require("/app/util/config"),
  fn = require("/app/util/fn");

module.exports = client => {
  client.on("guildMemberAdd", async member => {
    let autoRole = guildData.get(`${member.guild.id}.autoRole`);
    if (autoRole && !member.user.bot) {
      if (typeof autoRole == "string")
        member.roles.add(fn.getRole(member.guild, autoRole));
      else
        for (var i in autoRole)
          member.roles.add(fn.getRole(member.guild, autoRole[i]));
    }

    let memberLogID = guildData.get(`${member.guild.id}.memberlog`);
    let memberLog = client.channels.cache.get(memberLogID);
    if (memberLog) {
      memberLog.send(
        new Discord.MessageEmbed()
          .setColor(config.embedColor)
          .setTitle("Member Joined")
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

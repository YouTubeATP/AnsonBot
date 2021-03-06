const Discord = require("discord.js");
const db = require("quick.db");
const moment = require("moment");

const guildData = new db.table("GUILDDATA"),
  modCases = new db.table("MODCASES"),
  config = require("/app/util/config"),
  fn = require("/app/util/fn");

module.exports = client => {
  client.on("ready", () => {
    setInterval(() => {
      let guilds = guildData.all().filter(guild => guild.data.tempmutes);

      for (var i = 0; i < guilds.length; i++) {
        let guildTMs = guilds[i].data.tempmutes;

        for (var j = 0; j < guildTMs.length; j++) {
          if (moment(guildTMs[j].unmute) <= moment()) {
            let guild = client.guilds.cache.get(guilds[i].ID);
            if (!guild) return;

            let TMCase = guildData.get(`${guild.id}.tempmutes`);
            guildData.set(
              `${guild.id}.tempmutes`,
              TMCase.filter(c => guildTMs[j].case != c.case)
            );

            let muteRole = guild.roles.cache.get(
              guildData.get(`${guilds[i].ID}.muteRole`)
            );
            let member = guild.members.cache.get(guildTMs[j].user);
            if (!muteRole || !member) return;

            member
              .removeRole(muteRole)
              .then(() => {
                let modCase = new fn.ModCase(
                  client,
                  modCases.get(guild.id).length + 1,
                  "UNMUTE",
                  member,
                  client.user,
                  "Auto"
                );
                let embed = fn.modCaseEmbed(client, modCase);
                modCases.push(guild.id, modCase);

                member.user
                  .send(
                    fn.embed(client, `You have been unmuted on ${guild.name}!`)
                  )
                  .catch(error => {});
                member.user.send(embed).catch(error => {});

                let modlog = guild.channels.cache.get(
                  guildData.cache.get(`${guild.id}.modlog`)
                );
                if (modlog) modlog.send(embed);
              })
              .catch(error => {});
          }
        }
      }
    }, 5 * 1000);
  });
};

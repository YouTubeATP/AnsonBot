/* --- ALL PACKAGES --- */

require("es6-shim");

const Discord = require("discord.js"),
  Enmap = require("enmap"),
  express = require("express"),
  fs = require("fs"),
  http = require("http"),
  moment = require("moment"),
  db = require("quick.db"),
  ytdl = require("ytdl-core"),
  opus = require("node-opus"),
  YouTube = require("simple-youtube-api");

/* --- ALL PACKAGES --- */

/* --- ALL GLOBAL CONSTANTS & FUNCTIONS --- */

const client = new Discord.Client(),
  config = require("/app/util/config"),
  fn = require("/app/util/fn"),
  userData = new db.table("USERDATA"),
  guildData = new db.table("GUILDDATA"),
  botData = new db.table("BOTDATA"),
  mutedSet = new Set(),
  queue = new Map();

const Minecraft = new Enmap({
  name: "link",
  fetchAll: false,
  autoFetch: true,
  cloneLevel: "deep"
});

let shared = {},
  stopping = false,
  voteSkipPass = 0,
  voted = 0,
  playerVoted = [],
  activeMusicSelection = [],
  playlist = false;

shared.Minecraft = Minecraft;
shared.queue = queue;
shared.youtube1 = new YouTube(process.env.YTAPI1);
shared.youtube2 = new YouTube(process.env.YTAPI2);
shared.stopping = stopping;
shared.voteSkipPass = voteSkipPass;
shared.voted = voted;
shared.playerVoted = playerVoted;
shared.activeMusicSelection = activeMusicSelection;
shared.playlist = playlist;
shared.client = client;

exports.client = client;

let i,
  j,
  k,
  modified,
  semiModified,
  verySemiModified,
  index = 0,
  maxChannels = 5;

client.commands = new Discord.Collection();
const commandFiles = fs
  .readdirSync("./commands")
  .filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

const token = process.env.DISCORD_BOT_TOKEN;

const tempmute = require("/app/util/tempmute.js")(client);
const logs = require("/app/util/logging.js")(client);

/* --- ALL GLOBAL CONSTANTS & FUNCTIONS --- */

client.login(token);

client.on("ready", () => {
  console.log(`${fn.time()} | ${client.user.username} is up!`);
  client.user.setPresence({
    status: "online",
    activity: {
      name: "to you guys having fun",
      type: "LISTENING",
      url: "https://discord.io/ansonthepro"
    }
  });
});

client.on("guildCreate", async guild => {
  if (!guildData.has(guild.id)) {
    let newGuildData = {
      prefix: config.defaultPrefix,
      blacklisted: false,
      commandsUsed: 0,
      createdTimestamp: moment()
    };
    guildData.set(guild.id, newGuildData);
  }
});

client.on("guildMemberAdd", async member => {
  let guild = member.guild;
  let memberTag = member.user.id;
  if (guild.id === config.hideout && !member.user.bot) {
    member.roles
      .add(guild.roles.cache.find(c => c.name === "Member"))
      .then(() => {
        client.channels.cache
          .get("574095353608011817")
          .send(
            "<@" +
              memberTag +
              "> has joined **Anson the pro!'s Hideout**. Welcome, <@" +
              memberTag +
              ">."
          );
      })
      .catch(e => {
        console.log(e);
      });
  } else if (guild.id === config.hideout && member.user.bot) {
    member.roles.add(guild.roles.cache.find(c => c.name === "Bot")).catch(e => {
      console.log(e);
    });
  }
});

client.on("guildMemberAdd", async member => {
  let guild = member.guild;
  let memberTag = member.user.id;
  if (guild.id === config.playground && !member.user.bot) {
    member.roles
      .add(guild.roles.cache.find(c => c.name === "Member"))
      .then(() => {
        client.channels.cache
          .get("744849390211956866")
          .send(
            "<@" +
              memberTag +
              "> has joined **YouTubeATP's Bot Playground**. Welcome, <@" +
              memberTag +
              ">."
          );
      })
      .catch(e => {
        console.log(e);
      });
  } else if (guild.id === config.playground && member.user.bot) {
    member.roles.add(guild.roles.cache.find(c => c.name === "Bot")).catch(e => {
      console.log(e);
    });
  }
});

client.on("guildMemberRemove", async member => {
  let guild = member.guild;
  if (member.user.bot) return;
  let memberTag = member.user.id;
  if (guild.id === config.playground) {
    client.channels.cache
      .get("744849390211956866")
      .send(
        "<@" +
          memberTag +
          "> has left **YouTubeATP's Bot Playground**. Farewell, <@" +
          memberTag +
          ">."
      );
  }
});

client.on("guildMemberRemove", async member => {
  let guild = member.guild;
  if (member.user.bot) return;
  let memberTag = member.user.id;
  if (guild.id === config.hideout) {
    client.channels.cache
      .get("574095353608011817")
      .send(
        "<@" +
          memberTag +
          "> has left **Anson the pro!'s Hideout**. Farewell, <@" +
          memberTag +
          ">."
      );
  }
});

// message detection

client.on("message", message => {
  if (message.content === 'a!!source') {
    message.channel.send('https://github.com/YouTubeATP/AnsonBot');
  }
});

client.on("message", async message => {
  if (
    message.channel.type != "text" ||
    message.guild === null ||
    message.member === null ||
    client.user === null
  )
    return;

  console.log(
    `${fn.time()} | ${message.guild.name} #${message.channel.name} | ${
      message.author.tag
    } > ${message.cleanContent}`
  );

  if (!userData.has(message.author.id)) {
    let newUserData = {
      botStaff: false,
      blacklisted: false,
      commandsUsed: 0,
      createdTimestamp: moment()
    };
    userData.set(message.author.id, newUserData);
  }
  let user = userData.get(message.author.id);

  if (!guildData.has(message.guild.id)) {
    let newGuildData = {
      prefix: config.defaultPrefix,
      blacklisted: false,
      commandsUsed: 0,
      createdTimestamp: moment()
    };
    guildData.set(message.guild.id, newGuildData);
  }
  let guild = guildData.get(message.guild.id);

  const msg = message.content.trim().toLowerCase();

  const prefix = guild.prefix || config.defaultPrefix,
    mention = `<@${client.user.id}> `,
    mention1 = `<@!${client.user.id}> `;

  if (
    message.content.startsWith(prefix) ||
    message.content.startsWith(mention) ||
    message.content.startsWith(mention1)
  ) {
    let args;
    shared.customPrefix = prefix;
    if (msg.startsWith(prefix)) {
      args = message.content
        .trim()
        .slice(prefix.length)
        .split(/\s+/u);
      shared.prefix = prefix;
    } else if (msg.startsWith(mention)) {
      args = message.content
        .trim()
        .slice(mention.length)
        .split(/\s+/u);
      shared.prefix = mention;
    } else if (msg.startsWith(mention1)) {
      args = message.content
        .trim()
        .slice(mention1.length)
        .split(/\s+/u);
      shared.prefix = mention1;
    }

    const commandName = args.shift().toLowerCase();
    shared.commandName = commandName;
    const command =
      client.commands.get(commandName) ||
      client.commands.find(
        cmd => cmd.aliases && cmd.aliases.includes(commandName)
      );

    if (!command) {
      let embed = new Discord.MessageEmbed()
        .setColor(config.embedColor)
        .setTitle(`I can't recognize this command!`)
        .setDescription(
          `Maybe a typo? Do \`${prefix}help\` for a list of available commands.`
        )
        .setThumbnail(message.guild.iconURL())
        .setFooter(client.user.username, client.user.avatarURL())
        .setTimestamp();
      message.channel.send(embed).then(m => m.delete({ timeout: 5000 }));
      return message.delete();
    }

    if (command.botStaffOnly && !user.botStaff) {
      message.channel
        .send(
          fn.embed(client, "You do not have permission to use this command!")
        )
        .then(m => m.delete({ timeout: 5000 }));
      return message.delete();
    }
    if (
      command.guildPerms &&
      !message.member.hasPermission(command.guildPerms)
    ) {
      message.channel
        .send(
          fn.embed(client, "You do not have permission to use this command!")
        )
        .then(m => m.delete({ timeout: 5000 }));
      return message.delete();
    }

    shared.user = user;
    shared.guild = guild;
    shared.defaultPrefix = config.defaultPrefix;
    shared.embedColor = config.embedColor;

    try {
      await command.run(client, message, args, shared);
    } catch (error) {
      console.log(error);
    }

    message.delete().catch(error => {});
  }
});

// markdown overwrite

function clean(text) {
  if (typeof text === "string")
    return text
      .replace("*", "*" + String.fromCharCode(8203))
      .replace("_", "_" + String.fromCharCode(8203))
      .replace(/&amp;/g, "&" + String.fromCharCode(8203))
      .replace(/&gt;/g, ">" + String.fromCharCode(8203))
      .replace(/&lt;/g, "<" + String.fromCharCode(8203))
      .replace(/&quot;/g, '"' + String.fromCharCode(8203))
      .replace(/&OElig;/g, "Œ" + String.fromCharCode(8203))
      .replace(/&oelig;/g, "œ" + String.fromCharCode(8203))
      .replace(/&Scaron;/g, "Š" + String.fromCharCode(8203))
      .replace(/&scaron;/g, "š" + String.fromCharCode(8203))
      .replace(/&Yuml;/g, "Ÿ" + String.fromCharCode(8203))
      .replace(/&circ;/g, "ˆ" + String.fromCharCode(8203))
      .replace(/&tilde;/g, "˜" + String.fromCharCode(8203))
      .replace(/&ndash;/g, "–" + String.fromCharCode(8203))
      .replace(/&mdash;/g, "—" + String.fromCharCode(8203))
      .replace(/&lsquo;/g, "‘" + String.fromCharCode(8203))
      .replace(/&rsquo;/g, "’" + String.fromCharCode(8203))
      .replace(/&#39;/g, "'" + String.fromCharCode(8203))
      .replace(/&#96;/g, "`" + String.fromCharCode(8203))
      .replace(/&#124;/g, "|" + String.fromCharCode(8203))
      .replace(/&sbquo;/g, "‚" + String.fromCharCode(8203))
      .replace(/&ldquo;/g, "“" + String.fromCharCode(8203))
      .replace(/&rdquo;/g, "”" + String.fromCharCode(8203))
      .replace(/&bdquo;/g, "„" + String.fromCharCode(8203))
      .replace(/&dagger;/g, "†" + String.fromCharCode(8203))
      .replace(/&Dagger;/g, "‡" + String.fromCharCode(8203))
      .replace(/&permil;/g, "‰" + String.fromCharCode(8203))
      .replace(/&lsaquo;/g, "‹" + String.fromCharCode(8203))
      .replace(/&rsaquo;/g, "›" + String.fromCharCode(8203))
      .replace(/&euro;/g, "€" + String.fromCharCode(8203))
      .replace(/&copy;/g, "©" + String.fromCharCode(8203))
      .replace(/&trade;/g, "™" + String.fromCharCode(8203))
      .replace(/&reg;/g, "®" + String.fromCharCode(8203))
      .replace(/&nbsp;/g, " " + String.fromCharCode(8203))
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203));
  else return text;
}

// AFK notification

client.on("voiceStateUpdate", async (oldState, newState) => {
  const guild = newState.guild;
  try {
    if (
      oldState.channel != null &&
      newState.channel ===
        client.channels.cache.get(newState.guild.afkChannelID)
    ) {
      newState.setChannel(null);
      let afk = new Discord.MessageEmbed()
        .setColor(config.embedColor)
        .setTitle(`Voice Disconnected for Inactivity`)
        .setDescription(
          `You have been idle in the voice channel **${oldState.channel.name}** in **${guild}** for more than 5 minutes, so you were automatically disconnected.`
        )
        .setThumbnail(guild.iconURL())
        .setFooter(client.user.username, client.user.avatarURL())
        .setTimestamp();
      newState.member.send(afk);
    }
  } catch (e) {
    console.log("Couldn't disconnect user from AFK channel", e);
  }
});

// bot auto-disconnect if channel vacant

client.on("voiceStateUpdate", (oldState, newState) => {
  const serverQueue = queue.get(newState.guild.id);
  let voiceChannel, botVoiceConnection;
  if (oldState.guild.voice) {
    botVoiceConnection = oldState.guild.voice.connection;
    if (botVoiceConnection) {
      channelMembers = botVoiceConnection.channel.members;
      if (channelMembers) {
        if (channelMembers.filter(i => i.id).size <= 1 || !newState.guild.voice) {
          shared.stopping = true;
          serverQueue.voiceChannel.leave();

          var stop = new Discord.MessageEmbed()
            .setColor(config.embedColor)
            .setThumbnail(oldState.guild.iconURL())
            .setTitle("Music Terminated")
            .setDescription(
              `Since the voice channel I am in has been vacanted, in order to preserve resources, the queue for \`${oldState.guild.name}\` has been deleted and I have left the voice channel.`
            )
            .setFooter(client.user.username, client.user.avatarURL())
            .setTimestamp();

          serverQueue.textChannel.send(stop);
          queue.delete(oldState.guild.id);
        } else return;
      }
    }
  }
});

// temporary channel system

client.on("voiceStateUpdate", (oldState, newState) => {
  if (index < 0) index = 0;
  if (index > maxChannels) index = maxChannels;
  const guild = newState.guild;
  let joinVoiceChannel = client.channels.cache.get("737589084557541446");
  try {
    modified = false;
    for (i = 1; i <= parseInt(maxChannels + 1); i++) {
      semiModified = false;
      verySemiModified = false;
      try {
        if (
          index < i &&
          guild.channels.cache.find(c => c.name === `休息室 ${i} 號 Lounge ${i}`) &&
          guild.channels.cache.find(c => c.name === `休息室 ${i} 號 Lounge ${i}`)
            .members.size <= 0
        ) {
          guild.channels.cache
            .find(c => c.name === `休息室 ${i} 號 Lounge ${i}`)
            .delete();
          console.log(`${index} not changed`);
        } else if (
          index < i &&
          guild.channels.cache.find(c => c.name === `休息室 ${i} 號 Lounge ${i}`) &&
          guild.channels.cache.find(c => c.name === `休息室 ${i} 號 Lounge ${i}`)
            .members.size > 0
        ) {
          for (k = 1; k < i; k++) {
            if (
              !semiModified &&
              guild.channels.cache.find(
                c => c.name === `休息室 ${i} 號 Lounge ${i}`
              ) &&
              !guild.channels.cache.find(c => c.name === `休息室 ${k} 號 Lounge ${k}`)
            ) {
              guild.channels.cache
                .find(c => c.name === `休息室 ${i} 號 Lounge ${i}`)
                .setName(`休息室 ${k} 號 Lounge ${k}`);
              console.log(`Index changed from ${index++} to ${index}`);
              semiModified = true;
            }
          }
        }
      } catch (e) {
        console.log(e);
      }
      try {
        if (
          oldState.channel &&
          oldState.channel.name.includes(`休息室`) &&
          oldState.channel.members.size <= 0
        ) {
          oldState.channel.delete();
          for (j = i + 1; j <= parseInt(maxChannels + 1); j++) {
            try {
              if (
                guild.channels.cache.find(
                  c => c.name === `休息室 ${i + 1} 號 Lounge ${i + 1}`
                ) &&
                !guild.channels.cache.find(
                  c => c.name === `休息室 ${j} 號 Lounge ${j}`
                ) &&
                !verySemiModified
              ) {
                guild.channels.cache
                  .find(c => c.name === `休息室 ${i + 1} 號 Lounge ${i + 1}`)
                  .setName(`休息室 ${i} 號 Lounge ${i}`);
                verySemiModified = true;
              }
            } catch (e) {
              console.log("Couldn't rename channels", e);
            }
          }
          if (!modified) {
            console.log(`Index changed from ${index--} to ${index}`);
            modified = true;
          }
        }
      } catch (e) {
        console.log(e);
      }
    }
  } catch (e) {
    console.log("Lounges not updated", e);
  }
  try {
    if (newState.channel != joinVoiceChannel) return;
    else if (oldState.channel != newState.channel && index < maxChannels) {
      console.log(`Index changed from ${index++} to ${index}`);
      const category = guild.channels.cache.get("737589083383136416");
      return guild.channels
        .create(`休息室 ${index} 號 Lounge ${index}`, {
          type: "voice",
          parent: category
        })
        .then(newChannel => newState.setChannel(newChannel));
    } else if (index >= maxChannels) {
      newState.setChannel(null);
      console.log(`${index} not changed`);
      let embed = new Discord.MessageEmbed()
        .setColor(config.embedColor)
        .setTitle(`You can't create a new lounge right now!`)
        .setDescription(
          `Only **${maxChannels}** public lounges may be present in **${guild}** at a time. Consider joining one of them instead!`
        )
        .setThumbnail(guild.iconURL())
        .setFooter(client.user.username, client.user.avatarURL())
        .setTimestamp();
      return newState.send(embed);
    }
  } catch (e) {
    console.log("Couldn't move users", e);
  }
});

client.on("voiceStateUpdate", (oldState, newState) => {
  if (index < 0) index = 0;
  if (index > maxChannels) index = maxChannels;
  const guild = newState.guild;
  let joinVoiceChannel = client.channels.cache.get("753271404786614352");
  try {
    modified = false;
    for (i = 1; i <= parseInt(maxChannels + 1); i++) {
      semiModified = false;
      verySemiModified = false;
      try {
        if (
          index < i &&
          guild.channels.cache.find(c => c.name === `Lounge ${i}`) &&
          guild.channels.cache.find(c => c.name === `Lounge ${i}`)
            .members.size <= 0
        ) {
          guild.channels.cache
            .find(c => c.name === `Lounge ${i}`)
            .delete();
          console.log(`${index} not changed`);
        } else if (
          index < i &&
          guild.channels.cache.find(c => c.name === `Lounge ${i}`) &&
          guild.channels.cache.find(c => c.name === `Lounge ${i}`)
            .members.size > 0
        ) {
          for (k = 1; k < i; k++) {
            if (
              !semiModified &&
              guild.channels.cache.find(
                c => c.name === `Lounge ${i}`
              ) &&
              !guild.channels.cache.find(c => c.name === `Lounge ${k}`)
            ) {
              guild.channels.cache
                .find(c => c.name === `Lounge ${i}`)
                .setName(`Lounge ${k}`);
              console.log(`Index changed from ${index++} to ${index}`);
              semiModified = true;
            }
          }
        }
      } catch (e) {
        console.log(e);
      }
      try {
        if (
          oldState.channel &&
          oldState.channel.name.includes(`Lounge`) &&
          oldState.channel.members.size <= 0
        ) {
          oldState.channel.delete();
          for (j = i + 1; j <= parseInt(maxChannels + 1); j++) {
            try {
              if (
                guild.channels.cache.find(
                  c => c.name === `Lounge ${i + 1}`
                ) &&
                !guild.channels.cache.find(
                  c => c.name === `Lounge ${j}`
                ) &&
                !verySemiModified
              ) {
                guild.channels.cache
                  .find(c => c.name === `Lounge ${i + 1}`)
                  .setName(`Lounge ${i}`);
                verySemiModified = true;
              }
            } catch (e) {
              console.log("Couldn't rename channels", e);
            }
          }
          if (!modified) {
            console.log(`Index changed from ${index--} to ${index}`);
            modified = true;
          }
        }
      } catch (e) {
        console.log(e);
      }
    }
  } catch (e) {
    console.log("Lounges not updated", e);
  }
  try {
    if (newState.channel != joinVoiceChannel) return;
    else if (oldState.channel != newState.channel && index < maxChannels) {
      console.log(`Index changed from ${index++} to ${index}`);
      const category = guild.channels.cache.get("753271330962407534");
      return guild.channels
        .create(`Lounge ${index}`, {
          type: "voice",
          parent: category
        })
        .then(newChannel => newState.setChannel(newChannel));
    } else if (index >= maxChannels) {
      newState.setChannel(null);
      console.log(`${index} not changed`);
      let embed = new Discord.MessageEmbed()
        .setColor(config.embedColor)
        .setTitle(`You can't create a new lounge right now!`)
        .setDescription(
          `Only **${maxChannels}** public lounges may be present in **${guild}** at a time. Consider joining one of them instead!`
        )
        .setThumbnail(guild.iconURL())
        .setFooter(client.user.username, client.user.avatarURL())
        .setTimestamp();
      return newState.send(embed);
    }
  } catch (e) {
    console.log("Couldn't move users", e);
  }
});

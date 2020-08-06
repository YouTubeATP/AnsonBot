/* --- ALL PACKAGES --- */

require("es6-shim");

const Discord = require("discord.js"),
  Enmap = require("enmap"),
  express = require("express"),
  fs = require("fs"),
  http = require("http"),
  moment = require("moment"),
  db = require("quick.db"),
  AntiSpam = require("discord-anti-spam"),
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

const antiSpam = new AntiSpam({
  warnThreshold: 3, // Amount of messages sent in a row that will cause a warning.
  kickThreshold: 5, // Amount of messages sent in a row that will cause a ban.
  banThreshold: 7, // Amount of messages sent in a row that will cause a ban.
  maxInterval: 1500, // Amount of time (in milliseconds) in which messages are considered spam.
  warnMessage:
    "{@user}, please refrain from spamming the chat. Further infractions will result in a kick or ban.", // Message that will be sent in chat upon warning a user.
  kickMessage: "**{user_tag}** has been kicked for spamming.", // Message that will be sent in chat upon kicking a user.
  banMessage: "**{user_tag}** has been banned for spamming.", // Message that will be sent in chat upon banning a user.
  maxDuplicatesWarning: 3, // Amount of duplicate messages that trigger a warning.
  maxDuplicatesKick: 5, // Amount of duplicate messages that trigger a warning.
  maxDuplicatesBan: 7, // Amount of duplicate messages that trigger a warning.
  exemptPermissions: ["ADMINISTRATOR"], // Bypass users with any of these permissions.
  ignoreBots: true, // Ignore bot messages.
  verbose: true, // Extended Logs from module.
  ignoredUsers: [], // Array of User IDs that get ignored.
  ignoredChannels: ["678631186225954831"] // Array of channel IDs that get ignored.
});

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
      name: "MusicSounds",
      type: "LISTENING",
      url: "https://discord.plus/MusicSounds"
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
  if (guild.id === config.server && !member.user.bot) {
    member.roles
      .add(guild.roles.cache.find(c => c.name === "Member"))
      .then(() => {
        client.channels.cache
          .get("653133031292403742")
          .send(
            "<@" +
              memberTag +
              "> has joined **MusicSounds's Hangout**. Welcome, <@" +
              memberTag +
              ">."
          );
      })
      .catch(e => {
        console.log(e);
      });
  } else if (guild.id === config.server && member.user.bot) {
    member.roles.add(guild.roles.cache.find(c => c.name === "Bot")).catch(e => {
      console.log(e);
    });
  }
});

client.on("guildMemberRemove", async member => {
  let guild = member.guild;
  if (member.user.bot) return;
  let memberTag = member.user.id;
  if (guild.id === config.server) {
    client.channels.cache
      .get("653133031292403742")
      .send(
        "<@" +
          memberTag +
          "> has left **MusicSounds's Hangout**. Farewell, <@" +
          memberTag +
          ">."
      );
  }
});

// message detection

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

  antiSpam.message(message);

  if (
    message.content.toLowerCase().startsWith(`<@431247481267814410> `) ||
    message.content.toLowerCase().startsWith(`<@!431247481267814410> `) ||
    message.content.toLowerCase().startsWith(`<@371704154705362944> `) ||
    message.content.toLowerCase().startsWith(`<@!371704154705362944> `) ||
    message.content.toLowerCase().startsWith(`<@710771990364946443> `) ||
    message.content.toLowerCase().startsWith(`<@!710771990364946443> `) ||
    message.content.toLowerCase().startsWith(`<@365975655608745985> `) ||
    message.content.toLowerCase().startsWith(`<@!365975655608745985> `) ||
    message.content.toLowerCase().startsWith(`fm/`) ||
    message.content.toLowerCase().startsWith(`hy.`) ||
    message.content.toLowerCase().startsWith(`p!`)
  )
    return message.delete();
  if (
    message.guild.id === config.server &&
    message.author.bot &&
    message.author.id !== client.user.id &&
    message.channel.id !== "653091741351542825" &&
    message.channel.id !== "653091798498934825" &&
    message.channel.id !== "653133031292403742" &&
    message.channel.id !== "662243626050519060" &&
    message.channel.id !== "653130414847688705" &&
    message.channel.id !== "662273284322230282" &&
    message.channel.id !== "663694873227952128" &&
    message.channel.id !== "678631186225954831"
  )
    return message.delete();

  if (
    message.channel.id === "663694873227952128" &&
    message.guild.id === config.server &&
    message.author.id !== client.user.id &&
    message.author.id !== "365975655608745985"
  )
    return message.delete();

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

// invite link detection

client.on("message", message => {
  if (
    message.channel.type != "text" ||
    message.guild.id !== config.server ||
    message.guild === null ||
    message.member === null ||
    client.user === null ||
    message.channel.name == undefined
  )
    return;

  if (
    message.author.id === "344335337889464357" ||
    message.channel.id === "662249455847735306" ||
    message.channel.id === "678631186225954831"
  )
    return;

  const perms = message.member.permissions;
  const admin = perms.has("ADMINISTRATOR", true);
  if (admin) return;

  const links = [
    "DISCORD.ME",
    "DISCORD.GG",
    "DISCORDAPP.COM",
    "INVITE.GG",
    "DISCORDBOTS.ORG",
    "DISC.GG",
    "DISCORD.CHAT",
    "DISCSERVS.CO",
    "DISCORD.BOTS.GG",
    "DISCORD.IO"
  ];
  const author = message.author;
  const bannedlink = message.content;
  const bannedlinks = message.content.toUpperCase();

  if (links.some(link => bannedlinks.includes(link))) {
    message.delete();
    return message
      .reply("please stick to <#662249455847735306> when advertising.")
      .then(m => m.delete({ timeout: 5000 }));
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
  let voiceChannel, botVoiceConnection;
  if (newState.guild.voice) botVoiceConnection = newState.guild.voice.connection;
  if (botVoiceConnection) channelMembers = botVoiceConnection.channel.members;
  if (channelMembers.filter(i => i.id).size <= 1) {
    shared.stopping = true;
    serverQueue.voiceChannel.leave();
    queue.delete(message.guild.id);

    var stop = new Discord.MessageEmbed()
      .setColor(config.embedColor)
      .setAuthor(message.author.tag, message.author.avatarURL())
      .setThumbnail(message.guild.iconURL())
      .setTitle("Music Terminated")
      .setDescription(
        `Since the voice channel I am in has been vacanted, in order to preserve resources, the queue for \`${message.guild.name}\` has been deleted and I have left the voice channel.`
      )
      .setFooter(client.user.username, client.user.avatarURL())
      .setTimestamp();

    return message.channel.send(stop);
  } else return;
});

// temporary channel system

client.on("voiceStateUpdate", (oldState, newState) => {
  if (index < 0) index = 0;
  if (index > maxChannels) index = maxChannels;
  const guild = newState.guild;
  let joinVoiceChannel = client.channels.cache.get("662837599857278987");
  try {
    modified = false;
    for (i = 1; i <= parseInt(maxChannels + 1); i++) {
      semiModified = false;
      verySemiModified = false;
      try {
        if (
          index < i &&
          guild.channels.cache.find(c => c.name === `Public Lounge #${i}`) &&
          guild.channels.cache.find(c => c.name === `Public Lounge #${i}`)
            .members.size <= 0
        ) {
          guild.channels.cache
            .find(c => c.name === `Public Lounge #${i}`)
            .delete();
          console.log(`${index} not changed`);
        } else if (
          index < i &&
          guild.channels.cache.find(c => c.name === `Public Lounge #${i}`) &&
          guild.channels.cache.find(c => c.name === `Public Lounge #${i}`)
            .members.size > 0
        ) {
          for (k = 1; k < i; k++) {
            if (
              !semiModified &&
              guild.channels.cache.find(
                c => c.name === `Public Lounge #${i}`
              ) &&
              !guild.channels.cache.find(c => c.name === `Public Lounge #${k}`)
            ) {
              guild.channels.cache
                .find(c => c.name === `Public Lounge #${i}`)
                .setName(`Public Lounge #${k}`);
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
          oldState.channel.name.includes(`Public Lounge #`) &&
          oldState.channel.members.size <= 0
        ) {
          oldState.channel.delete();
          for (j = i + 1; j <= parseInt(maxChannels + 1); j++) {
            try {
              if (
                guild.channels.cache.find(
                  c => c.name === `Public Lounge #${i + 1}`
                ) &&
                !guild.channels.cache.find(
                  c => c.name === `Public Lounge #${j}`
                ) &&
                !verySemiModified
              ) {
                guild.channels.cache
                  .find(c => c.name === `Public Lounge #${i + 1}`)
                  .setName(`Public Lounge #${i}`);
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
      const category = guild.channels.cache.get("653088922649362443");
      return guild.channels
        .create(`Public Lounge #${index}`, {
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

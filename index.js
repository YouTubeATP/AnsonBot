/* --- ALL PACKAGES --- */

require("es6-shim");

const Discord = require("discord.js"),
  express = require("express"),
  fs = require("fs"),
  http = require("http"),
  moment = require("moment"),
  db = require("quick.db");

/* --- ALL PACKAGES --- */

/* --- ALL GLOBAL CONSTANTS & FUNCTIONS --- */

const client = new Discord.Client(),
  config = require("/app/util/config"),
  fn = require("/app/util/fn"),
  userData = new db.table("USERDATA"),
  guildData = new db.table("GUILDDATA"),
  botData = new db.table("BOTDATA");

const app = express();
app.use(express.static("public"));

app.get("/", function(request, response) {
  response.sendFile(__dirname + "/views/index.html");
});

const listener = app.listen(process.env.PORT, function() {
  setInterval(() => {
    http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
  }, 225000);
});

let index = 1;

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
    game: {
      name: `MusicSounds`,
      type: "LISTENING"
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
    member
      .addRole(guild.roles.find("name", "Member"))
      .then(() => {
        client.channels
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
    member.addRole(guild.roles.find("name", "Bot")).catch(e => {
      console.log(e);
    });
  }
});

client.on("guildMemberRemove", async member => {
  let guild = member.guild;
  if (member.user.bot) return;
  let memberTag = member.user.id;
  if (guild.id === config.server) {
    client.channels
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
  if (message.channel.type != "text" || message.guild.id !== config.server)
    return;

  console.log(
    `${fn.time()} | ${message.guild.name} #${message.channel.name} | ${
      message.author.tag
    } > ${message.cleanContent}`
  );

  if (message.guild === null) return;

  if (
    message.guild.id === config.server &&
    message.author.bot &&
    message.author.id !== client.user.id &&
    message.channel.id !== "653091741351542825" &&
    message.channel.id !== "653091798498934825" &&
    message.channel.id !== "653133031292403742" &&
    message.channel.id !== "662243626050519060" &&
    message.channel.id !== "653130414847688705" &&
    message.channel.id !== "662273284322230282"
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

  let shared = {};

  if (
    message.content.startsWith(prefix) ||
    message.content.startsWith(mention) ||
    message.content.startsWith(mention1)
  ) {
    var args;

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
      message.channel.send(
        fn.embed(
          client,
          `I can't recognize this command! Do ${prefix}help and I'll DM you a list of my commands.`
        )
      );
      return message.delete().then(m => m.delete(5000));
    }

    if (command.botStaffOnly && !user.botStaff) {
      message.channel.send(
        fn.embed(client, "You do not have permissions to use this command!")
      );
      return message.delete().then(m => m.delete(5000));
    }
    if (
      command.guildPerms &&
      !message.member.hasPermission(command.guildPerms)
    ) {
      message.channel.send(
        fn.embed(client, "You do not have permissions to use this command!")
      );
      return message.delete().then(m => m.delete(5000));
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
  if (message.channel.name == undefined) return;
  if (message.guild.id !== config.server) return;
  if (message.author.id === "344335337889464357") return;
  if (message.channel.id === "662249455847735306") return;

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
      .then(m => m.delete(5000));
  }
});

// markdown overwrite

function clean(text) {
  if (typeof text === "string")
    return text
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203));
  else return text;
}

// temporary channel system

client.on("voiceStateUpdate", async (oldMember, newMember) => {
  const guild = newMember.guild;
  let joinVoiceChannel = client.channels.get("662837599857278987");
  if (
    await guild.channels.find("name", `Public Lounge #1`) &&
    guild.channels.find("name", `Public Lounge #1`).members.size <= 0
  ) {
    guild.channels.find("name", `Public Lounge #1`).delete("Served its purpose");
    console.log(index);
  }
  if (
    await guild.channels.find("name", `Public Lounge #2`) &&
    guild.channels.find("name", `Public Lounge #2`).members.size <= 0
  ) {
    guild.channels.find("name", `Public Lounge #2`).delete("Served its purpose");
    console.log(index);
  }
  if (
    await guild.channels.find("name", `Public Lounge #3`) &&
    guild.channels.find("name", `Public Lounge #3`).members.size <= 0
  ) {
    guild.channels.find("name", `Public Lounge #3`).delete("Served its purpose");
    console.log(index);
  }
  if (guild.channels.find("name", `Public Lounge #1`) && index === 1) {
    index = 2;
    console.log(index);
  }
  if (guild.channels.find("name", `Public Lounge #2`) && index === 2) {
    index = 3;
    console.log(index);
  }
  if (guild.channels.find("name", `Public Lounge #3`) && index === 3) {
    index = 4;
    console.log(index);
  }
  if (
    !guild.channels.find("name", `Public Lounge #1`) &&
    guild.channels.find("name", `Public Lounge #2`) &&
    index === 1
  ) {
    index = 2;
    guild.channels
      .find("name", `Public Lounge #2`)
      .setName.setName(`Public Lounge #1`);
    console.log(index);
  }
  if (
    !guild.channels.find("name", `Public Lounge #1`) &&
    !guild.channels.find("name", `Public Lounge #2`) &&
    guild.channels.find("name", `Public Lounge #3`) &&
    index === 1
  ) {
    index = 2;
    guild.channels
      .find("name", `Public Lounge #3`)
      .setName.setName(`Public Lounge #1`);
    console.log(index);
  }
  if (
    !guild.channels.find("name", `Public Lounge #1`) &&
    guild.channels.find("name", `Public Lounge #2`) &&
    guild.channels.find("name", `Public Lounge #3`) &&
    index === 2
  ) {
    index = 3;
    guild.channels
      .find("name", `Public Lounge #3`)
      .setName.setName(`Public Lounge #2`);
    console.log(index);
  }
  if (
    oldMember.voiceChannel &&
    oldMember.voiceChannel.name.includes(`Public Lounge #`) &&
    oldMember.voiceChannel.members.size <= 0
  ) {
    oldMember.voiceChannel.delete("Served its purpose");
    console.log(index--);
    if (index >= 2 && oldMember.voiceChannel.name.includes(1))
      guild.channels
        .find("name", `Public Lounge #2`)
        .setName(`Public Lounge #1`);
    if (
      index >= 3 &&
      (oldMember.voiceChannel.name.includes(1) ||
        oldMember.voiceChannel.name.includes(2))
    )
      guild.channels
        .find("name", `Public Lounge #3`)
        .setName(`Public Lounge #2`);
  }
  if (newMember.voiceChannel != joinVoiceChannel) return;
  else if (oldMember.voiceChannel != newMember.voiceChannel && index <= 3) {
    const category = guild.channels.get("653088922649362443");
    guild
      .createChannel(`Public Lounge #${index++}`, {
        type: "voice",
        parent: category
      })
      .then(newChannel => newMember.setVoiceChannel(newChannel));
  } else {
    newMember.setVoiceChannel(null);
    return newMember.send(
      fn.embed(
        client,
        "There may only be 3 public lounges present at a time! Consider joining one of them instead."
      )
    );
  }
});

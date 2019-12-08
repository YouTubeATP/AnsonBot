// start of index.js
// require various packages

const Discord = require('discord.js');
const bot = new Discord.Client();
const config = require("./config.json");
const fs = require('fs');
const moment = require('moment');
const express = require ('express');
const app = express();
const ms = require("ms");
const ytdl = require("ytdl-core");
const opus = require("node-opus");
const YouTube = require("simple-youtube-api");
const Enmap = require('enmap');
const mutedSet = new Set();

const RC = require('reaction-core')
const handler = new RC.Handler()

const blapi = require('blapi')
blapi.setLogging(true);

var shared = {}

const queue = new Map();

const youtube1 = new YouTube(config.youtube1)
const youtube2 = new YouTube(config.youtube2)

shared.queue = queue
shared.youtube1 = youtube1
shared.youtube2 = youtube2
shared.handler = handler

// Handle Events
const { scan, ensureDir } = require('fs-nextra');
const { relative, join, sep, extname } = require('path');
(async (directory  = join(__dirname, '/events/')) => {
		const files = await scan(directory, { filter: (stats, path) => stats.isFile() && extname(path) === '.js' })
			.catch(() => ensureDir(directory));
		if (!files) return true;
    return [...files.keys()].map(key => {
      const event = require(join(directory, ...relative(directory, key).split(sep)));
      if (!event || event.disabled) return;
      bot.on(event.name, event.run.bind(null, bot));
    });
})()

// other variables

var i;

var stopping = false;
shared.stopping = stopping

var voteSkipPass = 0;
shared.voteSkipPass = voteSkipPass

var voted = 0;
shared.voted = voted

var playerVoted = [];
shared.playerVoted = playerVoted

var activeMusicSelection = [];
shared.activeMusicSelection = activeMusicSelection

var playlist = false;
shared.playlist = playlist

var bannedwords = "fuck,nigg,fuk,cunt,cnut,bitch,dick,d1ck,$h1t,shit,pussy,blowjob,cock,c0ck,slut,whore,kill yourself,break your neck,kys,fuc,pu$$y,anal,xvideo,porn,asshole,a$$hole,kunt,anal,d.1.c.k,diu".split(",");

var userData = 0
shared.userData = userData

const owner = config.ownerID

bot.settings = new Enmap({
  name: "settings",
  fetchAll: false,
  autoFetch: true,
  cloneLevel: 'deep'
});

const defaultSettings = {   
  prefix: "m/",    
  censor: "off"
};

// functions for command handling

bot.commands = new Discord.Collection()
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
for (const file of commandFiles) {
	const command = require(`./commands/${file}`)
	bot.commands.set(command.name, command)
}

shared.bannedwords = bannedwords
shared.config = config

function printError(message, error, title) {
  var embed = new Discord.RichEmbed()
    .setColor(0x00bdf2)
    .setTitle(title)
    .addField("Error Message", error)
    .setFooter("MusEmbed™ | Clean Embeds, Crisp Music", bot.user.avatarURL)

  return message.channel.send(embed)
    .then(message.delete())
    .catch(console.error)
}

shared.printError = printError

// support server member flow

bot.on('guildMemberAdd', member => {
  let guild = member.guild;
  let memberTag = member.user.id;
  if (guild.id === config.serverID && !member.user.bot) {
  member.addRole(guild.roles.find("name", "Member")).then(() => {
        bot.channels.get('585811822305738772').send("<@" + memberTag + "> has joined **MusicSounds's Hangout**. Welcome, <@" + memberTag + ">.");
      }).catch(e => {
        console.log(e);
      });
} else if (guild.id === config.serverID && member.user.bot) {
  member.addRole(guild.roles.find("name", "Bot")).catch(e => {
        console.log(e);
      });
}
});

bot.on('guildMemberRemove', member => {
  let guild = member.guild;
  if(member.user.bot) return;
  let memberTag = member.user.id;
  if (guild.id === config.serverID) {
        bot.channels.get('585811822305738772').send("<@" + memberTag + "> has left **MusicSounds's Hangout**. Farewell, <@" + memberTag + ">.");
}});

// bot status

bot.on("ready", () =>  {
    setInterval(() => {
    const promises = [
	      bot.shard.broadcastEval('this.guilds.size'),
	      bot.shard.broadcastEval('this.guilds.reduce((prev, guild) => prev + guild.memberCount, 0)'),
];
    return Promise.all(promises)
    .then(results => {
      
        const totalGuilds = results[0].reduce((prev, guildCount) => prev + guildCount, 0);
		const totalMembers = results[1].reduce((prev, memberCount) => prev + memberCount, 0);
      
        bot.user.setStatus('available')
      
        bot.user.setPresence({
            game: {
                name: "MusicSounds",
                type: "LISTENING"
            }
        });
      
    });
    }, 20000);
});

// detect reaction-adding

bot.on('messageReactionAdd', (messageReaction, user) => handler.handle(messageReaction, user));

// profanity filter and command detection
bot.on('message', async message => {
  if (message.channel.type === 'dm') {
    if (message.author.bot() && message.embeds.length > 0) channel.send(message.author.id + ' | ' + message.author.username + ' | <embed>')
    const channel = bot.channels.get('605785120976404560');
    message.content = message.content.replace(new RegExp("@everyone|@here", "gi"), "@mention");
    channel.send(message.author.id + ' | ' + message.author.username + ' | ' + message.content)
  }
});

bot.on('message', async message => {
  if (message.channel.name == undefined) return

  console.log(message.guild.name, '|', message.author.tag, '|', message.content)
  
  if (message.guild.id === config.serverID && message.author.bot && message.channel.id !== "585811595884625927" && message.channel.id !== "585811848159559680" && message.channel.id !== "585811822305738772" && message.channel.id !== "585811927565860865" && message.channel.id !== "585814273020788736" && message.channel.id !== "596211334782386177" && message.channel.id !== "596210766944665600" && message.channel.id !== "585812719043870780" && message.channel.id !== "595151500603555871" && message.channel.id !== "602730640269508611" && message.channel.id !== "605785120976404560" ) return message.delete();
    
  let sender = message.author;
  let msg = message.content.toLowerCase();
  const ownerID = config.ownerID
  const guildConf = bot.settings.ensure(message.guild.id, defaultSettings)
  const prefix = guildConf.prefix
  shared.prefix = prefix
  const censor = guildConf.censor
  const mention = "<@414440610418786314> "
  const mention1 = "<@!414440610418786314> "
  shared.msg = msg
  shared.mention = mention
  shared.mention1 = mention1
  const censors = censor
  if (bot.user.id === sender.id) { return }
  let nick = sender.username

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  
  if (message.guild === null) return;
  if (message.author.bot) return;
  
  if (censors === "on") {
    for (i=0;i<bannedwords.length;i++) {
      if (message.content.toLowerCase().includes(bannedwords[i])) {
        message.delete().catch(O_o=>{})
        return message.reply("please refrain from using such contemptable words.").then(m => m.delete(5000));
      }  
    }
  }

    const serverQueue = queue.get(message.guild.id);
  
  if (msg.startsWith(prefix) || msg.startsWith(mention) || msg.startsWith(mention1)) {
    
    if (!message.guild.me.hasPermission("SEND_MESSAGES")) {
      
      return bot.fetchUser(message.member).then((user) => {
      user.send({embed: {
        color: 0x00bdf2,
        title: "I do not have sufficient permissions!",
        description:(`I cannot talk in the guild \`${message.guild.name}\`! Please notify a server administrator.`),
        footer: {
          icon_url: bot.user.avatarURL,
          text: "MusEmbed™ | Clean Embeds, Crisp Music"
        }
      }
      }
      )
      }).then(message.delete());
    
    };
    
    if (!message.guild.me.hasPermission("EMBED_LINKS")) {
      
      message.delete();
      return bot.fetchUser(message.member).then((user) => {
    user.send({embed: {
      color: 0x00bdf2,
      title: "I do not have sufficient permissions!",
      description:(`I cannot embed messages in the guild \`${message.guild.name}\`! Please notify a server administrator.`),
      footer: {
          icon_url: bot.user.avatarURL,
          text: "MusEmbed™ | Clean Embeds, Crisp Music"
      }
  }})}).then(message.delete());
      
    };
    
    var argsNEW
    
    if (msg.startsWith(prefix)) {
      argsNEW = message.content.slice(prefix.length).split(/\s+/u)
      shared.prefix = prefix
    } else if (msg.startsWith(mention)) {
      argsNEW = message.content.slice(mention.length).split(/\s+/u)
      shared.prefix = mention
    } else if (msg.startsWith(mention1)) {
      argsNEW = message.content.slice(mention1.length).split(/\s+/u)
      shared.prefix = mention1
    }
    
		const commandName = argsNEW.shift().toLowerCase()
		shared.commandName = commandName
    
    if ( message.content === prefix || message.content === mention || message.content === mention1 ) return;
        
		const command = bot.commands.get(commandName) || bot.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName))

		if ( !command ) return;
    
    console.log(argsNEW)
		
		try {
			await command.run(bot, message, argsNEW, shared)
		} catch (error) {
			message.channel.send(error)
		}
	}
  
});

// invite link detection for support server

bot.on('message', message => {
    if (message.channel.name == undefined) return
    if (message.guild.id !== config.serverID) return;
    if (message.author.id === "586801954567618571" || message.author.id === "586802137040683028") return;
    
    const perms = message.member.permissions;
    const admin = perms.has("ADMINISTRATOR", true);
    if (admin) return;
    
    const links = ["DISCORD.ME", "DISCORD.GG", "DISCORDAPP.COM", "INVITE.GG", "DISCORDBOTS.ORG", "DISC.GG", "DISCORD.CHAT", "DISCSERVS.CO", "DISCORD.BOTS.GG", "DISCORD.IO"];
    const author = message.author;
    const bannedlink = message.content;
    const bannedlinks = message.content.toUpperCase();
  
    if (links.some(link =>bannedlinks.includes(link))) {
        message.delete();
        return message.reply("please refrain from advertising in this server.");
    }
});

function clean(text) {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
      return text;
}

bot.login(config.token);
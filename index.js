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

// post stats to discordbots.org

const DBL = require("dblapi.js");
const dbl = new DBL(config.dbltoken, { statsInterval: 900000 }, bot);

dbl.on('posted', () => {
  console.log('Server count posted!');
});
                                        
dbl.on('error', e => {
 console.log(`Oops! ${e}`);
});

// post stats to mythicalbots.xyz

const MythicalAPI = require("mythical-api");
let API = new MythicalAPI("GryfB-p2qHtYZE8urU5YYeJBeq0-4Vnk4oQ.1eUC8xh0z72.qo");

bot.on('ready', ()=> {
  
    API.postStats(bot.guilds.size, bot.user.id);
  
        setInterval(function() {
            API.postStats(bot.guilds.size, bot.user.id);
        }, 900000);
  
});

// post stats to other bot lists

bot.on("ready", () =>  {
  
    blapi.handle(bot, {
        "bots.ondiscord.xyz": "0c33a4ba8baaad462d07a7f76c870f46",
        'botsfordiscord.com': 'b034d05d7563f445f0675af50fcd9dc9f037916e9df587a913087adec6494f0b06151d4ef4c0e5ca34308be569c79bbb26ccdc6710054bca06f6700f49ae2998',
        'botlist.space': '8b4fbad11dbb49beb56f65fdc3f5e2793d7603a76e6f47d70a321e7200610933d73cac410c6f2e5ac8d355da5efea837',
        'discordapps.dev': '806277c41d92f48334e89aa7a86af7067f8463d7',
        "discord.boats": "JpMMZGs4N1iRXIHDqXpkEosM6uQpfSMITKVe82MFviz6TuKSvdHJPxRhA1vMFzP4XIwvrxu0WRF01OF3w5xZSsXtiQxvR8jaEszvuX19D7zP6vsMbtLPjoInjK4otDKFzTHcrzTcO5BL7DCKjADNWbkr5Uv",
        'lbots.org': '85122715e6bcda2148f3984ad0bc1a38f615937e39cce516d16b5363a078db9dc291aeaa86bd639c154abc50a30f60fe93c5d141875ef07bbd65647a371fb7aa',
        'discord.bots.gg': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGkiOnRydWUsImlkIjoiMzQ0MzM1MzM3ODg5NDY0MzU3IiwiaWF0IjoxNTYxOTcxNzYwfQ.cR49aGOlrxyQ15ibqLWTT94yKxib0TG2Oo1B1tJOfmM',
        'discordsbestbots.xyz': 'fc04b6420d06677918defa27d387168c7aa14f0d',
        "discordbots.fun": "hPZUC7reoL8nwhYraDUPbPvuQe31DSDU",
        'discordbotlist.com': 'Bot 21efedbb4ebea98f76cb15f49951a6bd86f00b3a74f524e64ffa3dd60fc890b1',
        'divinediscordbots.com': '251fc9cf4719832e0fe98a31904f10a12af69363bb2a8e47c83841854896358cb427fc92096e1954cc692477b1e1c2d738715a196b65e62304f822f2cb219237',
        "discordbotreviews.xyz": "egUF6w5vwr2y4LVnsyvRt.iGrO5oA69ZuVBkEFZPwGNBy5CHNwBjR3T1Qe42Fam59lg8Cg4TUITlW4aL",
        "discordbotslist.us.to": "ea4fc017c66245a2dcc1abc8ecf11bef",
}, 30)
  
});

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
  prefix: "em/",    
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
        bot.channels.get('585811822305738772').send("<@" + memberTag + "> has joined **MusEmbed Support**. Welcome, <@" + memberTag + ">.");
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
        bot.channels.get('585811822305738772').send("<@" + memberTag + "> has left **MusEmbed Support**. Farewell, <@" + memberTag + ">.");
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
        const index = Math.floor(parseInt(Math.random() * 2) + parseInt(0));
        const activities_list = [
            `${totalGuilds} servers`,
            `${totalMembers} users`,
        ];
      
        bot.user.setPresence({
            game: {
                name: (activities_list[index]),
                type: 3,
                url: "https://discordbots.org/bot/414440610418786314"
            }
        });
      
    });
    }, 20000);
});

// bot guild joinlogs

bot.on("guildCreate", guild => {
  const guildConf = bot.settings.ensure(guild.id, defaultSettings)
  const prefix = guildConf.prefix
  
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  guild.owner.send({embed: {
    color: (0x00bdf2),
    title: "Thank you for choosing MusEmbed!",
    description: (`To get started, use the command ${guildConf.prefix}help to show a list of our commands.`),
    footer: {
      icon_url: bot.user.avatarURL,
      text: ("MusEmbed™ | Clean Embeds, Crisp Music")
  }}})
  return bot.shard.broadcastEval('this.guilds.size')
   .then(results => {
  let sicon = guild.iconURL
  var embed = new Discord.RichEmbed()
    .setColor("GREEN")
    .setTitle("I've joined a server!")
    .setDescription(`I am now in \`${results.reduce((prev, val) => prev + val, 0)}\` servers`)
    .setThumbnail(sicon)
    .addField("Name", guild.name, true)
    .addField("Owner", guild.owner, true)
    .addField("Region", guild.region, true)
    .addField("Created At", guild.createdAt)
    .addField("Members", guild.memberCount, true)
    .addField("Humans", guild.members.filter(member => !member.user.bot).size, true)
    .addField("Bots", Math.round(guild.memberCount - guild.members.filter(member => !member.user.bot).size), true)
    .addField("ID", guild.id)
    .setFooter("MusEmbed™ | Clean Embeds, Crisp Music", bot.user.avatarURL)
  
  bot.channels.get(`585811927565860865`).send(embed)
  })
})

// bot guild leave logs

bot.on("guildDelete", guild => {
  bot.settings.delete(guild.id);
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  return bot.shard.broadcastEval('this.guilds.size')
   .then(results => {
  let sicon = guild.iconURL
  var embed = new Discord.RichEmbed()
    .setColor("RED")
    .setTitle("I've left a server!")
    .setDescription(`I am now in \`${results.reduce((prev, val) => prev + val, 0)}\` servers`)
    .setThumbnail(sicon)
    .addField("Name", guild.name, true)
    .addField("Owner", guild.owner, true)
    .addField("Region", guild.region, true)
    .addField("Created At", guild.createdAt)
    .addField("Members", guild.memberCount, true)
    .addField("Humans", guild.members.filter(member => !member.user.bot).size, true)
    .addField("Bots", Math.round(guild.memberCount - guild.members.filter(member => !member.user.bot).size), true)
    .addField("ID", guild.id)
    .setFooter("MusEmbed™ | Clean Embeds, Crisp Music", bot.user.avatarURL)
  
  bot.channels.get(`585811927565860865`).send(embed)
  })
});

// detect reaction-adding

bot.on('messageReactionAdd', (messageReaction, user) => handler.handle(messageReaction, user));

// profanity filter and command detection

bot.on('message', async message => {
  
  if (message.author.bot) return
  
  console.log(message.guild.name, '|', message.author.tag, '|', message.content)
  
  if (message.guild.id === config.serverID && message.author.bot && message.channel.id !== "585811595884625927" && message.channel.id !== "585811848159559680" && message.channel.id !== "585811822305738772" && message.channel.id !== "585811927565860865" && message.channel.id !== "585814273020788736" && message.channel.id !== "596211334782386177" && message.channel.id !== "596210766944665600" && message.channel.id !== "585812719043870780" && message.channel.id !== "595151500603555871" && message.channel.id !== "602730640269508611") return message.delete();
    
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
  }})}).then(message.delete());
    
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
  
    if (message.guild.id !== config.serverID) return;
    if (message.channel.id === "586801954567618571" || message.channel.id === "586802137040683028") return;
    
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
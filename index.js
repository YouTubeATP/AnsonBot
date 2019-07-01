const Discord = require('discord.js');
const bot = new Discord.Client();
const config = require("./config.json");
const fs = require('fs');
const moment = require('moment'); // the moment package. to make this work u need to run "npm install moment --save 
const http = require ('http');
const express = require ('express');
const app = express();
const server = http.createServer(app);
const prefix = 'em/' // The text before commands
const ms = require("ms"); // npm install ms -s
const ytdl = require("ytdl-core");
const opus = require("node-opus");
const YouTube = require("simple-youtube-api");
const Enmap = require('enmap');
const mutedSet = new Set();
const queue = new Map();
const youtube = new YouTube(config.youtube)

const blapi = require('blapi')
blapi.setLogging(true);

bot.on("ready", () =>  {
  
    blapi.handle(bot, {
        'botsfordiscord.com': 'b034d05d7563f445f0675af50fcd9dc9f037916e9df587a913087adec6494f0b06151d4ef4c0e5ca34308be569c79bbb26ccdc6710054bca06f6700f49ae2998',
        'botlist.space': '8b4fbad11dbb49beb56f65fdc3f5e2793d7603a76e6f47d70a321e7200610933d73cac410c6f2e5ac8d355da5efea837',
        'discordsbestbots.xyz': 'acdd0cffdbfe3846452608f20c8315f9043dc4de',
        'discordbotlist.com': 'a8afb8c79f65cdedd3183b01fbc042b17dfcc49894f124a29f196c5e6c253027',
        'discordbots.group': '0fcdcf13b394dabc2738640ce7daec8b8b22',
        'divinediscordbots.com': '251fc9cf4719832e0fe98a31904f10a12af69363bb2a8e47c83841854896358cb427fc92096e1954cc692477b1e1c2d738715a196b65e62304f822f2cb219237'
}, 30)
  
});

const DBL = require("dblapi.js");
const dbl = new DBL(config.dbltoken, { statsInterval: 900000 }, bot);

dbl.on('posted', () => {
  console.log('Server count posted!');
});

dbl.on('error', e => {
 console.log(`Oops! ${e}`);
});

var stopping = false;
var voteSkipPass = 0;
var voted = 0;
var playerVoted = [];
var totalCost = 1680.37;
var currentlyHave = 22;
var perMonth = 120;
var bannedwords = "fuck,nigg,fuk,cunt,cnut,bitch,dick,d1ck,$h1t,shit,pussy,blowjob,cock,c0ck,slut,whore,kys,fuc,pu$$y,xvideo,xvideos,porn,asshole,a$$hole,kunt,knut,d.1.c.k".split(",");

var userData = 0

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

bot.commands = new Discord.Collection()
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
for (const file of commandFiles) {
	const command = require(`./commands/${file}`)
	bot.commands.set(command.name, command)
}

var shared = {}

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

bot.on('guildMemberAdd', member => {
  let guild = member.guild;
  if (guild.id === config.serverID)
  if (member.user.bot) return;
  let memberTag = member.user.id;
  if (guild.id === config.serverID) {
  member.addRole(guild.roles.find("name", "Member")).then(() => {
        bot.channels.get('585811822305738772').send("<@" + memberTag + "> has joined **MusEmbed Support**. Welcome, <@" + memberTag + ">.");
      }).catch(e => {
        console.log(e);
      });
}});

bot.on('guildMemberRemove', member => {
  let guild = member.guild;
  if (guild.id === config.serverID)
  if(member.user.bot) return;
  let memberTag = member.user.id;
  if (guild.id === config.serverID) {
        bot.channels.get('585811822305738772').send("<@" + memberTag + "> has left **MusEmbed Support**. Farewell, <@" + memberTag + ">.");
}});

bot.on("ready", () =>  {
    setInterval(() => {
    return bot.shard.broadcastEval('this.guilds.size')
    .then(results => {
        bot.user.setStatus('available')
        const index = Math.floor(parseInt(Math.random() * 3) + parseInt(0));
        const activities_list = [
            `${results.reduce((prev, val) => prev + val, 0)} servers ask for help`,
            `${results.reduce((prev, val) => prev + val, 0)} servers use embeds`, 
            `${results.reduce((prev, val) => prev + val, 0)} servers play music`,
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

bot.on("guildCreate", guild => {
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  return bot.shard.broadcastEval('this.guilds.size')
   .then(results => {
  let sicon = guild.iconURL
  var embed = new Discord.RichEmbed()
    .setColor(0x00bdf2)
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

bot.on("guildDelete", guild => {
  bot.settings.delete(guild.id);
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  return bot.shard.broadcastEval('this.guilds.size')
   .then(results => {
  let sicon = guild.iconURL
  var embed = new Discord.RichEmbed()
    .setColor(0x00bdf2)
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
})

bot.on('message', async message => {
  
  console.log(message.guild.name, '|', message.author.tag, '|', message.content)
    
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
        return message.reply("please refrain from using such contemptable words.");
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
          text: "MusEmbed™ | Affiliated with Paraborg Discord Bots"
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
          text: "MusEmbed™ | Affiliated with Paraborg Discord Bots"
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
    
    if (commandName === "play" && !message.guild.me.hasPermission("CONNECT")) {
      
      return bot.fetchUser(message.member).then((user) => {
    user.send({embed: {
      color: 0x00bdf2,
      title: "I do not have sufficient permissions!",
      description:(`I cannot connect to voice channels in the guild \`${message.guild.name}\`! Please notify a server administrator.`),
      footer: {
          icon_url: bot.user.avatarURL,
          text: "MusEmbed™ | Affiliated with Paraborg Discord Bots"
      }
  }})}).then(message.delete());
      
    } else if (commandName === "play" && !message.guild.me.hasPermission("SPEAK")) {
      
      return bot.fetchUser(message.member).then((user) => {
    user.send({embed: {
      color: 0x00bdf2,
      title: "I do not have sufficient permissions!",
      description:(`I cannot talk in voice channels in the guild \`${message.guild.name}\`! Please notify a server administrator.`),
      footer: {
          icon_url: bot.user.avatarURL,
          text: "MusEmbed™ | Affiliated with Paraborg Discord Bots"
      }
  }})}).then(message.delete());
      
    } else if (commandName === "play") {
      
        let args = message.content.slice(shared.prefix.length + 5).trim()
        const searchString = args
        const voiceChannel = message.member.voiceChannel;
        
        message.delete().catch(O_o=>{});
        if(!voiceChannel) return message.channel.send('You need to be in a voice channel to execute this command!')
        const permissions = voiceChannel.permissionsFor(bot.user)
        if(!permissions.has('CONNECT')) return message.channel.send('I can\'t connect to your channel, duh! How do you expect me to play you music?')
        if(!permissions.has('SPEAK')) return message.channel.send('I can\'t speak here, duh! How do you expect me to play you music?')
        
    if(!args[0]) return message.reply('please provide a search term, url or playlist link!')
    if(stopping) stopping = false;
      
    if(args[0].match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)){
      
            return message.reply ("directly playing a playlist is not supported.")
      
        } else {
            try {
              
                var video = await youtube.getVideo(args[0])
                
            } catch(error){
                try{
                    var videos = await youtube.searchVideos(searchString, 10);
                    let index = 0;
                    let bicon = bot.user.displayAvatarURL
                    let videosEmbed = new Discord.RichEmbed()
                    .setTitle("Song Selection")
                    .setColor(0x00bdf2)
                    .addField("Songs:", videos.map(video2 => `**${++index} -** ${video2.title}`))
                    .setFooter("MusEmbed™ | Clean Embeds, Crisp Music", bicon)
                    message.channel.send(videosEmbed)
                    message.channel.send("Please provide a value from 1 to 10 to select a video! You have 20 seconds.")
                    try{
                        var response = await message.channel.awaitMessages(message2 => message2.content > 0 && message2.content < 11, {
                                    maxMatches: 1,
                    time: 20000, errors: ['time']
                });
                    }catch(err){
                        return message.channel.send('No value given, or value was invalid. Video selection canceled.')
                    }
                const videoIndex = parseInt(response.first().content);
                        var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
                }catch(err){
                    console.log(err)
                    return await message.channel.send("No results could be found.")
                }
            }
            return handleVideo(video, message, voiceChannel);
        }
    } else if (commandName === "pause") {
      message.delete().catch(O_o=>{});
      if (!message.member.voiceChannel) return await message.channel.send("You aren't in a voice channel!");
		  if (serverQueue && serverQueue.playing) {
			serverQueue.playing = false;
			serverQueue.connection.dispatcher.pause();
			return message.channel.send('Music paused. Use the command \`' + prefix + 'resume\` to resume playing.');
		}
		return message.channel.send('Nothing is playing!');
	} else if (commandName === "resume") {
    message.delete().catch(O_o=>{});
    if (!message.member.voiceChannel) return await message.channel.send("You aren't in a voice channel!");
		if (serverQueue && !serverQueue.playing) {
			serverQueue.playing = true;
			serverQueue.connection.dispatcher.resume();
			return message.channel.send('Music resumed.');
		}
		return message.channel.send('Either the queue is empty, or there\'s already a song playing.');
	} else if (commandName === "stop") {
        message.delete().catch(O_o=>{});
        if(!message.member.voiceChannel) return await message.channel.send("You aren't in a voice channel!")
        if(!serverQueue) return await message.channel.send("Nothing is playing!")
        if (!message.member.hasPermission("MOVE_MEMBERS")) return await message.reply("you don't have sufficient permissions!")
    stopping = true;
    serverQueue.voiceChannel.leave();
        return serverQueue.textChannel.send('Cya, I\'m leaving!');
    } else if (commandName === "skip") {
        message.delete().catch(O_o=>{});
            if (!message.member.voiceChannel) return await message.channel.send("You aren't in a voice channel!")
            if (!serverQueue) return await message.channel.send("Nothing is playing!")
        const voiceChannel = message.member.voiceChannel;
        for (var x = 0; x < playerVoted.length; x++) {
            if(sender === playerVoted[x]){
            return message.reply(` you think you run the place? You can\'t vote twice!`)
        }
        }
        voted++;
        playerVoted.push(sender);
        if(voteSkipPass === 0){
            voiceChannel.members.forEach(function() {
             voteSkipPass++;
            })
        }
        var voteSkipPass1 = voteSkipPass - 1;
        var voteSkip = Math.floor(voteSkipPass1/2);
        if(voteSkip === 0) voteSkip = 1;
        if(voted >= voteSkip){
        await message.channel.send('Vote skip has passed!')
            serverQueue.connection.dispatcher.end();
        voted = 0;
        voteSkipPass = 0;
        playerVoted = [];
        }else{
            await message.channel.send(voted + '\/' + voteSkip + ' players voted to skip!')
        }
        return undefined;
    } else if (commandName === "np") {
        message.delete().catch(O_o=>{});
        if(!serverQueue) return await message.channel.send("Nothing is playing!")
        
        return await message.channel.send(`Now playing: **${serverQueue.songs[0].title}**`)
    } else if (commandName === "volume") {
        let args = message.content.slice(shared.prefix.length + 7).trim()
        message.delete().catch(O_o=>{});
        if(!message.member.voiceChannel) return await message.channel.send("You aren't in a voice channel!")
        if(!serverQueue) return await message.channel.send("Nothing is playing!");
        if(!args) return await message.channel.send(`The current volume is **${serverQueue.volume}**`)
    if ( args === "0" || args === "1" || args === "2" || args === "3" || args === "4" || args === "5" || args === "6" || args === "7" || args === "8" || args === "9" || args === "10" ) {
      
        serverQueue.connection.dispatcher.setVolumeLogarithmic(args / 10)
        serverQueue.volume = args;
        return await message.channel.send(`I set the volume to: **${args}**`);
    }
      
      return await message.reply('please choose an integer between 0 and 10!');
    
    } else if (commandName === "queue") {
        message.delete().catch(O_o=>{});
        if(!serverQueue) return await message.channel.send("Nothing is playing!");
        let bicon = bot.user.displayAvatarURL
        let queueEmbed = new Discord.RichEmbed()
        .setTitle("Queue")
        .setColor(0x00bdf2)
        .setDescription(`**Now playing:** ${serverQueue.songs[0].title} \n**Loop:** \`${serverQueue.loop}\``)
        .addField("Songs:", serverQueue.songs.map(song => `**-** ${song.title}`))
        .setFooter("MusEmbed™ | Clean Embeds, Crisp Music", bicon)
        return await message.channel.send(queueEmbed)
    } else if (commandName === "loop") {
          message.delete().catch(O_o=>{});
          if (!message.member.voiceChannel) return message.channel.send('You are not in a voice channel!');
          if(!serverQueue) return message.channel.send("Nothing is playing!");
          if (serverQueue.loop === "off") {
            serverQueue.loop = "single"
              return message.channel.send ("Loop for the current queue has been toggled to `single`. Use this command again to toggle loop to `all`.");
          } else if (serverQueue.loop === "single") {
            serverQueue.loop = "all"
          return message.channel.send ("Loop for the current queue has been toggled `all`. Use this command again to disable loop.");
    }
          serverQueue.loop = "off"
          return message.channel.send ("Loop for the current queue has been toggled `off`. Use this command again to toggle loop to `single`.");
    }
    
		const command = bot.commands.get(commandName) || bot.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName))

		if (!command) return;
    
    console.log(argsNEW)
		
		try {
			await command.run(bot, message, argsNEW, shared)
		} catch (error) {
			message.channel.send(error)
		}
	}
  
});

bot.on('message', message => {
    if (message.author.bot) return;
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

async function handleVideo(video, message, voiceChannel, playlist = false){
    const serverQueue = queue.get(message.guild.id)
    const song = {
                id: video.id,
                title: video.title,
                url: `https://www.youtube.com/watch?v=${video.id}`,
                channel: video.channel.title,
                durationm: video.duration.minutes,
                durations: video.duration.seconds,
                durationh: video.duration.hours,
                durationd: video.duration.days,
                publishedAt: video.publishedAt,
            }
        
    if (!serverQueue) {
    var queueConstruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 10,
      playing: true,
      loop: "off"
    };
    queue.set(message.guild.id, queueConstruct);

        queueConstruct.songs.push(song);

        let bicon = bot.user.displayAvatarURL
        let queueemb = new Discord.RichEmbed()
          .setTitle(`Song added to queue!`)
          .setColor(`#0x00bdf2`)
          .addField(`Video`, `[${song.title}](https://www.youtube.com/watch?v=${song.id}})`)
          .addField(`Uploader`, `${song.channel}`, true)
          .addField(`Video ID`, song.id , true)
          .addField(`Date Published`, `${song.publishedAt}`, true)
          .addField(`Duration`, `\`${song.durationd}\` Days, \`${song.durationh}\` Hours, \`${song.durationm}\` Minutes and \`${song.durations}\` Seconds`, true)
          .setFooter("MusEmbed™ | Clean Embeds, Crisp Music", bicon)
        message.channel.send (queueemb)
      
        try {
            var connection = await voiceChannel.join();
            queueConstruct.connection = connection;
            play(message.guild, queueConstruct.songs[0]);
        } catch (error) {
            console.error(error)
            queue.delete(message.guild.id)
            return message.channel.send({embed: {
            color: 0x00bdf2,
            description:("An error occured!"),
            footer: {
                icon_url: bot.user.avatarURL,
                text: "MusEmbed™ | Clean Embeds, Crisp Music"
            }
  }})
        }
    } else {
        serverQueue.songs.push(song);
        if(playlist) return undefined;
        
        let bicon = bot.user.displayAvatarURL
        let queueemb = new Discord.RichEmbed()
          .setTitle(`Song added to queue!`)
          .setColor(`#0x00bdf2`)
          .addField(`Video`, `[${song.title}](https://www.youtube.com/watch?v=${song.id}})`)
          .addField(`Uploader`, `${song.channel}`, true)
          .addField(`Video ID`, song.id , true)
          .addField(`Date Published`, `${song.publishedAt}`, true)
          .addField(`Duration`, `\`${song.durationd}\` Days, \`${song.durationh}\` Hours, \`${song.durationm}\` Minutes and \`${song.durations}\` Seconds`, true)
          .setFooter("MusEmbed™ | Clean Embeds, Crisp Music", bicon)
        return message.channel.send (queueemb)
    }
    return undefined;
}

function play(guild, song){
    const serverQueue = queue.get(guild.id)
    if (stopping) {
       queue.delete(guild.id);
       return;
    }
    
    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return undefined;
    }
  
    const dispatcher = serverQueue.connection.playStream(ytdl(song.url), {bitrate: 384000 /* 384kbps */})
        .on('end', reason => {
			    if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
			    else console.log(reason);
        
          if(!serverQueue.songs){
                serverQueue.voiceChannel.leave();
                queue.delete(guild.id);
                voted = 0;
            voteSkipPass = 0;
            playerVoted = [];
                return undefined;
        }
        
          if (serverQueue.loop === "off") serverQueue.songs.shift();
          if (serverQueue.loop === "all") serverQueue.songs.push(serverQueue.songs.shift());
          
        voted = 0;
        voteSkipPass = 0;
        playerVoted = [];
                play(guild, serverQueue.songs[0]);
            })
        .on('error', error => console.error(error));
      dispatcher.setVolumeLogarithmic(serverQueue.volume / 10);
      if (song) {
        serverQueue.textChannel.send(`Now playing: **${song.title}**`)
    }
}

function sortObject() {
    var arr = [];
    for (var prop in userData) {
        if (userData.hasOwnProperty(prop)) {
            arr.push({
            'key': prop,
            'value': userData[prop].money
            });
        }
    }
    arr.sort(function(a, b) { return b.value - a.value; });
    return arr;
}

bot.login(config.token);
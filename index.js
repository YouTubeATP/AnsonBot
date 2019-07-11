const Discord = require('discord.js');
const bot = new Discord.Client();
const config = require("./config.json");
const fs = require('fs');
const moment = require('moment');
const http = require ('http');
const express = require ('express');
const app = express();
const server = http.createServer(app);
const ms = require("ms");
const ytdl = require("ytdl-core");
const opus = require("node-opus");
const YouTube = require("simple-youtube-api");
const Enmap = require('enmap');
const mutedSet = new Set();
const queue = new Map();
const youtube = new YouTube(config.youtube)

const RC = require('reaction-core')
const handler = new RC.Handler()

const blapi = require('blapi')
blapi.setLogging(true);

bot.on("ready", () =>  {
  
    blapi.handle(bot, {
        'botsfordiscord.com': 'b034d05d7563f445f0675af50fcd9dc9f037916e9df587a913087adec6494f0b06151d4ef4c0e5ca34308be569c79bbb26ccdc6710054bca06f6700f49ae2998',
        'botlist.space': '8b4fbad11dbb49beb56f65fdc3f5e2793d7603a76e6f47d70a321e7200610933d73cac410c6f2e5ac8d355da5efea837',
        'discordapps.dev': '806277c41d92f48334e89aa7a86af7067f8463d7',
        "discord.boats": "JpMMZGs4N1iRXIHDqXpkEosM6uQpfSMITKVe82MFviz6TuKSvdHJPxRhA1vMFzP4XIwvrxu0WRF01OF3w5xZSsXtiQxvR8jaEszvuX19D7zP6vsMbtLPjoInjK4otDKFzTHcrzTcO5BL7DCKjADNWbkr5Uv",
        'lbots.org': '85122715e6bcda2148f3984ad0bc1a38f615937e39cce516d16b5363a078db9dc291aeaa86bd639c154abc50a30f60fe93c5d141875ef07bbd65647a371fb7aa',
        'discord.bots.gg': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGkiOnRydWUsImlkIjoiMzQ0MzM1MzM3ODg5NDY0MzU3IiwiaWF0IjoxNTYxOTcxNzYwfQ.cR49aGOlrxyQ15ibqLWTT94yKxib0TG2Oo1B1tJOfmM',
        'discordsbestbots.xyz': 'acdd0cffdbfe3846452608f20c8315f9043dc4de',
        'discordbots.group': '0fcdcf13b394dabc2738640ce7daec8b8b22',
        'discordbotlist.com/api/bots/414440610418786314/stats': '7df5a826f42d3b7ec31cce674d77add4c9853d60f6072beb2fb9afca052f516e',
        'divinediscordbots.com': '251fc9cf4719832e0fe98a31904f10a12af69363bb2a8e47c83841854896358cb427fc92096e1954cc692477b1e1c2d738715a196b65e62304f822f2cb219237',
        "discordbotreviews.xyz": "egUF6w5vwr2y4LVnsyvRt.iGrO5oA69ZuVBkEFZPwGNBy5CHNwBjR3T1Qe42Fam59lg8Cg4TUITlW4aL",
        "discordbotslist.us.to": "ea4fc017c66245a2dcc1abc8ecf11bef",
        "mythicalbots.xyz": "GryfB-p2qHtYZE8urU5YYeJBeq0-4Vnk4oQ.1eUC8xh0z72.qo"
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

var i;
var stopping = false;
var voteSkipPass = 0;
var voted = 0;
var playerVoted = [];
var totalCost = 1680.37;
var currentlyHave = 22;
var perMonth = 120;
var playlist = false;
var bannedwords = "fuck,nigg,fuk,cunt,cnut,bitch,dick,d1ck,$h1t,shit,pussy,blowjob,cock,c0ck,slut,whore,kys,fuc,pu$$y,anal,xvideo,porn,asshole,a$$hole,kunt,anal,d.1.c.k,diu".split(",");

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

bot.on("guildCreate", guild => {
  const guildConf = bot.settings.ensure(guild.id, defaultSettings)
  const prefix = guildConf.prefix
  
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  guild.owner.send({embed: {
    color: 0x00bdf2,
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
});

bot.on('messageReactionAdd', (messageReaction, user) => handler.handle(messageReaction, user));

bot.on('message', async message => {
  
  console.log(message.guild.name, '|', message.author.tag, '|', message.content)
  
  if (message.guild.id === config.serverID && message.author.bot && message.channel.id !== "585811595884625927" && message.channel.id !== "585811848159559680" && message.channel.id !== "585811822305738772" && message.channel.id !== "585811927565860865" && message.channel.id !== "585811949963444244" && message.channel.id !== "585814273020788736" && message.channel.id !== "596211334782386177" && message.channel.id !== "596210766944665600" && message.channel.id !== "585812719043870780" && message.channel.id !== "595151500603555871") return message.delete();
    
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
    
    if (commandName === "play") {
      
        let args = message.content.slice(shared.prefix.length + 5).trim()
        const searchString = args
        
        message.delete().catch(O_o=>{});
        
        const voiceChannel = message.member.voiceChannel;
        const botVoiceConnection = message.guild.voiceConnection;
        
        if(!voiceChannel) return message.channel.send('You need to be in a voice channel to execute this command!')
      
        const permissions = voiceChannel.permissionsFor(bot.user)
        if(!permissions.has('CONNECT')) return message.channel.send('I can\'t connect to your channel, duh! How do you expect me to play you music?')
        if(!permissions.has('SPEAK')) return message.channel.send('I can\'t speak here, duh! How do you expect me to play you music?')
        
    if (!searchString) return message.reply('please provide a search term, url or playlist link!')
    if (stopping) stopping = false;
      
    if (searchString.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)){
      
          playlist = true
      
          return message.reply("directly playing a playlist is currently not supported.")
      
        } else {
          
            playlist = false
          
            try {
              
                var video = await youtube.getVideo(searchString)
                return handleVideo(video, message, voiceChannel);
                
            } catch(error) {
                try {
                    let index = 0;
                    var videos = await youtube.searchVideos(searchString, 10);
                    var vindex = 0;
                    let bicon = bot.user.displayAvatarURL
                    let videosEmbed = new Discord.RichEmbed()
                    .setTitle("Song Selection")
                    .setColor(0x00bdf2)
                    .addField("Songs:", videos.map(video2 => `**${++index} -** ${video2.title}`))
                    .setFooter("MusEmbed™ | Clean Embeds, Crisp Music", bicon)
                    
                    async function detectSelection() {
                        const videoIndex = parseInt(vindex);
                        var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
                        return handleVideo(video, message, voiceChannel);
                    }
                    
                    let videosChoice = new RC.Menu(
                                  videosEmbed,
                                  [
                                      { emoji: '1⃣',
                                          run: (user, message) => {
                                              vindex = 1
                                              detectSelection()
                                              message.delete()
                                                  }
                                      },
                                      { emoji: '2⃣',
                                          run: (user, message) => {
                                              vindex = 2
                                              detectSelection()
                                              message.delete()
                                                  }
                                      },
                                      { emoji: '3⃣',
                                          run: (user, message) => {
                                              vindex = 3
                                              detectSelection()
                                              message.delete()
                                                  }
                                      },
                                      { emoji: '4⃣',
                                          run: (user, message) => {
                                              vindex = 4
                                              detectSelection()
                                              message.delete()
                                                  }
                                      },
                                      { emoji: '5⃣',
                                          run: (user, message) => {
                                              vindex = 5
                                              detectSelection()
                                              message.delete()
                                                  }
                                      },
                                      { emoji: '6⃣',
                                          run: (user, message) => {
                                              vindex = 6
                                              detectSelection()
                                              message.delete()
                                                  }
                                      },
                                      { emoji: '7⃣',
                                          run: (user, message) => {
                                              vindex = 7
                                              detectSelection()
                                              message.delete()
                                                  }
                                      },
                                      { emoji: '8⃣',
                                          run: (user, message) => {
                                              vindex = 8
                                              detectSelection()
                                              message.delete()
                                                  }
                                      },
                                      { emoji: '9⃣',
                                          run: (user, message) => {
                                              vindex = 9
                                              detectSelection()
                                              message.delete()
                                                  }
                                      },
                                      { emoji: '🔟',
                                          run: (user, message) => {
                                              vindex = 10
                                              detectSelection()
                                              message.delete()
                                                  }
                                      },
                                      { emoji: '❌',
                                          run: (user, message) => {
                                              message.channel.send('Video selection canceled.')
                                              return message.delete()
                                                  }
                                      },
                                  ],
                                  {
                                        owner: message.member.id
                                  }
                            )
                  
                    handler.addMenus(videosChoice)
                      
                      await message.channel.send("Please select the number corresponding to your video! Wait for all the options to load before choosing.")
                        .then(() => message.channel.sendMenu(videosChoice))
                  
                } catch(err) {
                    console.log(err)
                    return await message.channel.send("No results could be found.")
                }
            }
        }
    } else if (commandName === "pause") {
      message.delete().catch(O_o=>{});
      
      const voiceChannel = message.member.voiceChannel;
      const botVoiceConnection = message.guild.voiceConnection;
        
      if (!voiceChannel) return message.channel.send('You need to be in a voice channel to execute this command!')
      
      if (!serverQueue) return message.channel.send("Nothing is playing right now!")
      
      if (voiceChannel !== botVoiceConnection.channel) return message.channel.send('You need to be in my voice channel to execute this command!')
      
		  if (serverQueue && serverQueue.playing) {
			serverQueue.playing = false;
			serverQueue.connection.dispatcher.pause();
			return message.channel.send('Music paused. Use the command \`' + prefix + 'resume\` to resume playing.');
		}
		return message.channel.send('Nothing is playing!');
      
	} else if (commandName === "resume") {
    
    message.delete().catch(O_o=>{});
    
    const voiceChannel = message.member.voiceChannel;
    const botVoiceConnection = message.guild.voiceConnection;
        
    if (!voiceChannel) return message.channel.send('You need to be in a voice channel to execute this command!')
    
    if (!serverQueue) return message.channel.send("Nothing is playing right now!")
      
    if (voiceChannel !== botVoiceConnection.channel) return message.channel.send('You need to be in my voice channel to execute this command!')
    
		if (serverQueue && !serverQueue.playing) {
			serverQueue.playing = true;
			serverQueue.connection.dispatcher.resume();
			return message.channel.send('Music resumed.');
		}
		return message.channel.send('Either the queue is empty, or there\'s already a song playing.');
	
  } else if (commandName === "stop") {
        
        message.delete().catch(O_o=>{});
        const voiceChannel = message.member.voiceChannel;
        const botVoiceConnection = message.guild.voiceConnection;
          
        if (!voiceChannel) return message.channel.send('You need to be in a voice channel to execute this command!')
    
        if (!serverQueue) return message.channel.send("Nothing is playing right now!")
      
        if (voiceChannel !== botVoiceConnection.channel) return message.channel.send('You need to be in my voice channel to execute this command!')
    
        if (!message.member.hasPermission("MOVE_MEMBERS")) return await message.reply("you don't have sufficient permissions!")
    stopping = true;
    serverQueue.voiceChannel.leave();
        return serverQueue.textChannel.send('Cya, I\'m leaving!');
    
    } else if (commandName === "skip") {
      
        message.delete().catch(O_o=>{});
        const voiceChannel = message.member.voiceChannel;
        const botVoiceConnection = message.guild.voiceConnection;
        
        if (!voiceChannel) return message.channel.send('You need to be in a voice channel to execute this command!')
    
        if (!serverQueue) return message.channel.send("Nothing is playing right now!")
      
    if (voiceChannel !== botVoiceConnection.channel) return message.channel.send('You need to be in my voice channel to execute this command!')

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
      
      const voiceChannel = message.member.voiceChannel;
      const botVoiceConnection = message.guild.voiceConnection;
        
      if (!voiceChannel) return message.channel.send('You need to be in a voice channel to execute this command!').then(message.delete())
    
      if (!serverQueue) return message.channel.send("Nothing is playing right now!").then(message.delete())
      
      if (voiceChannel !== botVoiceConnection.channel) return message.channel.send('You need to be in my voice channel to execute this command!').then(message.delete)

      let song = serverQueue.songs[0]
      let bicon = bot.user.displayAvatarURL
      let embed = new Discord.RichEmbed()
      .setColor(0x00bdf2)
      .setTitle(`Now Playing`)
      .setDescription(`[${song.title}](${song.url})`)
      .addField("Uploader", song.channel, true)
      .addField(`Video ID`, song.id , true)
      .addField(`Time Published`, `${song.publishedAt}`, true)
      .addField("Duration", `\`${song.durationd}\` Days, \`${song.durationh}\` Hours, \`${song.durationm}\` Minutes and \`${song.durations}\` Seconds`, true)
      .addField("Requester", song.requested)
      .setFooter("MusEmbed™ | Clean Embeds, Crisp Music", bicon)
      return message.channel.send(embed).then(message.delete())
      
    } else if (commandName === "volume") {
      
      
        let args = message.content.slice(shared.prefix.length + 7).trim()
        message.delete().catch(O_o=>{});
        
        const voiceChannel = message.member.voiceChannel;
        const botVoiceConnection = message.guild.voiceConnection;
        
        if (!voiceChannel) return message.channel.send('You need to be in a voice channel to execute this command!')
        
        if (!serverQueue) return await message.channel.send("Nothing is playing!");
        
        if (voiceChannel !== botVoiceConnection.channel) return message.channel.send('You need to be in my voice channel to execute this command!')
      
        if(!args) return await message.channel.send(`The current volume is **${serverQueue.volume}**`)
    if ( args === "0" || args === "1" || args === "2" || args === "3" || args === "4" || args === "5" || args === "6" || args === "7" || args === "8" || args === "9" || args === "10" ) {
      
        serverQueue.connection.dispatcher.setVolumeLogarithmic(args / 10)
        serverQueue.volume = args;
        return await message.channel.send(`I set the volume to: **${args}**`);
    }
      
      return await message.reply('please choose an integer between 0 and 10!');
    
    } else if (commandName === "queue") {
      
        message.delete().catch(O_o=>{});
        
        const voiceChannel = message.member.voiceChannel;
        const botVoiceConnection = message.guild.voiceConnection;
        
        if (!voiceChannel) return message.channel.send('You need to be in a voice channel to execute this command!')
    
        if (!serverQueue) return message.channel.send("Nothing is playing right now!")
      
      if (voiceChannel !== botVoiceConnection.channel) return message.channel.send('You need to be in my voice channel to execute this command!')
      
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
          
          const voiceChannel = message.member.voiceChannel;
          const botVoiceConnection = message.guild.voiceConnection;
        
          if(!voiceChannel) return message.channel.send('You need to be in a voice channel to execute this command!')
    
          if (!serverQueue) return message.channel.send("Nothing is playing right now!")
      
          if (voiceChannel !== botVoiceConnection.channel) return message.channel.send('You need to be in my voice channel to execute this command!')
      
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

		if (!command) return message.channel.send({embed: {
      color: 0x00bdf2,
      title: "The command you used was invalid!",
      description:(`Do ${prefix}help for a list of commands.`),
      footer: {
          icon_url: bot.user.avatarURL,
          text: "MusEmbed™ | Clean Embeds, Crisp Music"
      }
  }}).then(message.delete());;
    
    console.log(argsNEW)
		
		try {
			await command.run(bot, message, argsNEW, shared)
		} catch (error) {
			message.channel.send(error)
		}
	}
  
});

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
                requested: message.author.tag,
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
      
        if (playlist) return message.channel.send("Playlist added to queue.")
      
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
      
        if (playlist) return message.channel.send("Playlist added to queue.")
        
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

function np(serverQueue) {

      let song = serverQueue.songs[0]
      let bicon = bot.user.displayAvatarURL
      let embed = new Discord.RichEmbed()
      .setColor(0x00bdf2)
      .setTitle(`Now Playing`)
      .setDescription(`[${song.title}](${song.url})`)
      .addField("Uploader", song.channel, true)
      .addField(`Video ID`, song.id , true)
      .addField(`Time Published`, `${song.publishedAt}`, true)
      .addField("Duration", `\`${song.durationd}\` Days, \`${song.durationh}\` Hours, \`${song.durationm}\` Minutes and \`${song.durations}\` Seconds`, true)
      .addField("Requester", song.requested)
      .setFooter("MusEmbed™ | Clean Embeds, Crisp Music", bicon)
      
      serverQueue.textChannel.send(embed)
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
        np(serverQueue)
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
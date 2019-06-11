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
    console.log(`MusEmbed™ initiated. Commands may now be used in all channels.`);
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
  bot.settings.set(`491659679336759299`, "em/", prefix);
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  return bot.shard.broadcastEval('this.guilds.size')
   .then(results => {
  let sicon = guild.iconURL;
  bot.channels.get(`585811927565860865`).send({embed: {
            color: 0x00bdf2,
            title: "I've joined a server",
            description: `I am now in \`${results.reduce((prev, val) => prev + val, 0)}\` servers`,
            thumbnail: {
                          url: (sicon),
                       },
            fields: [
                    {
                        name: "Name",
                        value: (`${guild.name}`),
                        inline: true
                    },
                    {
                        name: "Owner",
                        value: (`${guild.owner}`),
                        inline: true
                    },
                    {
                        name: "Region",
                        value: (`${guild.region}`),
                        inline: true
                    },
                    {
                        name: "Time of Birth",
                        value: (`${guild.createdAt}`),
                    },
                    {
                        name: "Members",
                        value: (`${guild.memberCount}`),
                        inline: true
                    },
                    {
                        name: "Humans",
                        value: (`${guild.members.filter(member => !member.user.bot).size}`),
                        inline: true
                    },
                    {
                        name: "Bots",
                        value: (`${Math.round(guild.memberCount - guild.members.filter(member => !member.user.bot).size)}`),
                        inline: true
                    },
                    {
                        name: "ID",
                        value: (`${guild.id}`),
                    },
                ],
            footer: {
                icon_url: bot.user.avatarURL,
                text: "MusEmbed™ | Clean Embeds, Crisp Music"
            }
  }});
  });
});

bot.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  return bot.shard.broadcastEval('this.guilds.size')
   .then(results => {
  let sicon = guild.iconURL;
  bot.channels.get(`585811927565860865`).send({embed: {
            color: 0x00bdf2,
            title: "I've left a server",
            description: `I am now in \`${results.reduce((prev, val) => prev + val, 0)}\` servers`,
            thumbnail: {
                          url: (sicon),
                       },
            fields: [
                    {
                        name: "Name",
                        value: (`${guild.name}`),
                        inline: true
                    },
                    {
                        name: "Owner",
                        value: (`${guild.owner}`),
                        inline: true
                    },
                    {
                        name: "Region",
                        value: (`${guild.region}`),
                        inline: true
                    },
                    {
                        name: "Time of Birth",
                        value: (`${guild.createdAt}`),
                    },
                    {
                        name: "Members",
                        value: (`${guild.memberCount}`),
                        inline: true
                    },
                    {
                        name: "Humans",
                        value: (`${guild.members.filter(member => !member.user.bot).size}`),
                        inline: true
                    },
                    {
                        name: "Bots",
                        value: (`${Math.round(guild.memberCount - guild.members.filter(member => !member.user.bot).size)}`),
                        inline: true
                    },
                    {
                        name: "ID",
                        value: (`${guild.id}`),
                    },
                ],
            footer: {
                icon_url: bot.user.avatarURL,
                text: "MusEmbed™ | Clean Embeds, Crisp Music"
            }
  }});
  });
});

bot.on('message', async message => {
    
    let sender = message.author;
    let msg = message.content.toLowerCase();
    const ownerID = config.ownerID
    const guildConf = bot.settings.ensure(message.guild.id, defaultSettings)
    let prefix = guildConf.prefix
    let censor = guildConf.censor
    let mention = "<@414440610418786314> "
    let mention1 = "<@!414440610418786314> "
    let censors = censor
    if (bot.user.id === sender.id) { return }
    let nick = sender.username
    let Owner = message.guild.roles.find("name", "Owner")
    let i = 0

 const args = message.content.slice(prefix.length).trim().split(/ +/g);
 const command = args.shift().toLowerCase();
  
    if (message.guild === null) return;
    if (message.author.bot) return;
  
  // add censor filter before everything else to save space
  
    if (msg.split(" ")[0] === prefix + "suggest" || message.isMemberMentioned(bot.user) && msg.includes("suggest")) {
    if (message.isMemberMentioned(bot.user)) {
      message.delete().catch(O_o=>{});
      return message.reply (`this command is only available when using this server's prefix, \`${prefix}.\``)
    }
        const embedMessage = args.join(" ");
        if (censors === "on") {
            for (i=0;i<bannedwords.length;i++) {
            if (message.content.toLowerCase().includes(bannedwords[i])) {
                message.delete().catch(O_o=>{});
                return message.reply("please refrain from using such contemptable words.")
            } else if (embedMessage.length < 20) {
              message.delete().catch(O_o=>{});
              message.channel.send({embed: {
            color: 0x00bdf2,
            title: "Suggestion too short!",
            description: "Your suggestion must consist of 20 characters or more.",
            footer: {
                icon_url: bot.user.avatarURL,
                text: "MusEmbed™ | Clean Embeds, Crisp Music"
            }
          }});
          return;
            } else if (!message.content.toLowerCase().includes(bannedwords[i])) {
        const senderID = args.join(" ");
        message.delete().catch(O_o=>{});
        message.channel.send({embed: {
            color: 0x00bdf2,
            title: "Suggestion submitted!",
            description: "Your suggestion will be reviewed in short time. If your suggestion is accepted, you will be credited in <@414440610418786314>'s changelog.",
            footer: {
                icon_url: bot.user.avatarURL,
                text: "MusEmbed™ | Clean Embeds, Crisp Music"
            }
        }});
          bot.channels.get(`585814273020788736`).send({embed: {
            color: 0x00bdf2,
            title: "Suggestion",
            author: {
                name: `${message.author.username}#${message.author.discriminator}`,
                icon_url: message.author.avatarURL
            },
            description:(embedMessage),
            footer: {
                icon_url: bot.user.avatarURL,
                text: "MusEmbed™ | Clean Embeds, Crisp Music"
            }
  }});
      return;
    }}
        } else if (embedMessage.length < 20) {
          message.delete().catch(O_o=>{});
          message.channel.send({embed: {
            color: 0x00bdf2,
            title: "Suggestion too short!",
            description: "Your suggestion must consist of 20 characters or more.",
            footer: {
                icon_url: bot.user.avatarURL,
                text: "MusEmbed™ | Clean Embeds, Crisp Music"
            }
          }});
          return;
            } else {
        const embedMessage = args.join(" ");
        const senderID = args.join(" ");
        message.delete().catch(O_o=>{});
        message.channel.send({embed: {
            color: 0x00bdf2,
            title: "Suggestion submitted!",
            description: "Your suggestion will be reviewed in short time. If your suggestion is accepted, you will be credited in <@414440610418786314>'s changelog.",
            footer: {
                icon_url: bot.user.avatarURL,
                text: "MusEmbed™ | Clean Embeds, Crisp Music"
            }
        }});
        bot.fetchUser(config.ownerID).then((user) => {
          user.send({embed: {
            color: 0x00bdf2,
            title: "Suggestion",
            author: {
                name: `${message.author.username}#${message.author.discriminator}`,
                icon_url: message.author.avatarURL
            },
            description:(embedMessage),
            footer: {
                icon_url: bot.user.avatarURL,
                text: "MusEmbed™ | Clean Embeds, Crisp Music"
            }
  }})});
          return;
        }};

    if (msg === prefix + "help" || message.isMemberMentioned(bot.user) && msg.includes("help")) {
        message.delete().catch(O_o=>{});
        message.channel.send({embed: {
            color: 0x00bdf2,
            title: "MusEmbed's Help Message",
            fields: [
                    {
                        name: "Prefix",
                        value: ("The prefix for this server is \`" + prefix + "\`. You may also mention me as a prefix.\n")
                    },
                    {
                        name: "Description",
                        value: "This is a bot that can help you easily create embeds in your server. We also have music playing functionality. \n"
                    },
                    {
                        name: "General Commands",
                        value: "\`help\`: Shows this help message. \n\`botinfo\`: Retrieves information about the bot. \n\`serverinfo\`: Retrieves information about the server. \n\`ping\`: Shows latency of the bot and the API. \n\`links\`: Shows all our links. \n\`suggest [suggestion]\`: Submits a suggestion to MusEmbed's support server. Suggestion must consist of 20 characters or more. \n"
                    },
                    {
                        name: "Embed Commands",
                        value: "\`embed [(hex code]) [message]\`: Embeds your message. \n\`rawembed ([hex code]) [message]\`: Administrator-only command that embeds your message without your name. \n"
                    },
                    {
                        name: "Music Commands",
                        value: "\`play [name of music]\`: Searches for the song you requested. \n\`pause\`: Pauses the current song. \n\`resume\`: Resumes a paused song. \n\`skip\`: Votes to skip the playing song. Song automatically skips if half/over half of people vote to skip. \n\`np\`: Shows the name of the currently playing song. \n\`volume ([number])\`: Changes volume to the provided number. Shows current volume if arguments are not provided. \n\`queue\`: Shows the current queue of songs. \n\`loop\`: Toggles loop to \`single\` when used once. Toggles to \`all\` when used twice. Toggles \`off\` when used thrice. \n\`stop\`: Moderator-only command. Resets the queue and stops music. Also forces bot to leave the voice channel."
                    },
                    {
                        name: "Moderation Commands",
                        value: "\`kick [user]\`: Kicks a user from the guild. \n\`ban [user]\`: Bans a user from the guild. \n\`purge [number]\`: Deletes a number of messages in a channel. \n\`mute [user]\`: Mutes a user in the guild. A 'Muted' role must first be set up for this to work. \n\`unmute [user]\`: Unmutes a user in the guild. A 'Muted' role must first be set up for this to work. \n"
                    },
                    {
                        name: "Server Configurations",
                        value: "\`showconf\`: Shows the configurations for your server. \n\`setconf [item] [new value]\`: Administrator-only command. Sets a new value for your server's configuration. For this command, \`em/\` is a permanent prefix. \n(Available configurations: \`prefix (new prefix)\`, \`censor (on/off)\`) \n" 
                    },
                ],
        footer: {
                    icon_url: bot.user.avatarURL,
                    text: "MusEmbed™ | Clean Embeds, Crisp Music"
                }
  }})
};

    if (msg === prefix + "botinfo" || message.isMemberMentioned(bot.user) && msg.includes("botinfo")) {
        message.delete().catch(O_o=>{});
        return bot.shard.broadcastEval('this.guilds.size')
        .then(results => {
        let bicon = bot.user.displayAvatarURL
        const used = process.memoryUsage().heapUsed / 1024 / 1024
        let botembed = new Discord.RichEmbed()
        .setTitle("Bot Information")
        .setColor(0x00bdf2)
        .setThumbnail(bicon)
        .addField("Name", bot.user.username, true)
        .addField("Prefix for this Server", "\`" + prefix + "\`", true)
        .addField("Developer", "<@344335337889464357>", true)
        .addField("Time of Birth", bot.user.createdAt)
        .addField("Library", "discord.js", true)
        .addField("Servers", `${results.reduce((prev, val) => prev + val, 0)}`, true)
        .addField("Memory Used", `${Math.round(used * 100) / 100}MB`, true)
        .addField("ID", bot.user.id)
        .setFooter("MusEmbed™ | Clean Embeds, Crisp Music", bicon)

        message.channel.send(botembed)
    })};

    if (msg === prefix + "links" || message.isMemberMentioned(bot.user) && msg.includes("links")) {
        message.delete().catch(O_o=>{});
        message.channel.send({embed: {
            color: 0x00bdf2,
            title: "Links",
            description: ("[MusEmbed's Website](https://www.musembed.tk) \n[Vote for MusEmbed](https://vote.musembed.tk) \n[Join MusEmbed Support](https://invite.gg/musembed) \n[Invite MusEmbed](https://invite.musembed.tk) \n[MusEmbed's Uptime](https://uptime.musembed.tk)"),
            footer: {
                        icon_url: bot.user.avatarURL,
                        text: "MusEmbed™ | Clean Embeds, Crisp Music"
                    }
  }})
};

    if (msg === prefix + "serverinfo" || message.isMemberMentioned(bot.user) && msg.includes("serverinfo")) {
        message.delete().catch(O_o=>{});
        let bicon = bot.user.displayAvatarURL
        let sicon = message.guild.iconURL
        
        let serverembed = new Discord.RichEmbed()
        .setTitle("Server Information")
        .setColor(0x00bdf2)
        .setThumbnail(sicon)
        .addField("Name", message.guild.name, true)
        .addField("Owner", message.guild.owner, true)
        .addField("Region", message.guild.region ,true)
        .addField("Time of Birth", message.guild.createdAt)
        .addField("Members", message.guild.memberCount, true)
        .addField("Humans", message.guild.members.filter(member => !member.user.bot).size, true)
        .addField("Bots", `${Math.round(message.guild.memberCount - message.guild.members.filter(member => !member.user.bot).size)}`, true)
        .addField("ID", message.guild.id)
        .setFooter("MusEmbed™ | Clean Embeds, Crisp Music", bicon)

        await message.channel.send(serverembed)

    };

    const serverQueue = queue.get(message.guild.id);
  
    if (msg.split(" ")[0] === prefix + "play" || message.isMemberMentioned(bot.user) && msg.includes("play")) {
    if (message.isMemberMentioned(bot.user)) {
      message.delete().catch(O_o=>{});
      return message.reply (`this command is only available when using this server's prefix, \`${prefix}.\``)
    }
        let args = message.content.split(" ").slice(1)
        const searchString = args.join(' ')
        const voiceChannel = message.member.voiceChannel;
        message.delete().catch(O_o=>{});
        if(!voiceChannel) return message.channel.send('You need to be in a voice channel to execute this command!')
        const permissions = voiceChannel.permissionsFor(bot.user)
        if(!permissions.has('CONNECT')) return message.channel.send('I can\'t connect to your channel, duh! How do you expect me to play you music?')
        if(!permissions.has('SPEAK')) return message.channel.send('I can\'t speak here, duh! How do you expect me to play you music?')
        
    if(!args[0]) return message.reply('please provide a search term, url or playlist link!')
    if(stopping) stopping = false;
      
    if(args[0].match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)){
            const playlist = await youtube.getPlaylist(args[0]);
            var videos = await playlist.getVideos();
            for(const video of Object.values(videos)){
                var video2 = await youtube.getVideoByID(video.id);
                await handleVideo(video2, message, voiceChannel, true)
            }
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
    } else if (msg === prefix + "pause" || message.isMemberMentioned(bot.user) && msg.includes("pause")) {
      message.delete().catch(O_o=>{});
      if (!message.member.voiceChannel) return await message.channel.send("You aren't in a voice channel!");
		  if (serverQueue && serverQueue.playing) {
			serverQueue.playing = false;
			serverQueue.connection.dispatcher.pause();
			return message.channel.send('Music paused. Use the command \`' + prefix + 'resume\` to resume playing.');
		}
		return message.channel.send('Nothing is playing!');
	} else if (msg === prefix + "resume" || message.isMemberMentioned(bot.user) && msg.includes("resume")) {
    message.delete().catch(O_o=>{});
    if (!message.member.voiceChannel) return await message.channel.send("You aren't in a voice channel!");
		if (serverQueue && !serverQueue.playing) {
			serverQueue.playing = true;
			serverQueue.connection.dispatcher.resume();
			return message.channel.send('Music resumed.');
		}
		return message.channel.send('Either the queue is empty, or there\'s already a song playing.');
	} else if (msg === prefix + "stop" || message.isMemberMentioned(bot.user) && msg.includes("stop")) {
        message.delete().catch(O_o=>{});
        if(!message.member.voiceChannel) return await message.channel.send("You aren't in a voice channel!")
        if(!serverQueue) return await message.channel.send("Nothing is playing!")
        if (!message.member.hasPermission("ADMINISTRATOR")) return await message.reply("you don't have sufficient permissions!")
    stopping = true;
    serverQueue.voiceChannel.leave();
        return serverQueue.textChannel.send('Cya, I\'m leaving!');
    } else if (msg === prefix + "skip" || message.isMemberMentioned(bot.user) && msg.includes("skip")) {
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
    } else if (msg === prefix + "np" || message.isMemberMentioned(bot.user) && msg.includes("np")) {
        message.delete().catch(O_o=>{});
        if(!serverQueue) return await message.channel.send("Nothing is playing!")
        
        return await message.channel.send(`Now playing: **${serverQueue.songs[0].title}**`)
    } else if (msg.split(" ")[0] === prefix + "volume" || message.isMemberMentioned(bot.user) && msg.includes("volume")) {
        if (message.isMemberMentioned(bot.user)) {
            message.delete().catch(O_o=>{});
            return message.reply (`this command is only available when using this server's prefix, \`${prefix}.\``)
        }
        let args = msg.split(" ").slice(1)
        message.delete().catch(O_o=>{});
        if(!message.member.voiceChannel) return await message.channel.send("You aren't in a voice channel!")
        if(!serverQueue) return await message.channel.send("Nothing is playing!");
        if(!args[0]) return await message.channel.send(`The current volume is **${serverQueue.volume}**`)
    if (args[0] > 10 || args[0] < 0) return await message.reply('please choose a number between 0 and 10!');
        serverQueue.connection.dispatcher.setVolumeLogarithmic(args[0] / 10)
        serverQueue.volume = args[0];
        return await message.channel.send(`I set the volume to: **${args[0]}**`);
    } else if (msg === prefix + "queue" || message.isMemberMentioned(bot.user) && msg.includes("queue")) {
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
    } else if (msg === prefix + "loop" || message.isMemberMentioned(bot.user) && msg.includes("loop")) {
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

  if (censors === "on") {
  for (i=0;i<bannedwords.length;i++) {
    if (message.content.toLowerCase().includes(bannedwords[i])) {
        message.delete().catch(O_o=>{})
      return message.reply("please refrain from using such contemptable words.");
    }
 }};

  if (msg.split(" ")[0] === prefix + "purge" || message.isMemberMentioned(bot.user) && msg.includes("purge")) {
    if (!message.member.hasPermission("MANAGE_MESSAGES") || !message.member.hasPermission("ADMINISTRATOR")) {
        message.delete().catch(O_o=>{});
        message.reply("you don't have sufficient permissions!");
        return;
    }
    if (message.isMemberMentioned(bot.user)) {
      message.delete().catch(O_o=>{});
      return message.reply (`this command is only available when using this server's prefix, \`${prefix}.\``)
    }
    
    let messagesClear = args.join(" ")
    message.channel.bulkDelete(parseInt(messagesClear) + parseInt(1));
  }
  
  if (msg.startsWith(prefix) || msg.startsWith(mention) || msg.startsWith(mention1)) {
    
    var argsNEW
    
    if (msg.startsWith(prefix)) argsNEW = message.content.slice(prefix.length).split(/\s+/u)
    else if (msg.startsWith(mention)) argsNEW = message.content.slice(mention.length).split(/\s+/u)
    else if (msg.startsWith(mention1)) argsNEW = message.content.slice(mention1.length).split(/\s+/u)
    
    console.log(argsNEW)
    
		const commandName = argsNEW.shift().toLowerCase()
		shared.commandName = commandName
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
          .addField(`Duration`, `\`${song.durationh}\` Hours, \`${song.durationm}\` Minutes and \`${song.durations}\` Seconds`, true)
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
          .addField(`Duration`, `\`${song.durationh}\` Hours, \`${song.durationm}\` Minutes and \`${song.durations}\` Seconds`, true)
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
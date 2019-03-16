const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require('fs');
const moment = require('moment'); // the moment package. to make this work u need to run "npm install moment --save 
const prefix = 'em/' // The text before commands
const ms = require("ms"); // npm install ms -s
const ytdl = require("ytdl-core");
const opus = require("node-opus");
const YouTube = require("simple-youtube-api");
const Enmap = require('enmap');

const mutedSet = new Set();
const queue = new Map();
const youtube = new YouTube("AIzaSyDkCgN5BgLXr9qvpsKunr_x6HmJp77r_hA")
var stopping = false;
var voteSkipPass = 0;
var voted = 0;
var playerVoted = [];
var totalCost = 1680.37;
var currentlyHave = 22;
var perMonth = 120;
var bannedwords = "fuck,nigg,fuk,cunt,cnut,bitch,dick,d1ck,$h1t,shit,pussy,blowjob,cock,c0ck,slut,whore,kys,fuc,pu$$y,xvideo,xvideos,porn,asshole,a$$hole,kunt,knut,d.1.c.k".split(",");

var userData = 0

var owner = 344335337889464357

bot.settings = new Enmap({
  name: "settings",
  fetchAll: false,
  autoFetch: true,
  cloneLevel: 'deep'
});

const defaultSettings = {   
  prefix: "em/",    
  censor: "on"
};

bot.on("ready", () =>  {
    console.log(`Bot has started, with ${bot.users.size} users, in ${bot.channels.size} channels of ${bot.guilds.size} guilds.`);
    setInterval(() => {
    return bot.shard.broadcastEval('this.guilds.size')
    .then(results => {
        bot.user.setStatus('available')
        const index = Math.floor(parseInt(Math.random() * 2) + parseInt(1));
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
    }, 10000);
});

bot.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  bot.channels.get(`556497757364420618`).send({embed: {
            color: 0x00bdf2,
            title: "Ping Received",
            description:(`I have been removed from: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`),
            footer: {
                icon_url: bot.user.avatarURL,
                text: "MusEmbed™ by Paraborg Discord Bots"
            }
  }});
});

bot.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  bot.channels.get(`556497757364420618`).send({embed: {
            color: 0x00bdf2,
            title: "Ping Received",
            description:(`I have been removed from: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`),
            footer: {
                icon_url: bot.user.avatarURL,
                text: "MusEmbed™ by Paraborg Discord Bots"
            }
  }});
});

bot.on('message', async message => {
    // Variables
    let sender = message.author; // The person who sent the message
    let msg = message.content.toLowerCase();
    const ownerID = '344335337889464357'
    const guildConf = bot.settings.ensure(message.guild.id, defaultSettings)
    let mention = "<@!414440610418786314> "
    let mention1 = "<@414440610418786314> "
    let prefix = guildConf.prefix
    let censor = guildConf.censor
    let censors = censor
    if (bot.user.id === sender.id) { return }
    let nick = sender.username
    let Owner = message.guild.roles.find("name", "Owner")
    let i = 0

 const args = message.content.slice(prefix.length).trim().split(/ +/g);
 const command = args.shift().toLowerCase();

    // commands
  
    if (message.guild === null) return;
    if (message.author.bot) return;

    if (msg.split(" ")[0] === prefix + "setconf" | msg.split(" ")[0] === mention + "setconf" | msg.split(" ")[0] === mention1 + "setconf") {
        const [prop, ...value] = args;
        if (!message.member.hasPermission("ADMINISTRATOR" | !message.member.id === owner)) {
            message.delete().catch(O_o=>{});
            message.reply("you do not have the permissions to change the server's configurations.")
            return;
        } else if (!bot.settings.has(message.guild.id, prop)) {
            message.delete().catch(O_o=>{});
            return message.reply("this configuration is not available.")
        } else {
            bot.settings.set(message.guild.id, value.join(" "), prop);
            message.delete().catch(O_o=>{});
            message.channel.send(`Server ${prop} has been set to: \`${value.join(" ")}\``)
        }
    };

    if(msg === prefix + "showconf" | msg === mention + "showconf" | msg === mention1 + "showconf") {
        message.delete().catch(O_o=>{});
        let configProps = Object.keys(guildConf).map(prop => {
        return `${prop}  :  ${guildConf[prop]}\n`;
    });
    message.channel.send({embed: {
        color: 0x00bdf2,
        title: "Server Configurations",
        description:("The following are this server's current configurations: \n\nPrefix: \`" + prefix + "\`\nCensors: \`" + censor + "\`"),
        footer: {
                icon_url: bot.user.avatarURL,
                text: "MusEmbed™ by Paraborg Discord Bots"
            }
    }});
        };

    if (msg === prefix + "ping" | msg === mention + "ping" | msg === mention1 + "ping") {
        const m = await message.channel.send("Pinging...");
        const pingMessage = (`Bot latency is ${m.createdTimestamp - message.createdTimestamp}ms. API latency is ${Math.round(bot.ping)}ms.`);
        message.delete().catch(O_o=>{});
        message.channel.bulkDelete(1)
        message.channel.send({embed: {
            color: 0x00bdf2,
            title: "Ping Received",
            description:(pingMessage),
            footer: {
                icon_url: bot.user.avatarURL,
                text: "MusEmbed™ by Paraborg Discord Bots"
            }
  }})
}

    if (msg.split(" ")[0] === prefix + "embed" | msg.split(" ")[0] === mention + "embed" | msg.split(" ")[0] === mention1 + "embed") {
        if (censors === "on") {
            for (i=0;i<bannedwords.length;i++) {
            if (message.content.toLowerCase().includes(bannedwords[i])) {
                message.delete().catch(O_o=>{});
                message.reply("please refrain from using such contemptable words.");
            return;
    } else if (!message.content.toLowerCase().includes(bannedwords[i])) {
        const embedMessage = args.join(" ");
        const senderID = args.join(" ");
        message.delete().catch(O_o=>{});
        message.channel.send({embed: {
            color: 0x00bdf2,
            author: {
                name: message.author.username,
                icon_url: message.author.avatarURL
            },
            description:(embedMessage),
            footer: {
                icon_url: bot.user.avatarURL,
                text: "MusEmbed™ by Paraborg Discord Bots"
            }
  }});
        return;
}}
        } else {
        const embedMessage = args.join(" ");
        const senderID = args.join(" ");
        message.delete().catch(O_o=>{});
        message.channel.send({embed: {
            color: 0x00bdf2,
            author: {
                name: message.author.username,
                icon_url: message.author.avatarURL
            },
            description:(embedMessage),
            footer: {
                icon_url: bot.user.avatarURL,
                text: "MusEmbed™ by Paraborg Discord Bots"
            }
  }})
}};

    if (msg.split(" ")[0] === prefix + "rawembed" | msg.split(" ")[0] === mention + "rawembed" | msg.split(" ")[0] === mention1 + "rawembed") {
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            message.delete().catch(O_o=>{});
            message.reply("you do not have the permissions to send a raw embed.")
            return;
        } else if (censors === "on") {
            for (i=0;i<bannedwords.length;i++) {
            if (message.content.toLowerCase().includes(bannedwords[i])) {
                message.delete().catch(O_o=>{});
                message.reply("please refrain from using such contemptable words.");
            return;
    } else if (!message.content.toLowerCase().includes(bannedwords[i])) {
        const embedMessage = args.join(" ");
        message.delete().catch(O_o=>{});
        message.channel.send({embed: {
            color: 0x00bdf2,
            description:(embedMessage),
            footer: {
                icon_url: bot.user.avatarURL,
                text: "MusEmbed™ by Paraborg Discord Bots"
            }
  }});
        return;
}}
        } else {
        const embedMessage = args.join(" ");
        message.delete().catch(O_o=>{});
        message.channel.send({embed: {
            color: 0x00bdf2,
            description:(embedMessage),
            footer: {
                icon_url: bot.user.avatarURL,
                text: "MusEmbed™ by Paraborg Discord Bots"
            }
  }})
}};
    
    
    // Help
    if (msg === prefix + "help" | msg === mention + "help" | msg === mention1 + "help") {
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
                        value: "\`help\`: Shows this help message. \n\`botinfo\`: Retrieves information about the bot. \n\`serverinfo\`: Retrieves information about the server. \n\`ping\`: Shows latency of the bot and the API. \n\`links\`: Shows all our links. \n"
                    },
                    {
                        name: "Embed Commands",
                        value: "\`embed [message]\`: Embeds your message. \n\`rawembed [message]\`: Administrator-only command that embeds your message without your name. \n"
                    },
                    {
                        name: "Music Commands",
                        value: "\`play [name of music]\`: Searches for the song you requested. \n\`skip\`: Skips the current song. \n\`np\`: Tells you what song is playing. \n\`volume ([number])\`: Sets the volume. Checks the volume if you don't provide a number. \n\`queue\`: Lists the queue. \n\`stop\`: Resets the queue and stops music. Also forces bot to leave channel."
                    },
                    {
                        name: "Moderation Commands",
                        value: "\`kick [user]\`: Kicks a user from the guild. \n\`ban [user]\`: Bans a user from the guild. \n\`purge [number]\`: Deletes a number of messages in a channel. \n\`mute [user]\`: Mutes a user in the guild. A 'Muted' role must first be set up for this to work. \n\`unmute [user]\`: Unmutes a user in the guild. \n"
                    },
                    {
                        name: "Server Configurations",
                        value: "\`showconf\`: Shows the configurations for your server. \n\`setconf [item] [new value]\`: Sets a new value for your server's configuration. \n(Available configurations: \`prefix\`, \`censor\` \`on/off\`) \n" 
                    },
                ],
        footer: {
                    icon_url: bot.user.avatarURL,
                    text: "MusEmbed™ by Paraborg Discord Bots"
                }
  }})
};

    //bot info command
    if (msg === prefix + "botinfo" | msg === mention + "botinfo" | msg === mention1 + "botinfo") {
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
        .addField("Server Count", `${results.reduce((prev, val) => prev + val, 0)}`, true)
        .addField("Memory Used", `${Math.round(used * 100) / 100}MB`, true)
        .setFooter("MusEmbed™ by Paraborg Discord Bots", bicon)

        message.channel.send(botembed)
    })};

    if (msg === prefix + "links" | msg === mention + "links" | msg === mention1 + "links") {
        message.delete().catch(O_o=>{});
        message.channel.send({embed: {
            color: 0x00bdf2,
            title: "Links",
            description: ("[MusEmbed's Website](https://musembed.tk/) \n[Vote for MusEmbed](https://vote.musembed.tk/) \n[Join MusEmbed's Support Server](https://invite.gg/paraborg) \n[Invite MusEmbed](https://invite.musembed.tk/) \n[Paraborg Discord Bots](https://paraborg.xyz)"),
            footer: {
                        icon_url: bot.user.avatarURL,
                        text: "MusEmbed™ by Paraborg Discord Bots"
                    }
  }})
};

    //serverinfo command
    if (msg === prefix + "serverinfo" | msg === mention + "serverinfo" | msg === mention1 + "serverinfo") {
        message.delete().catch(O_o=>{});
        let bicon = bot.user.displayAvatarURL
        let sicon = message.guild.iconURL
        
        let serverembed = new Discord.RichEmbed()
        .setTitle("Server Information")
        .setColor(0x00bdf2)
        .setThumbnail(sicon)
        .addField("Server Name", message.guild.name, true)
        .addField("Server Owner", message.guild.owner, true)
        .addField("Region", message.guild.region ,true)
        .addField("Time of Birth", message.guild.createdAt)
        .addField("Total Members", message.guild.memberCount, true)
        .addField("Humans", message.guild.members.filter(member => !member.user.bot).size, true)
        .addField("Bots", `${Math.round(message.guild.memberCount - message.guild.members.filter(member => !member.user.bot).size)}`, true)
        .setFooter("MusEmbed™ by Paraborg Discord Bots", bicon)

        await message.channel.send(serverembed)

    };

    // MUSIC STUFF

    const serverQueue = queue.get(message.guild.id);
    if(message.content.split(" ")[0] === prefix + "play" | message.content.split(" ")[0] === mention + "play" | message.content.split(" ")[0] === mention1 + "play"){
        let args = message.content.split(" ").slice(1)
        const searchString = args.join(' ')
        const voiceChannel = message.member.voiceChannel;
        message.delete().catch(O_o=>{});
        if(!voiceChannel) return message.channel.send('You need to be in a voice channel to execute this command!')
        const permissions = voiceChannel.permissionsFor(bot.user)
        if(!permissions.has('CONNECT')) return message.channel.send('I can\'t connect to your channel, how do you expect me to play music?')
        if(!permissions.has('SPEAK')) return message.channel.send('I can\'t speak here, how do you expect me to play music?')
        
    if(!args[0]) return message.reply('please provide a search term, url or playlist link!')
    if(stopping) stopping = false;
        
        if(args[0].match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)){
            const playlist = await youtube.getPlaylist(args[0]);
            var videos = await playlist.getVideos();
            for(const video of Object.values(videos)){
                var video2 = await youtube.getVideoByID(video.id);
                await handleVideo(video2, message, voiceChannel, true)
            }
            return await message.channel.send(`Playlist: **${playlist.title}** has been added to the queue!`);
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
                    .setFooter("MusEmbed™ by Paraborg Discord Bots", bicon)
                    message.channel.send(videosEmbed)
                    message.channel.send("Please provide a value from 1 to 10 to select a video! You have 10 seconds.")
                    try{
                        var response = await message.channel.awaitMessages(message2 => message2.content > 0 && message2.content < 11, {
                                    maxMatches: 1,
                    time: 10000,
                    errors: ['time']
                });
                    }catch(err){
                        return message.channel.send('No value given, or value was invalid, video selection canceled.')
                    }
                const videoIndex = parseInt(response.first().content);
                        var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
                }catch(err){
                    console.log(err)
                    return await message.channel.send("No results could be found.");
                }
            }
            return handleVideo(video, message, voiceChannel);
        }
    } else if(msg === prefix + "stop" | msg === mention + "stop" | msg === mention1 + "stop"){
        message.delete().catch(O_o=>{});
        if(!message.member.voiceChannel) return await message.channel.send("You aren't in a voice channel!")
        if(!serverQueue) return await message.channel.send("Nothing is playing!")
        if (!message.member.hasPermission("ADMINISTRATOR")) return await message.reply("you don't have sufficient permissions!")
    stopping = true;
    serverQueue.voiceChannel.leave();
        return serverQueue.textChannel.send('Cya, I\'m leaving!');
    }else if(msg === prefix + "skip" | msg === mention + "skip" | msg === mention1 + "skip"){
        message.delete().catch(O_o=>{});
            if(!message.member.voiceChannel) return await message.channel.send("You aren't in a voice channel!")
            if(!serverQueue) return await message.channel.send("Nothing is playing!")
        const voiceChannel = message.member.voiceChannel;
        for (var x = 0; x < playerVoted.length; x++) {
            if(sender === playerVoted[x]){
            return message.channel.send(`${sender.username}, you think you run the place? You can\'t vote twice!`)
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
    }else if(msg === prefix + "np" | msg === mention + "np" | msg === mention1 + "np"){
        message.delete().catch(O_o=>{});
        if(!serverQueue) return await message.channel.send("Nothing is playing!")
        
        return await message.channel.send(`Now playing: **${serverQueue.songs[0].title}**`)
    }else if(msg.split(" ")[0] === prefix + "volume" | msg.split(" ")[0] === mention + "volume" | msg.split(" ")[0] === mention1 + "volume"){
        let args = msg.split(" ").slice(1)
        message.delete().catch(O_o=>{});
        if(!message.member.voiceChannel) return await message.channel.send("You aren't in a voice channel!")
        if(!serverQueue) return await message.channel.send("Nothing is playing!");
        if(!args[0]) return await message.channel.send(`The current volume is **${serverQueue.volume}**`);
    if(args[0] > 10 || args[0] < 0) return await message.channel.send('Please choose a number between 0 and 10!');
        serverQueue.connection.dispatcher.setVolumeLogarithmic(args[0] / 5)
        serverQueue.volume = args[0];
        return await message.channel.send(`I set the volume to: **${args[0]}**`);
    }else if(msg === prefix + "queue" | msg === mention + "queue" | msg === mention1 + "queue"){
        message.delete().catch(O_o=>{});
        if(!serverQueue) return await message.channel.send("Nothing is playing!");
        let bicon = bot.user.displayAvatarURL
        let queueEmbed = new Discord.RichEmbed()
        .setTitle("Queue")
        .setColor(0x00bdf2)
        .addField("Now playing:", `**${serverQueue.songs[0].title}**`)
        .addField("Songs:", serverQueue.songs.map(song => `**-** ${song.title}`))
        .setFooter("MusEmbed™ by Paraborg Discord Bots", bicon)
        return await message.channel.send(queueEmbed)
    };

  if (censors === "on") {
  for (i=0;i<bannedwords.length;i++) {
    if (message.content.toLowerCase().includes(bannedwords[i])) {
        message.delete().catch(O_o=>{})
      message.reply("please refrain from using such contemptable words.");
      return;
    }
 }};

  if (msg.split(" ")[0] === prefix + "purge" | msg.split(" ")[0] === mention + "purge" | msg.split(" ")[0] === mention1 + "purge") {
    if (!message.member.hasPermission("MANAGE_MESSAGES")) {
        message.delete().catch(O_o=>{});
        message.reply("you don't have sufficient permissions!");
        return;
    }
    let messagesClear = args.join(" ")
    message.channel.bulkDelete(parseInt(messagesClear) + parseInt(1));
  }

  if (msg.split(" ")[0] === prefix + "kick" | msg.split(" ")[0] === mention + "kick" | msg.split(" ")[0] === mention1 + "kick") {
    if (!message.member.hasPermission("KICK_MEMBERS")) {
        message.delete().catch(O_o=>{});
        message.reply("you don't have sufficient permissions!");
        return;
    } else {var mem = message.mentions.members.first();
    if (mem.hasPermission("KICK_MEMBERS")) {
        message.delete().catch(O_o=>{});
        message.channel.send({embed: {
            color: 0x00bdf2,
            description:("An error occured!"),
            footer: {
                icon_url: bot.user.avatarURL,
                text: "MusEmbed™ by Paraborg Discord Bots"
            }
  }});
        return;
    }
    mem.kick().then(() => {
        message.delete().catch(O_o=>{});
        message.channel.send({embed: {
            color: 0x00bdf2,
            description:(mem.displayName + " has successfully been kicked by " + message.author.username + "!"),
            footer: {
                icon_url: bot.user.avatarURL,
                text: "MusEmbed™ by Paraborg Discord Bots"
            }
  }});
    }).catch(e => {
        message.delete().catch(O_o=>{});
        message.channel.send({embed: {
            color: 0x00bdf2,
            description:("An error occured!"),
            footer: {
                icon_url: bot.user.avatarURL,
                text: "MusEmbed™ by Paraborg Discord Bots"
            }
  }});
    });
  }};

  if (msg.split(" ")[0] === prefix + "ban" | msg.split(" ")[0] === mention + "ban" | msg.split(" ")[0] === mention1 + "ban") {
    if (!message.member.hasPermission("BAN_MEMBERS")) {
        message.delete().catch(O_o=>{});
        message.reply("you don't have sufficient permissions!");
        return;
    } else {var mem = message.mentions.members.first();
    if (mem.hasPermission("BAN_MEMBERS")) {
        message.delete().catch(O_o=>{});
        message.channel.send({embed: {
            color: 0x00bdf2,
            description:("An error occured!"),
            footer: {
                icon_url: bot.user.avatarURL,
                text: "MusEmbed™ by Paraborg Discord Bots"
            }
  }});
        return;
    }
    mem.ban().then(() => {
        message.delete().catch(O_o=>{});
        message.channel.send(mem.displayName + " has successfully been banned by " + message.author.username + "!");
    }).catch(e => {
        message.delete().catch(O_o=>{});
        message.channel.send({embed: {
            color: 0x00bdf2,
            description:("An error occured!"),
            footer: {
                icon_url: bot.user.avatarURL,
                text: "MusEmbed™ by Paraborg Discord Bots"
            }
  }});
    });
  }};

  if (msg.split(" ")[0] === prefix + "mute" | msg.split(" ")[0] === mention + "mute" | msg.split(" ")[0] === mention1 + "mute") {
    if (!message.member.hasPermission("MANAGE_MESSAGES")) {
        message.delete().catch(O_o=>{});
        message.reply("you don't have sufficient permissions!");
        return;
    } else {var mem = message.mentions.members.first();
    if (mem.hasPermission("MANAGE_MESSAGES")) {
        message.delete().catch(O_o=>{});
        message.channel.send({embed: {
            color: 0x00bdf2,
            description:("An error occured!"),
            footer: {
                icon_url: bot.user.avatarURL,
                text: "MusEmbed™ by Paraborg Discord Bots"
            }
  }});
        return;
    }   
    if (message.guild.roles.find("name", "Muted")) {
      mem.addRole(message.guild.roles.find("name", "Muted")).then(() => {
        message.delete().catch(O_o=>{});
        message.channel.send(mem.displayName + " has successfully been muted!");
      }).catch(e => {
        message.delete().catch(O_o=>{});
        message.channel.send({embed: {
            color: 0x00bdf2,
            description:("An error occured!"),
            footer: {
                icon_url: bot.user.avatarURL,
                text: "MusEmbed™ by Paraborg Discord Bots"
            }
  }});
        console.log(e);
      });
}}};

  if (msg.split(" ")[0] === prefix + "unmute" | msg.split(" ")[0] === mention + "unmute" | msg.split(" ")[0] === mention1 + "unmute") {
    if (!message.member.hasPermission("ADMINISTRATOR")) {
        message.delete().catch(O_o=>{});
        message.reply("you don't have sufficient permissions!");
        return;
    } else {var mem = message.mentions.members.first();
    if (message.guild.roles.find("name", "Muted")) {
        message.delete().catch(O_o=>{});
        mem.removeRole(message.guild.roles.find("name", "Muted")).then(() => {
        message.channel.send(mem.displayName + " has successfully been unmuted!");
      }).catch(e => {
        message.delete().catch(O_o=>{});
        message.channel.send({embed: {
            color: 0x00bdf2,
            description:("An error occured!"),
            footer: {
                icon_url: bot.user.avatarURL,
                text: "MusEmbed™ by Paraborg Discord Bots"
            }
  }});
        console.log(e);
      });
}}};

}); //the end of bot.on ------------------------------


/*one time event function
  function onetime(node, type, callback) {
    //create event
    node.addEventListener(type, function(e) {
      //remove event
      e.target.removeEventListener(e, type, arguments.callee)
        //call gandler
        return callback(e)
    })
  } draaaaaft*/

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
                url: `https://www.youtube.com/watch?v=${video.id}`
            }
        
    if(!serverQueue) {
        const queueConstruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true
        };
        queue.set(message.guild.id, queueConstruct);
        queueConstruct.songs.push(song);
        message.channel.send(`${song.title} has been added to the queue.`)
        try {
            var connection = await voiceChannel.join();
            queueConstruct.connection = connection;
            play(message.guild, queueConstruct.songs[0]);
        } catch (error) {
            console.error(error)
            queue.delete(message.guild.id)
            return message.channel.send('An error occured.')
        }
    } else {
        serverQueue.songs.push(song);
        if(playlist) return undefined
        return message.channel.send(`${song.title} has been added to the queue.`)
    }
    return undefined;
}

function play(guild, song){
    const serverQueue = queue.get(guild.id)
    if(stopping){
       queue.delete(guild.id);
       return;
    }
    
    if(!song){
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return undefined;
    }
    const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
        .on('end', () =>{
        if(!serverQueue.songs){
                serverQueue.voiceChannel.leave();
                queue.delete(guild.id);
                voted = 0;
            voteSkipPass = 0;
            playerVoted = [];
                return undefined;
        }
        serverQueue.songs.shift();
        voted = 0;
        voteSkipPass = 0;
        playerVoted = [];
                play(guild, serverQueue.songs[0]);
            })
        .on('error', error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    if(song){
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

bot.login("NDE0NDQwNjEwNDE4Nzg2MzE0.D0g2aw.-GL0Q26y5TQmX-3ACkj3uk1F6yA");
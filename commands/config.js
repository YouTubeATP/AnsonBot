const Discord = require('discord.js'),
      db = require('quick.db'),
      moment = require('moment')

const config = require('/app/util/config'),
      fn = require('/app/util/fn')

const userData = new db.table("USERDATA"),
      guildData = new db.table("GUILDDATA"),
      modCases = new db.table("MODCASES")

const configItems = [{
  name: "prefix",
  displayName: "Prefix",
  type: "string"
}, {
  name: "modlog",
  displayName: "Moderator Logs",
  type: "channel"
}, {
  name: "botlog",
  displayName: "Action Logs",
  type: "channel"
}, {
  name: "memberlog",
  displayName: "Member Logs",
  type: "channel"
}, {
  name: "muteRole",
  displayName: "Muted Role",
  type: "role"
}, {
  name: "autoRole",
  displayName: "Role Given on Join",
  type: "role",
  list: true
}, {
  name: "automod",
  displayName: "Auto Moderation",
  type: "boolean"
}]

module.exports = {
  name: "config",
  usage: ["config [item]","config <item> reset","config <item> set <newValue>"],
  description: "Fetches and sets the configurations of the current server.",
  category: "Utility",
  guildPerms: ["MANAGE_GUILD"],
  aliases: ["cfg", "conf"],
  run: async (client, message, args, shared) => {
    let guild = guildData.get(message.guild.id)
    
    if (!args.length) {
      let embed = new Discord.MessageEmbed()
        .setColor(config.embedColor)
        .setTitle(`Configuration | ${message.guild.name}`)
        .setThumbnail(message.guild.iconURL())
        .setFooter(client.user.username, client.user.avatarURL())
      for (let i = 0; i < configItems.length; i++) embed.addField(`${configItems[i].displayName} [\`${configItems[i].name}\`]`,
                                                                  `${configItems[i].type == "channel" ? (shared.guild[configItems[i].name] ? `<#${shared.guild[configItems[i].name]}>` : "None set") :
                                                                     configItems[i].type == "role" ? (shared.guild[configItems[i].name] ? `<@&${shared.guild[configItems[i].name]}>` : "None set") :
                                                                     shared.guild[configItems[i].name] ? shared.guild[configItems[i].name] : "None set"}`, true)
      return message.channel.send(embed)
    }
    
    if (args.length == 1) {
      let item = args[0]
      if (!configItems.map(i => i.name).includes(item)) return message.channel.send(fn.embed(client, {title: "Accepted Values", description: `${configItems.map(i => `\`${i.name}\``).join(', ')}`}))
      
      item = configItems.find(i => i.name == item)
      let embed = new Discord.MessageEmbed()
        .setColor(config.embedColor)
        .setTitle(`Configuration | ${message.guild.name}`)
        .setThumbnail(message.guild.iconURL())
        .setFooter(client.user.username, client.user.avatarURL())
        .addField(`${item.displayName} [\`${item.name}\`]`,
                  `${item.type == "channel" ? (shared.guild[item.name] ? `<#${shared.guild[item.name]}>` : "None set") :
                     item.type == "role" ? (shared.guild[item.name] ? `<@&${shared.guild[item.name]}>` : "None set") :
                     (shared.guild[item.name] ? shared.guild[item.name] : "None set")}`)
      return message.channel.send(embed)
    }
    
    if (args.length == 2) {
      let item = args[0]
      if (!configItems.map(i => i.name).includes(item)) return message.channel.send(fn.embed(client, {title: "Accepted Values", description: `${configItems.map(i => `\`${i.name}\``).join(', ')}`}))
      if (args[1] != "reset") return message.channel.send(fn.embed(client, {title: "Usage", description: "`config [item]\nconfig <item> reset\nconfig <item> set <newValue>`"}))
      
      guildData.set(`${message.guild.id}.${item}`, null)
      let embed = new Discord.MessageEmbed()
        .setColor(config.embedColor)
        .setTitle(`Configuration | ${message.guild.name}`)
        .setThumbnail(message.guild.iconURL())
        .setFooter(client.user.username, client.user.avatarURL())
        .addField(`${item.displayName} [\`${item.name}\`]`,
                  `${item.type == "channel" ? `<#${shared.guild[item.name]}>` :
                     item.type == "role" ? `<@&${shared.guild[item.name]}>` :
                     shared.guild[item.name]} **>** None set`)
      return message.channel.send(embed)
    }
    
    if (args.length >= 3) {
      let item = args[0],
          arg = args[1].toLowerCase()
      if (!configItems.map(i => i.name).includes(item)) return message.channel.send(fn.embed(client, {title: "Accepted Values", description: `${configItems.map(i => `\`${i.name}\``).join(', ')}`}))
      if (!["set","add","remove"].includes(arg)) return message.channel.send(fn.embed(client, {title: "Usage", description: "`config [item]\nconfig <item> reset\nconfig <item> set <newValue>`"}))
      
      let cfgItem = configItems.find(i => i.name == item)
      if ((cfgItem.list && arg == "set") || (!cfgItem.list && (arg == "add" || arg == "remove"))) return message.channel.send(fn.embed(client, "You can only `add` and `remove` items from lists!"))
    
      let newVal
      if (cfgItem.type == "channel") {
        let id;
        if (message.mentions.channels) id = message.mentions.channels.cache.filter(x => x.type == 'text').first()
        else id = message.guild.channels.cache.filter(x => x.type == 'text').find(channel => channel.id == args[2] || channel.name.startsWith(args[2].toLowerCase()))
        newVal = id
      } else if (cfgItem.type == "role") {
        let id;
        if (message.mentions.roles) id = message.mentions.roles.cache.filter(x => x.name != '@everyone').first()
        else id = message.guild.roles.cache.filter(x => x.name != '@everyone').find(role => role.id == args[2] || role.name.toLowerCase().startsWith(args[2].toLowerCase()))
        newVal = id
      } else if (cfgItem.type == "boolean") {
        newVal = args[2].toLowerCase() == "true" ? true
               : args[2].toLowerCase() == "false" ? false : undefined
      } else newVal = args[2]
      
      if (newVal === null || newVal === undefined) return message.channel.send(fn.embed(client, {title: "Invalid Input", description: cfgItem.type != "string" ? `Please mention the ${cfgItem.type} or input the ID or name of the ${cfgItem.type}.` : "Please input the new value."}))
      
      if (arg == "set") guildData.set(`${message.guild.id}.${item}`, newVal)
      if (arg == "add") {
        if (!shared.guild[item] || typeof shared.guild[item] != "array") guildData.set(`${message.guild.id}.${item}`, [])
        guildData.push(`${message.guild.id}.${item}`, newVal)
      }
      
      let embed = new Discord.MessageEmbed()
        .setColor(config.embedColor)
        .setTitle(`Configuration | ${message.guild.name}`)
        .setThumbnail(message.guild.iconURL())
        .setFooter(client.user.username, client.user.avatarURL())
        .addField(`${cfgItem.displayName} [\`${cfgItem.name}\`]`,
                  `${cfgItem.type == "channel" ? (shared.guild[cfgItem.name] ? `<#${shared.guild[cfgItem.name]}>` : "None set") :
                     cfgItem.type == "role" ? (shared.guild[cfgItem.name] ? `<@&${shared.guild[cfgItem.name]}>` : "None set") :
                     shared.guild[cfgItem.name] ? shared.guild[cfgItem.name] : "None set"} **>** ${cfgItem.type == "channel" ? `<#${newVal}>` :
                     cfgItem.type == "role" ? `<@&${newVal}>` : newVal}`)
      return message.channel.send(embed)
    }
  }
}
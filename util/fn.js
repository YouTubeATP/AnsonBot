const Discord = require("discord.js"),
  moment = require("moment"),
  fs = require("fs");

const { defaultPrefix, embedColor } = require("./config.js"),
  index = require("/app/index.js");

let time = (date = moment()) => {
  return moment(date)
    .utcOffset(8)
    .format("YYYY/MM/DD HH:mm:ss");
};

let utcTime = (date = moment()) => {
  return moment(date).format("YYYY/MM/DD HH:mm:ss [GMT]");
};

let ago = (date = moment()) => {
  return moment(date).fromNow();
};

let embed = (client, content) => {
  if (content instanceof Object) {
    let { title, description } = content;
    return new Discord.MessageEmbed()
      .setColor(embedColor)
      .setTitle(title)
      .setDescription(description)
      .setFooter(client.user.username, client.user.avatarURL())
      .setTimestamp();
  } else if (typeof content == "string") {
    return new Discord.MessageEmbed()
      .setColor(embedColor)
      .setDescription(content)
      .setFooter(client.user.username, client.user.avatarURL())
      .setTimestamp();
  } else {
    throw Error("Invalid content type.\nAccepts Object or String.");
  }
  return undefined;
};

let error = (client, message, error) => {
  return new Discord.MessageEmbed()
    .setColor(embedColor)
    .setTitle(message)
    .setDescription(`${error}`)
    .setFooter(client.user.username, client.user.avatarURL())
    .setTimestamp();
};

let getUser = (client, data) => {
  if (data instanceof Discord.User) return data;
  if (data instanceof Discord.GuildMember) return data.user;
  if (data instanceof Discord.Message) return data.author;
  if (typeof data == "string")
    return client.users.cache.find(
      user => user.id == data || user.tag.toLowerCase() == data.toLowerCase()
    );
  throw Error("Cannot find user.");
};

let getMember = (guild, data) => {
  if (data instanceof Discord.User) return guild.members.cache.get(data.id);
  if (data instanceof Discord.GuildMember) return data;
  if (data instanceof Discord.Message) return data.member;
  if (typeof data == "string")
    return guild.members.cache.find(
      member =>
        member.user.id == data ||
        member.user.tag.toLowerCase() == data.toLowerCase()
    );
  throw Error("Cannot find member.");
};

let getRole = (guild, data) => {
  if (data instanceof Discord.Role) return data;
  if (typeof data == "string")
    return guild.roles.cache.find(
      role =>
        role.name.toLowerCase() == data.toLowerCase() ||
        role.id == data ||
        role.name.toLowerCase().startsWith(data.toLowerCase())
    );
  throw Error("Cannot find role.");
};

function ModCase(client, id, type, member, message, reason, period) {
  this.id = parseInt(id);
  this.type = type.toUpperCase();
  this.user = getUser(client, member).id;
  this.moderator = getUser(client, message.member).id;
  this.reason = reason;
  this.time = moment();
  this.period = period;
  this.active = true;
  this.message = message.id;
}

let modCaseEmbed = (client, thisCase) => {
  let user = getUser(client, thisCase.user);
  let moderator = getUser(client, thisCase.moderator);

  let embed = new Discord.MessageEmbed()
    .setColor(embedColor)
    .setTitle(
      thisCase.type === "BAN"
        ? "User Banned"
        : thisCase.type === "UNBAN"
        ? "User Unbanned"
        : thisCase.type === "WARN"
        ? "User Warned"
        : thisCase.type === "KICK"
        ? "User Kicked"
        : thisCase.type === "MUTE"
        ? "User Muted"
        : "User Unmuted"
    )
    .setThumbnail(user.displayAvatarURL())
    .addField(user.bot ? "Bot" : "User", `${user} (${user.tag})`, true)
    .addField("Moderator", moderator, true);
  if (thisCase.period)
    embed.addField(
      "Duration",
      `${thisCase.period / 1000 / 60} minute${
        thisCase.period / 1000 / 60 == 1 ? "" : "s"
      }`,
      true
    );
  embed
    .addField("Reason", thisCase.reason)
    .setFooter(`Case #${thisCase.id}`, client.user.avatarURL())
    .setTimestamp(moment(thisCase.time));

  return embed;
};

let paginator = async (author, msg, embeds, pageNow) => {
  const client = index.client;
  if (pageNow != 0) {
    await msg.react("⏪");
    await msg.react("◀");
  }
  if (pageNow != embeds.length - 1) {
    await msg.react("▶");
    await msg.react("⏩");
  }
  await msg.react("743138103195205763");
  let reaction = await msg
    .awaitReactions(
      (reaction, user) =>
        user.id == author &&
        (["◀", "▶", "⏪", "⏩"].includes(reaction.emoji.name) ||
          ["743138103195205763"].includes(reaction.emoji.id)),
      { time: 90 * 1000, max: 1, errors: ["time"] }
    )
    .catch(err => {
      if (msg.channel.type !== "dm")
        msg.reactions.removeAll().catch(error => console.error(error));
      else msg.delete();
    });
  reaction = reaction.first();
  if (reaction.emoji.name == "◀") {
    let m = await msg.channel.send(embeds[Math.max(pageNow - 1, 0)]);
    msg.delete();
    paginator(author, m, embeds, Math.max(pageNow - 1, 0));
  } else if (reaction.emoji.name == "▶") {
    let m = await msg.channel.send(
      embeds[Math.min(pageNow + 1, embeds.length - 1)]
    );
    msg.delete();
    paginator(author, m, embeds, Math.min(pageNow + 1, embeds.length - 1));
  } else if (reaction.emoji.name == "⏪") {
    let m = await msg.channel.send(embeds[0]);
    msg.delete();
    paginator(author, m, embeds, 0);
  } else if (reaction.emoji.name == "⏩") {
    let m = await msg.channel.send(embeds[embeds.length - 1]);
    msg.delete();
    paginator(author, m, embeds, embeds.length - 1);
  } else if (reaction.emoji.id == "743138103195205763")
    if (msg.channel.type !== "dm")
      msg.reactions.removeAll().catch(error => console.error(error));
    else msg.delete();
};

function log(msg) {
  console.log(msg);
  fs.writeFileSync("/app/templogs.txt");
}

module.exports = {
  time: time,
  utcTime: utcTime,
  date: utcTime,
  ago: ago,
  embed: embed,
  error: error,
  getUser: getUser,
  getMember: getMember,
  getRole: getRole,
  ModCase: ModCase,
  modCaseEmbed: modCaseEmbed,
  paginator: paginator,
  log: log
};

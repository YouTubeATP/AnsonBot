const Discord = require("discord.js"),
  Hypixel = require("hypixel"),
  Enmap = require("enmap"),
  fs = require("fs");

const config = require("/app/util/config"),
  fn = require("/app/util/fn"),
  shared = require("/app/index.js");

const talkedRecently = new Set();

const MinecraftUUID = new Enmap({
  name: "link",
  fetchAll: false,
  autoFetch: true,
  cloneLevel: "deep"
});

let hypixel,
  hypixel1 = new Hypixel({ key: process.env.HYAPI1 }),
  hypixel2 = new Hypixel({ key: process.env.HYAPI2 });

shared.client.gamemodes = new Discord.Collection();
const gamemodeFiles = fs
  .readdirSync("/app/commands/hypixel")
  .filter(file => file.endsWith(".js"));
for (const file of gamemodeFiles) {
  const gamemode = require(`./hypixel/${file}`);
  shared.client.gamemodes.set(gamemode.name, gamemode);
}

module.exports = {
  name: "hypixel",
  usage: "hypixel <username/UUID> [gamemode]",
  aliases: ["h", "zoo"],
  description: `Shows Hypixel statistics. Provide a gamemode for game-specific stats. If your Mojang account is linked, the argument \`<username/UUID>\` may be omitted when requesting your own stats.\n\nLinking your Mojang account to the bot:\n1. In Minecraft Java Edition, join \`mc.hypixel.net\`.\n2. Switch to slot 2 (My Profile) and right click.\n3. Left-click on the icon at row 3, column 4 (Social Media).\n4. Left-click on the icon at row 4, column 8 (Discord).\n5. The game will prompt you to paste the required information in chat. Paste in your Discord username and discriminator in \`User#9999\` format.\n6. Return to Discord and use the command \`link <your username>\`.`,
  category: "Minecraft",
  run: async (client, message, args, shared) => {
    let command = message.content
      .trim()
      .slice(shared.prefix.length)
      .split(/\s+/u)[0];
    let nameOrID = args[0],
      rawcontent = message.content
        .slice(shared.prefix.length + command.length + 1)
        .trim();

    if (talkedRecently.has(message.author.id)) {
      message.channel.send(
        fn.embed(client, {
          title: "Woah! Slow down!",
          description:
            "This command has a cooldown. Wait a bit before trying again."
        })
      );
    } else {
      talkedRecently.add(message.author.id);
      await MinecraftUUID.defer;
      console.log("MinecraftUUID: " + MinecraftUUID.size + " keys loaded");

      await hypixel1.getKeyInfo((err, info) => {
        if (err) hypixel = hypixel2;
        else hypixel = hypixel1;
        init();
      });
      setTimeout(() => {
        talkedRecently.delete(message.author.id);
      }, 5000);
    }

    function init() {
      if (!rawcontent) {
        if (!MinecraftUUID.get(message.member.id)) {
          return message.channel.send(
            fn.embed(client, {
              title: "Command used incorrectly!",
              description: `Please follow the format below:\n\`${shared.customPrefix}hypixel <username/UUID> [gamemode]\``
            })
          );
        } else checkUuid(MinecraftUUID.get(message.member.id));
      } else if (args[0].toLowerCase() === "compare" && args[1]) {
        let nameOrID1 = args[1],
          nameOrID2 = args[2],
          gamemode;
        if (
          args[2] &&
          !args[3] &&
          MinecraftUUID.get(message.author.id) &&
          (args[2].toLowerCase() === "bw" ||
            args[2].toLowerCase() === "bedwars" ||
            args[2].toLowerCase() === "bed wars" ||
            args[2].toLowerCase() === "sw" ||
            args[2].toLowerCase() === "skywars" ||
            args[2].toLowerCase() === "sky wars" ||
            args[2].toLowerCase() === "murder mystery" ||
            args[2].toLowerCase() === "mm" ||
            args[2].toLowerCase() === "murder" ||
            args[2].toLowerCase() === "murdermystery" ||
            args[2].toLowerCase() === "arcade" ||
            args[2].toLowerCase() === "arcade games" ||
            args[2].toLowerCase() === "uhc" ||
            args[2].toLowerCase() === "ultra hardcore" ||
            args[2].toLowerCase() === "arena" ||
            args[2].toLowerCase() === "arena brawl" ||
            args[2].toLowerCase() === "brawl" ||
            args[2].toLowerCase() === "bb" ||
            args[2].toLowerCase() === "buildbattle" ||
            args[2].toLowerCase() === "build battle" ||
            args[2].toLowerCase() === "guess the build" ||
            args[2].toLowerCase() === "guessthebuild" ||
            args[2].toLowerCase() === "gtb" ||
            args[2].toLowerCase() === "cvc" ||
            args[2].toLowerCase() === "cops" ||
            args[2].toLowerCase() === "crims" ||
            args[2].toLowerCase() === "cops and crims" ||
            args[2].toLowerCase() === "cops vs crims" ||
            args[2].toLowerCase() === "copsandcrims" ||
            args[2].toLowerCase() === "copsvscrims" ||
            args[2].toLowerCase() === "crazywalls" ||
            args[2].toLowerCase() === "crazy walls" ||
            args[2].toLowerCase() === "crazy" ||
            args[2].toLowerCase() === "duels" ||
            args[2].toLowerCase() === "1v1" ||
            args[2].toLowerCase() === "pvp" ||
            args[2].toLowerCase() === "megawalls" ||
            args[2].toLowerCase() === "mega" ||
            args[2].toLowerCase() === "mega walls" ||
            args[2].toLowerCase() === "paintball" ||
            args[2].toLowerCase() === "paintball warfare" ||
            args[2].toLowerCase() === "paint" ||
            args[2].toLowerCase() === "quake" ||
            args[2].toLowerCase() === "quakecraft" ||
            args[2].toLowerCase() === "quake craft" ||
            args[2].toLowerCase() === "blitz" ||
            args[2].toLowerCase() === "blitz survival" ||
            args[2].toLowerCase() === "blitz survival games" ||
            args[2].toLowerCase() === "blitz sg" ||
            args[2].toLowerCase() === "survival games" ||
            args[2].toLowerCase() === "sg" ||
            args[2].toLowerCase() === "blitzsurvival" ||
            args[2].toLowerCase() === "blitzsurvivalgames" ||
            args[2].toLowerCase() === "survivalgames" ||
            args[2].toLowerCase() === "smash" ||
            args[2].toLowerCase() === "heroes" ||
            args[2].toLowerCase() === "smashheroes" ||
            args[2].toLowerCase() === "smash heroes" ||
            args[2].toLowerCase() === "speeduhc" ||
            args[2].toLowerCase() === "speed uhc" ||
            args[2].toLowerCase() === "speed" ||
            args[2].toLowerCase() === "tnt" ||
            args[2].toLowerCase() === "tnt games" ||
            args[2].toLowerCase() === "tntgames" ||
            args[2].toLowerCase() === "tnt run" ||
            args[2].toLowerCase() === "tntrun" ||
            args[2].toLowerCase() === "tnt tag" ||
            args[2].toLowerCase() === "tnttag" ||
            args[2].toLowerCase() === "pvp run" ||
            args[2].toLowerCase() === "pvprun" ||
            args[2].toLowerCase() === "turbo" ||
            args[2].toLowerCase() === "kart" ||
            args[2].toLowerCase() === "racer" ||
            args[2].toLowerCase() === "racers" ||
            args[2].toLowerCase() === "turbokart" ||
            args[2].toLowerCase() === "turbo kart" ||
            args[2].toLowerCase() === "kartracer" ||
            args[2].toLowerCase() === "kartracers" ||
            args[2].toLowerCase() === "kart racer" ||
            args[2].toLowerCase() === "kart racers" ||
            args[2].toLowerCase() === "turbo kart racer" ||
            args[2].toLowerCase() === "turbo kart racers" ||
            args[2].toLowerCase() === "vampire" ||
            args[2].toLowerCase() === "vampirez" ||
            args[2].toLowerCase() === "the walls" ||
            args[2].toLowerCase() === "walls" ||
            args[2].toLowerCase() === "thewalls" ||
            args[2].toLowerCase() === "warlords" ||
            args[2].toLowerCase() === "warlord")
        ) {
          nameOrID1 = message.author.id;
          nameOrID2 = args[1];
          gamemode = args[2];
          checkName1(nameOrID1, nameOrID2, gamemode);
        } else if (!args[2] && MinecraftUUID.get(message.author.id)) {
          nameOrID1 = message.author.id;
          nameOrID2 = args[1];
          gamemode = args[2];
          checkName1(nameOrID1, nameOrID2, gamemode);
        } else if (
          args[1].toLowerCase() === "bw" ||
          args[1].toLowerCase() === "bedwars" ||
          args[1].toLowerCase() === "bed wars" ||
          args[1].toLowerCase() === "sw" ||
          args[1].toLowerCase() === "skywars" ||
          args[1].toLowerCase() === "sky wars" ||
          args[1].toLowerCase() === "murder mystery" ||
          args[1].toLowerCase() === "mm" ||
          args[1].toLowerCase() === "murder" ||
          args[1].toLowerCase() === "murdermystery" ||
          args[1].toLowerCase() === "arcade" ||
          args[1].toLowerCase() === "arcade games" ||
          args[1].toLowerCase() === "uhc" ||
          args[1].toLowerCase() === "ultra hardcore" ||
          args[1].toLowerCase() === "arena" ||
          args[1].toLowerCase() === "arena brawl" ||
          args[1].toLowerCase() === "brawl" ||
          args[1].toLowerCase() === "bb" ||
          args[1].toLowerCase() === "buildbattle" ||
          args[1].toLowerCase() === "build battle" ||
          args[1].toLowerCase() === "guess the build" ||
          args[1].toLowerCase() === "guessthebuild" ||
          args[1].toLowerCase() === "gtb" ||
          args[1].toLowerCase() === "cvc" ||
          args[1].toLowerCase() === "cops" ||
          args[1].toLowerCase() === "crims" ||
          args[1].toLowerCase() === "cops and crims" ||
          args[1].toLowerCase() === "cops vs crims" ||
          args[1].toLowerCase() === "copsandcrims" ||
          args[1].toLowerCase() === "copsvscrims" ||
          args[1].toLowerCase() === "crazywalls" ||
          args[1].toLowerCase() === "crazy walls" ||
          args[1].toLowerCase() === "crazy" ||
          args[1].toLowerCase() === "duels" ||
          args[1].toLowerCase() === "1v1" ||
          args[1].toLowerCase() === "pvp" ||
          args[1].toLowerCase() === "megawalls" ||
          args[1].toLowerCase() === "mega" ||
          args[1].toLowerCase() === "mega walls" ||
          args[1].toLowerCase() === "paintball" ||
          args[1].toLowerCase() === "paintball warfare" ||
          args[1].toLowerCase() === "paint" ||
          args[1].toLowerCase() === "quake" ||
          args[1].toLowerCase() === "quakecraft" ||
          args[1].toLowerCase() === "quake craft" ||
          args[1].toLowerCase() === "blitz" ||
          args[1].toLowerCase() === "blitz survival" ||
          args[1].toLowerCase() === "blitz survival games" ||
          args[1].toLowerCase() === "blitz sg" ||
          args[1].toLowerCase() === "survival games" ||
          args[1].toLowerCase() === "sg" ||
          args[1].toLowerCase() === "blitzsurvival" ||
          args[1].toLowerCase() === "blitzsurvivalgames" ||
          args[1].toLowerCase() === "survivalgames" ||
          args[1].toLowerCase() === "smash" ||
          args[1].toLowerCase() === "heroes" ||
          args[1].toLowerCase() === "smashheroes" ||
          args[1].toLowerCase() === "smash heroes" ||
          args[1].toLowerCase() === "speeduhc" ||
          args[1].toLowerCase() === "speed uhc" ||
          args[1].toLowerCase() === "speed" ||
          args[1].toLowerCase() === "tnt" ||
          args[1].toLowerCase() === "tnt games" ||
          args[1].toLowerCase() === "tntgames" ||
          args[1].toLowerCase() === "tnt run" ||
          args[1].toLowerCase() === "tntrun" ||
          args[1].toLowerCase() === "tnt tag" ||
          args[1].toLowerCase() === "tnttag" ||
          args[1].toLowerCase() === "pvp run" ||
          args[1].toLowerCase() === "pvprun" ||
          args[1].toLowerCase() === "turbo" ||
          args[1].toLowerCase() === "kart" ||
          args[1].toLowerCase() === "racer" ||
          args[1].toLowerCase() === "racers" ||
          args[1].toLowerCase() === "turbokart" ||
          args[1].toLowerCase() === "turbo kart" ||
          args[1].toLowerCase() === "kartracer" ||
          args[1].toLowerCase() === "kartracers" ||
          args[1].toLowerCase() === "kart racer" ||
          args[1].toLowerCase() === "kart racers" ||
          args[1].toLowerCase() === "turbo kart racer" ||
          args[1].toLowerCase() === "turbo kart racers" ||
          args[1].toLowerCase() === "vampire" ||
          args[1].toLowerCase() === "vampirez" ||
          args[1].toLowerCase() === "the walls" ||
          args[1].toLowerCase() === "walls" ||
          args[1].toLowerCase() === "thewalls" ||
          args[1].toLowerCase() === "warlords" ||
          args[1].toLowerCase() === "warlord"
        ) {
          checkUsername(nameOrID);
        } else {
          gamemode = args[3];
          checkName1(nameOrID1, nameOrID2, gamemode);
        }
      } else checkUsername(nameOrID);
    }

    function checkUsername(nameOrID) {
      hypixel.getPlayerByUsername(nameOrID, (err, player) => {
        if (err || !player) {
          checkUuid(nameOrID);
        } else checkGuildInfo(player.displayname, player.uuid, player);
      });
    }

    function checkUuid(Uuid, discID) {
      hypixel.getPlayer(Uuid, (err, player) => {
        if (err || !player) {
          if (MinecraftUUID.get(nameOrID)) {
            let id = MinecraftUUID.get(nameOrID);
            checkUuid(id, nameOrID);
          } else if (
            message.mentions.members.first() &&
            MinecraftUUID.get(message.mentions.members.first().id)
          ) {
            checkUuid(
              MinecraftUUID.get(message.mentions.members.first().id),
              message.mentions.members.first().id
            );
          } else if (!MinecraftUUID.get(message.member.id)) {
            return message.channel.send(
              fn.embed(client, {
                title: "Username/UUID not found!",
                description: `Please follow the format below:\n\`${shared.customPrefix}hypixel <username/UUID> [gamemode]\``
              })
            );
          } else checkUuid(MinecraftUUID.get(message.member.id));
        } else checkGuildInfo(player.displayname, player.uuid, player, discID);
      });
    }

    function checkGuildInfo(username, uuid, player, discID) {
      hypixel.findGuildByPlayer(uuid, (err, guildId) => {
        if (err || !guildId) {
          console.log(err);
          checkGamemode(username, player, null, uuid, discID);
        } else
          hypixel.getGuild(guildId, (err, guild) => {
            if (err || !guild) console.log(err);
            checkGamemode(username, player, guild, uuid, discID);
          });
      });
    }

    function checkName1(nameOrID1, nameOrID2, gamemode) {
      hypixel.getPlayerByUsername(nameOrID1, (err, player) => {
        if (err || !player) {
          checkUuid1(nameOrID1, nameOrID2, gamemode);
        } else checkName2(player, nameOrID2, gamemode);
      });
    }

    function checkUuid1(nameOrID1, nameOrID2, gamemode, discID) {
      let mentions = message.mentions.users.array();
      hypixel.getPlayer(nameOrID1, (err, player) => {
        if (err || !player) {
          if (MinecraftUUID.get(nameOrID1)) {
            let id = MinecraftUUID.get(nameOrID1);
            checkUuid1(id, nameOrID2, gamemode, nameOrID1);
          } else if (
            MinecraftUUID.get(message.member.id) &&
            mentions[0] &&
            !mentions[1]
          ) {
            checkUuid1(
              MinecraftUUID.get(message.author.id),
              nameOrID2,
              gamemode,
              message.author.id
            );
          } else if (
            mentions[0] &&
            mentions[1] &&
            MinecraftUUID.get(mentions[0].id)
          ) {
            checkUuid1(
              MinecraftUUID.get(mentions[0].id),
              nameOrID2,
              gamemode,
              mentions[0].id
            );
          } else {
            return message.channel.send(
              fn.embed(client, {
                title: "One or more username(s)/UUID(s) provided not found!",
                description: `Please follow the format below:\n\`${shared.customPrefix}hypixel compare <username1/UUID1> <username2/UUID2> [gamemode]\``
              })
            );
          }
        } else checkName2(player, nameOrID2, gamemode, discID);
      });
    }

    function checkName2(player1, nameOrID2, gamemode, discID1) {
      hypixel.getPlayerByUsername(nameOrID2, (err, player) => {
        if (err || !player) {
          checkUuid2(player1, nameOrID2, gamemode, discID1);
        } else checkCompareGuildInfo1(player1, player, gamemode, discID1);
      });
    }

    function checkUuid2(player1, nameOrID2, gamemode, discID1, discID2) {
      let mentions = message.mentions.users.array();
      hypixel.getPlayer(nameOrID2, (err, player) => {
        if (err || !player) {
          if (MinecraftUUID.get(nameOrID2)) {
            let id = MinecraftUUID.get(nameOrID2);
            checkUuid1(player1, id, gamemode, discID1, nameOrID2);
          } else if (
            MinecraftUUID.get(message.member.id) &&
            mentions[0] &&
            !mentions[1] &&
            MinecraftUUID.get(mentions[0].id)
          ) {
            checkUuid1(
              player1,
              MinecraftUUID.get(mentions[0].id),
              gamemode,
              message.author.id
            );
          } else if (
            mentions[0] &&
            mentions[1] &&
            MinecraftUUID.get(mentions[1].id)
          ) {
            checkUuid1(
              player1,
              MinecraftUUID.get(mentions[1].id),
              gamemode,
              mentions[1].id
            );
          } else {
            return message.channel.send(
              fn.embed(client, {
                title: "One or more username(s)/UUID(s) provided not found!",
                description: `Please follow the format below:\n\`${shared.customPrefix}hypixel compare <username1/UUID1> <username2/UUID2> [gamemode]\``
              })
            );
          }
        } else
          checkCompareGuildInfo1(player1, player, gamemode, discID1, discID2);
      });
    }

    function checkCompareGuildInfo1(
      player1,
      player2,
      gamemode,
      discID1,
      discID2
    ) {
      hypixel.findGuildByPlayer(player1.uuid, (err, guildId) => {
        if (err || !guildId) {
          console.log(err);
          checkCompareGuildInfo2(
            player1,
            player2,
            gamemode,
            null,
            discID1,
            discID2
          );
        } else
          hypixel.getGuild(guildId, (err, guild) => {
            if (err || !guild) console.log(err);
            checkCompareGuildInfo2(
              player1,
              player2,
              gamemode,
              guild,
              discID1,
              discID2
            );
          });
      });
    }

    function checkCompareGuildInfo2(
      player1,
      player2,
      gamemode,
      guildInfo1,
      discID1,
      discID2
    ) {
      hypixel.findGuildByPlayer(player2.uuid, (err, guildId) => {
        if (err || !guildId) {
          console.log(err);
          checkCompareGamemode(
            player1.displayname,
            player1,
            guildInfo1,
            player1.uuid,
            discID1,
            player2.displayname,
            player2,
            null,
            player2.uuid,
            discID2,
            gamemode
          );
        } else
          hypixel.getGuild(guildId, (err, guild) => {
            if (err || !guild) console.log(err);
            checkCompareGamemode(
              player1.displayname,
              player1,
              guildInfo1,
              player1.uuid,
              discID1,
              player2.displayname,
              player2,
              guild,
              player2.uuid,
              discID2,
              gamemode
            );
          });
      });
    }

    function checkCompareGamemode(
      username1,
      player1,
      guildInfo1,
      uuid1,
      discID1,
      username2,
      player2,
      guildInfo2,
      uuid2,
      discID2,
      gamemode
    ) {
      let rank1,
        rankcolor1,
        rank2,
        rankcolor2,
        thumbnailURL =
          "https://cdn.glitch.com/018cc8ba-350d-4bd4-847b-a54addad6e97%2FHypixel-Thumbnail.png?v=1582188330345";
      if (player1.prefix === "§c[OWNER]") {
        rank1 = "OWNER";
        rankcolor1 = "RED";
      } else if (player1.prefix === "§c[SLOTH]") {
        rank1 = "SLOTH";
        rankcolor1 = "RED";
      } else if (player1.prefix === "§c[ANGUS]") {
        rank1 = "ANGUS";
        rankcolor1 = "RED";
      } else if (player1.prefix === "§3[MIXER]") {
        rank1 = "MIXER";
        rankcolor1 = "RED";
      } else if (player1.prefix === "§6[APPLE]") {
        rank1 = "APPLE";
        rankcolor1 = "RED";
      } else if (player1.prefix === "§6[EVENTS]") {
        rank1 = "EVENTS";
        rankcolor1 = "GOLD";
      } else if (player1.prefix === "§6[MOJANG]") {
        rank1 = "MOJANG";
        rankcolor1 = "GOLD";
      } else if (player1.prefix === "§d[PIG§b+++§d]") {
        rank1 = "PIG+++";
        rankcolor1 = "0xFF69B4";
      } else if (player1.prefix === "§3[BUILD TEAM]") {
        rank1 = "BUILD TEAM";
        rankcolor1 = "DARK_AQUA";
      } else if (player1.rank && player1.rank !== "NORMAL") {
        if (player1.rank === "HELPER") {
          rank1 = "HELPER";
          rankcolor1 = "DARK_BLUE";
        } else if (player1.rank === "MODERATOR") {
          rank1 = "MOD";
          rankcolor1 = "DARK_GREEN";
        } else if (player1.rank === "YOUTUBER") {
          rank1 = "YOUTUBE";
          rankcolor1 = "RED";
        } else {
          rank1 = `[${player1.rank}]`;
          rankcolor1 = "RED";
        }
      } else if (player1.monthlyPackageRank === "SUPERSTAR") {
        rank1 = "MVP++";
        if (player1.rankPlusColor === "WHITE") rankcolor1 = "0xfefefe";
        else if (player1.rankPlusColor === "YELLOW") rankcolor1 = "0xffff00";
        else if (!player1.rankPlusColor) rankcolor1 = "0xFF4f4f";
        else rankcolor1 = player1.rankPlusColor;
      } else if (player1.newPackageRank === "MVP_PLUS") {
        rank1 = "MVP+";
        if (player1.rankPlusColor === "WHITE") rankcolor1 = "0xfefefe";
        else if (!player1.rankPlusColor) rankcolor1 = "0xFF4f4f";
        else rankcolor1 = player1.rankPlusColor;
      } else if (player1.newPackageRank === "MVP") {
        rank1 = "MVP";
        rankcolor1 = "AQUA";
      } else if (player1.newPackageRank === "VIP_PLUS") {
        rank1 = "VIP+";
        rankcolor1 = "GREEN";
      } else if (player1.newPackageRank === "VIP") {
        rank1 = "VIP";
        rankcolor1 = "GREEN";
      } else {
        rank1 = "NON";
        rankcolor1 = "0x505050";
      }
      if (player2.prefix === "§c[OWNER]") {
        rank2 = "OWNER";
        rankcolor2 = "RED";
      } else if (player2.prefix === "§c[SLOTH]") {
        rank2 = "SLOTH";
        rankcolor2 = "RED";
      } else if (player2.prefix === "§c[ANGUS]") {
        rank2 = "ANGUS";
        rankcolor2 = "RED";
      } else if (player2.prefix === "§3[MIXER]") {
        rank2 = "MIXER";
        rankcolor2 = "RED";
      } else if (player2.prefix === "§6[APPLE]") {
        rank2 = "APPLE";
        rankcolor2 = "RED";
      } else if (player2.prefix === "§6[EVENTS]") {
        rank2 = "EVENTS";
        rankcolor2 = "GOLD";
      } else if (player2.prefix === "§6[MOJANG]") {
        rank2 = "MOJANG";
        rankcolor2 = "GOLD";
      } else if (player2.prefix === "§d[PIG§b+++§d]") {
        rank2 = "PIG+++";
        rankcolor2 = "0xFF69B4";
      } else if (player2.prefix === "§3[BUILD TEAM]") {
        rank2 = "BUILD TEAM";
        rankcolor2 = "DARK_AQUA";
      } else if (player2.rank && player2.rank !== "NORMAL") {
        if (player2.rank === "HELPER") {
          rank2 = "HELPER";
          rankcolor2 = "DARK_BLUE";
        } else if (player2.rank === "MODERATOR") {
          rank2 = "MOD";
          rankcolor2 = "DARK_GREEN";
        } else if (player2.rank === "YOUTUBER") {
          rank2 = "YOUTUBE";
          rankcolor2 = "RED";
        } else {
          rank2 = `[${player2.rank}]`;
          rankcolor2 = "RED";
        }
      } else if (player2.monthlyPackageRank === "SUPERSTAR") {
        rank2 = "MVP++";
        if (player2.rankPlusColor === "WHITE") rankcolor2 = "0xfefefe";
        else if (player2.rankPlusColor === "YELLOW") rankcolor2 = "0xffff00";
        else if (!player2.rankPlusColor) rankcolor2 = "0xFF4f4f";
        else rankcolor2 = player2.rankPlusColor;
      } else if (player2.newPackageRank === "MVP_PLUS") {
        rank2 = "MVP+";
        if (player2.rankPlusColor === "WHITE") rankcolor2 = "0xfefefe";
        else if (!player2.rankPlusColor) rankcolor2 = "0xFF4f4f";
        else rankcolor2 = player2.rankPlusColor;
      } else if (player2.newPackageRank === "MVP") {
        rank2 = "MVP";
        rankcolor2 = "AQUA";
      } else if (player2.newPackageRank === "VIP_PLUS") {
        rank2 = "VIP+";
        rankcolor2 = "GREEN";
      } else if (player2.newPackageRank === "VIP") {
        rank2 = "VIP";
        rankcolor2 = "GREEN";
      } else {
        rank2 = "NON";
        rankcolor2 = "0x505050";
      }
      if (!gamemode) {
        let netlvl1 =
          Math.round(
            ((Math.sqrt(player1.networkExp + 15312.5) - 125 / Math.sqrt(2)) /
              (25 * Math.sqrt(2))) *
              10
          ) / 10;
        let netlvl2 =
          Math.round(
            ((Math.sqrt(player2.networkExp + 15312.5) - 125 / Math.sqrt(2)) /
              (25 * Math.sqrt(2))) *
              10
          ) / 10;
        let disc1, guildmsg1, forums1, disc2, guildmsg2, forums2;
        if (guildInfo1) {
          let guildName1 = guildInfo1.name;
          guildmsg1 = `[${guildName1}](https://hypixel.net/guilds/${guildName1.replace(
            " ",
            "%20"
          )})`;
        } else guildmsg1 = undefined;
        if (guildInfo2) {
          let guildName2 = guildInfo2.name;
          guildmsg2 = `[${guildName2}](https://hypixel.net/guilds/${guildName2.replace(
            " ",
            "%20"
          )})`;
        } else guildmsg2 = undefined;
        if (player1.socialMedia) {
          if (player1.socialMedia.links.DISCORD) {
            let nameargs = player1.socialMedia.links.DISCORD.split("#");
            try {
              disc1 = client.users
                .filterArray(u => u.discriminator === nameargs[1])
                .find(x => x.tag.includes(nameargs[0]));
            } catch (err) {
              disc1 = undefined;
            }
          } else disc1 = undefined;
          if (player1.socialMedia.links.HYPIXEL)
            forums1 = `[View forum account](${player1.socialMedia.links.HYPIXEL})`;
          else forums1 = undefined;
        } else {
          disc1 = undefined;
          forums1 = undefined;
        }
        if (player2.socialMedia) {
          if (player2.socialMedia.links.DISCORD) {
            let nameargs = player2.socialMedia.links.DISCORD.split("#");
            try {
              disc2 = client.users
                .filterArray(u => u.discriminator === nameargs[1])
                .find(x => x.tag.includes(nameargs[0]));
            } catch (err) {
              disc2 = undefined;
            }
          } else disc2 = undefined;
          if (player2.socialMedia.links.HYPIXEL)
            forums2 = `[View forum account](${player2.socialMedia.links.HYPIXEL})`;
          else forums2 = undefined;
        } else {
          disc2 = undefined;
          forums2 = undefined;
        }
        let embed = new Discord.RichEmbed()
          .setColor(config.embedColor)
          .setThumbnail(thumbnailURL)
          .setTitle(`[${rank1}] ${username1} | [${rank2}] ${username2}`)
          .addField("Rank", `${rank1} | ${rank2}`, true)
          .addField("Level", `${netlvl1 || 0} | ${netlvl2 || 0}`, true)
          .addField(
            "Karma",
            `${player1.karma || 0} | ${player2.karma || 0}`,
            true
          )
          .addField(
            "First Login",
            `${fn.date(player1.firstLogin)} (${fn.ago(
              player1.firstLogin
            )}) | ${fn.date(player2.firstLogin)} (${fn.ago(
              player2.firstLogin
            )})`
          )
          .addField(
            "Last Login",
            `${fn.date(player1.lastLogin)} (${fn.ago(
              player1.lastLogin
            )}) | ${fn.date(player2.lastLogin)} (${fn.ago(player2.lastLogin)})`
          )
          .setFooter(client.user.username, client.user.avatarURL())
          .setTimestamp();
        if (guildmsg1 || guildmsg2)
          embed.addField(
            "Guild",
            `${guildmsg1 || "None"} | ${guildmsg2 || "None"}`,
            true
          );
        if (forums1 || forums2)
          embed.addField(
            "Forums",
            `${forums1 || "None"} | ${forums2 || "None"}`,
            true
          );
        if (disc1 || disc2)
          embed.addField(
            "Discord",
            `${disc1 || "None Linked"} | ${disc2 || "None Linked"}`
          );
        return message.channel.send(embed);
      } else {
        specificGame(
          username1,
          player1,
          guildInfo1,
          uuid1,
          gamemode,
          rank1,
          rankcolor1,
          username2,
          player2,
          guildInfo2,
          uuid2,
          rank2,
          rankcolor2
        );
      }
    }

    function checkGamemode(username, player, guildInfo, uuid, discID) {
      let gamemode,
        syncID = MinecraftUUID.get(message.member.id);
      if (rawcontent && syncID === uuid) {
        if (rawcontent.includes(username) || rawcontent.includes(discID))
          gamemode = message.content
            .slice(shared.prefix.length + command.length + 1 + nameOrID.length)
            .trim();
        else gamemode = rawcontent;
      } else if (nameOrID) {
        gamemode = message.content
          .slice(shared.prefix.length + command.length + 1 + nameOrID.length)
          .trim();
      }
      let rank,
        rankcolor,
        thumbnailURL =
          "https://cdn.glitch.com/018cc8ba-350d-4bd4-847b-a54addad6e97%2FHypixel-Thumbnail.png?v=1582188330345";
      if (player.prefix === "§c[OWNER]") {
        rank = "OWNER";
        rankcolor = "RED";
      } else if (player.prefix === "§c[SLOTH]") {
        rank = "SLOTH";
        rankcolor = "RED";
      } else if (player.prefix === "§c[ANGUS]") {
        rank = "ANGUS";
        rankcolor = "RED";
      } else if (player.prefix === "§3[MIXER]") {
        rank = "MIXER";
        rankcolor = "RED";
      } else if (player.prefix === "§6[APPLE]") {
        rank = "APPLE";
        rankcolor = "RED";
      } else if (player.prefix === "§6[EVENTS]") {
        rank = "EVENTS";
        rankcolor = "GOLD";
      } else if (player.prefix === "§6[MOJANG]") {
        rank = "MOJANG";
        rankcolor = "GOLD";
      } else if (player.prefix === "§d[PIG§b+++§d]") {
        rank = "PIG+++";
        rankcolor = "0xFF69B4";
      } else if (player.prefix === "§3[BUILD TEAM]") {
        rank = "BUILD TEAM";
        rankcolor = "DARK_AQUA";
      } else if (player.rank && player.rank !== "NORMAL") {
        if (player.rank === "HELPER") {
          rank = "HELPER";
          rankcolor = "DARK_BLUE";
        } else if (player.rank === "MODERATOR") {
          rank = "MOD";
          rankcolor = "DARK_GREEN";
        } else if (player.rank === "YOUTUBER") {
          rank = "YOUTUBE";
          rankcolor = "RED";
        } else {
          rank = `[${player.rank}]`;
          rankcolor = "RED";
        }
      } else if (player.monthlyPackageRank === "SUPERSTAR") {
        rank = "MVP++";
        if (player.rankPlusColor === "WHITE") rankcolor = "0xfefefe";
        else if (player.rankPlusColor === "YELLOW") rankcolor = "0xffff00";
        else if (!player.rankPlusColor) rankcolor = "0xFF4f4f";
        else rankcolor = player.rankPlusColor;
        thumbnailURL =
          "https://cdn.glitch.com/018cc8ba-350d-4bd4-847b-a54addad6e97%2FMVP%2B%2B.png?v=1582193229141";
      } else if (player.newPackageRank === "MVP_PLUS") {
        rank = "MVP+";
        if (player.rankPlusColor === "WHITE") rankcolor = "0xfefefe";
        else if (!player.rankPlusColor) rankcolor = "0xFF4f4f";
        else rankcolor = player.rankPlusColor;
        thumbnailURL =
          "https://cdn.glitch.com/018cc8ba-350d-4bd4-847b-a54addad6e97%2FMVP%2B.png?v=1582193204722";
      } else if (player.newPackageRank === "MVP") {
        rank = "MVP";
        rankcolor = "AQUA";
        thumbnailURL =
          "https://cdn.glitch.com/018cc8ba-350d-4bd4-847b-a54addad6e97%2FMVP.png?v=1582193204571";
      } else if (player.newPackageRank === "VIP_PLUS") {
        rank = "VIP+";
        rankcolor = "GREEN";
        thumbnailURL =
          "https://cdn.glitch.com/018cc8ba-350d-4bd4-847b-a54addad6e97%2FVIP%2B.png?v=1582193202907";
      } else if (player.newPackageRank === "VIP") {
        rank = "VIP";
        rankcolor = "GREEN";
        thumbnailURL =
          "https://cdn.glitch.com/018cc8ba-350d-4bd4-847b-a54addad6e97%2FVIP.png?v=1582193202255";
      } else {
        rank = "NON";
        rankcolor = "0x505050";
      }
      if (!gamemode) {
        let netlvl =
          Math.round(
            ((Math.sqrt(player.networkExp + 15312.5) - 125 / Math.sqrt(2)) /
              (25 * Math.sqrt(2))) *
              10
          ) / 10;
        let disc, guildmsg, forums;
        if (guildInfo) {
          let guildName = guildInfo.name;
          guildmsg = `[${guildName}](https://hypixel.net/guilds/${guildName.replace(
            " ",
            "%20"
          )})`;
        } else guildmsg = undefined;
        if (player.socialMedia) {
          if (player.socialMedia.links.DISCORD) {
            let nameargs = player.socialMedia.links.DISCORD.split("#");
            try {
              disc = client.users
                .filterArray(u => u.discriminator === nameargs[1])
                .find(x => x.tag.includes(nameargs[0]));
            } catch (err) {
              disc = undefined;
            }
          } else disc = undefined;
          if (player.socialMedia.links.HYPIXEL)
            forums = `[View forum account](${player.socialMedia.links.HYPIXEL})`;
          else forums = undefined;
        } else {
          disc = undefined;
          forums = undefined;
        }
        let embed = new Discord.RichEmbed()
          .setColor(rankcolor)
          .setThumbnail(thumbnailURL)
          .setTitle(`[${rank}] ${username}`)
          .setURL(`https://hypixel.net/player/${username}`)
          .addField("Rank", `${rank}`, true)
          .addField("Level", `${netlvl || 0}`, true)
          .addField("Karma", `${player.karma || 0}`, true)
          .addField(
            "First Login",
            `${fn.date(player.firstLogin)} (${fn.ago(player.firstLogin)})`
          )
          .addField(
            "Last Login",
            `${fn.date(player.lastLogin)} (${fn.ago(player.lastLogin)})`
          )
          .setImage(`https://visage.surgeplay.com/full/${uuid}`)
          .setFooter(
            `UUID: ${player.uuid} | ${client.user.username}`,
            client.user.avatarURL()
          );
        if (guildmsg) embed.addField("Guild", guildmsg, true);
        if (forums) embed.addField("Forums", forums, true);
        if (disc) embed.addField("Discord", disc);
        return message.channel.send(embed);
      } else
        specificGame(
          username,
          player,
          guildInfo,
          uuid,
          gamemode,
          rank,
          rankcolor
        );
    }

    function specificGame(
      username,
      player,
      guildInfo,
      uuid,
      gamemode,
      rank,
      rankcolor,
      username2,
      player2,
      guildInfo2,
      uuid2,
      rank2,
      rankcolor2
    ) {
      if (
        gamemode.toLowerCase() === "bw" ||
        gamemode.toLowerCase() === "bedwars" ||
        gamemode.toLowerCase() === "bed wars"
      )
        gamemode = "Bedwars";
      else if (
        gamemode.toLowerCase() === "sw" ||
        gamemode.toLowerCase() === "skywars" ||
        gamemode.toLowerCase() === "sky wars"
      )
        gamemode = "Skywars";
      else if (
        gamemode.toLowerCase() === "murder mystery" ||
        gamemode.toLowerCase() === "mm" ||
        gamemode.toLowerCase() === "murder" ||
        gamemode.toLowerCase() === "murdermystery"
      )
        gamemode = "MurderMystery";
      else if (
        gamemode.toLowerCase() === "arcade" ||
        gamemode.toLowerCase() === "arcade games"
      )
        gamemode = "Arcade";
      else if (
        gamemode.toLowerCase() === "uhc" ||
        gamemode.toLowerCase() === "ultra hardcore"
      )
        gamemode = "UHC";
      else if (
        gamemode.toLowerCase() === "arena" ||
        gamemode.toLowerCase() === "arena brawl" ||
        gamemode.toLowerCase() === "brawl"
      )
        gamemode = "Arena";
      else if (
        gamemode.toLowerCase() === "bb" ||
        gamemode.toLowerCase() === "buildbattle" ||
        gamemode.toLowerCase() === "build battle" ||
        gamemode.toLowerCase() === "guess the build" ||
        gamemode.toLowerCase() === "guessthebuild" ||
        gamemode.toLowerCase() === "gtb"
      )
        gamemode = "BuildBattle";
      else if (
        gamemode.toLowerCase() === "cvc" ||
        gamemode.toLowerCase() === "cops" ||
        gamemode.toLowerCase() === "crims" ||
        gamemode.toLowerCase() === "cops and crims" ||
        gamemode.toLowerCase() === "cops vs crims" ||
        gamemode.toLowerCase() === "copsandcrims" ||
        gamemode.toLowerCase() === "copsvscrims"
      )
        gamemode = "CVC";
      else if (
        gamemode.toLowerCase() === "crazywalls" ||
        gamemode.toLowerCase() === "crazy walls" ||
        gamemode.toLowerCase() === "crazy"
      )
        gamemode = "CrazyWalls";
      else if (
        gamemode.toLowerCase() === "duels" ||
        gamemode.toLowerCase() === "1v1" ||
        gamemode.toLowerCase() === "pvp"
      )
        gamemode = "Duels";
      else if (
        gamemode.toLowerCase() === "megawalls" ||
        gamemode.toLowerCase() === "mega" ||
        gamemode.toLowerCase() === "mega walls"
      )
        gamemode = "MegaWalls";
      else if (
        gamemode.toLowerCase() === "paintball" ||
        gamemode.toLowerCase() === "paintball warfare" ||
        gamemode.toLowerCase() === "paint"
      )
        gamemode = "Paintball";
      else if (
        gamemode.toLowerCase() === "quake" ||
        gamemode.toLowerCase() === "quakecraft" ||
        gamemode.toLowerCase() === "quake craft"
      )
        gamemode = "Quakecraft";
      else if (
        gamemode.toLowerCase() === "blitz" ||
        gamemode.toLowerCase() === "blitz survival" ||
        gamemode.toLowerCase() === "blitz survival games" ||
        gamemode.toLowerCase() === "blitz sg" ||
        gamemode.toLowerCase() === "survival games" ||
        gamemode.toLowerCase() === "sg" ||
        gamemode.toLowerCase() === "blitzsurvival" ||
        gamemode.toLowerCase() === "blitzsurvivalgames" ||
        gamemode.toLowerCase() === "survivalgames"
      )
        gamemode = "SG";
      else if (
        gamemode.toLowerCase() === "smash" ||
        gamemode.toLowerCase() === "heroes" ||
        gamemode.toLowerCase() === "smashheroes" ||
        gamemode.toLowerCase() === "smash heroes"
      )
        gamemode = "SmashHeroes";
      else if (
        gamemode.toLowerCase() === "speeduhc" ||
        gamemode.toLowerCase() === "speed uhc" ||
        gamemode.toLowerCase() === "speed"
      )
        gamemode = "SpeedUHC";
      else if (
        gamemode.toLowerCase() === "tnt" ||
        gamemode.toLowerCase() === "tnt games" ||
        gamemode.toLowerCase() === "tntgames" ||
        gamemode.toLowerCase() === "tnt run" ||
        gamemode.toLowerCase() === "tntrun" ||
        gamemode.toLowerCase() === "tnt tag" ||
        gamemode.toLowerCase() === "tnttag" ||
        gamemode.toLowerCase() === "pvp run" ||
        gamemode.toLowerCase() === "pvprun"
      )
        gamemode = "TNT";
      else if (
        gamemode.toLowerCase() === "turbo" ||
        gamemode.toLowerCase() === "kart" ||
        gamemode.toLowerCase() === "racer" ||
        gamemode.toLowerCase() === "racers" ||
        gamemode.toLowerCase() === "turbokart" ||
        gamemode.toLowerCase() === "turbo kart" ||
        gamemode.toLowerCase() === "kartracer" ||
        gamemode.toLowerCase() === "kartracers" ||
        gamemode.toLowerCase() === "kart racer" ||
        gamemode.toLowerCase() === "kart racers" ||
        gamemode.toLowerCase() === "turbo kart racer" ||
        gamemode.toLowerCase() === "turbo kart racers"
      )
        gamemode = "TurboKartRacers";
      else if (
        gamemode.toLowerCase() === "vampire" ||
        gamemode.toLowerCase() === "vampirez"
      )
        gamemode = "VampireZ";
      else if (
        gamemode.toLowerCase() === "the walls" ||
        gamemode.toLowerCase() === "walls" ||
        gamemode.toLowerCase() === "thewalls"
      )
        gamemode = "Walls";
      else if (
        gamemode.toLowerCase() === "warlords" ||
        gamemode.toLowerCase() === "warlord"
      )
        gamemode = "Warlords";
      else
        return message.channel.send(
          fn.embed(client, {
            title: "Gamemode not found!",
            description: `Please follow the format below:\n\`${shared.customPrefix}hypixel <username/UUID> [gamemode]\``
          })
        );
      let stats = player.stats[gamemode],
        stats2;
      if (player2) stats2 = player2.stats[gamemode];
      const exportGamemode =
        shared.client.gamemodes.get(gamemode) ||
        shared.client.gamemodes.find(
          cmd => cmd.aliases && cmd.aliases.includes(gamemode)
        );
      try {
        exportGamemode.run(
          client,
          message,
          args,
          shared,
          username,
          player,
          uuid,
          rank,
          rankcolor,
          stats,
          username2,
          player2,
          uuid2,
          rank2,
          rankcolor2,
          stats2
        );
      } catch (error) {
        console.log(error);
      }
    }
  }
};

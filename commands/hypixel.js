const Discord = require("discord.js"),
  Hypixel = require("hypixel"),
  MojangAPI = require("mojang-api"),
  Enmap = require("enmap");

const config = require("/app/util/config"),
  fn = require("/app/util/fn");

const MinecraftUUID = new Enmap({
  name: "link",
  fetchAll: false,
  autoFetch: true,
  cloneLevel: "deep"
});

let hypixel,
  hypixel1 = new Hypixel({ key: process.env.HYAPI1 }),
  hypixel2 = new Hypixel({ key: process.env.HYAPI2 });

module.exports = {
  name: "hypixel",
  usage: "hypixel <username/UUID> [gamemode]",
  description:
    "Shows Hypixel statistics. Provide a gamemode for game-specific stats.",
  category: "Minecraft",
  run: async (client, message, args, shared) => {
    let nameOrID = args[0],
      rawcontent = message.content.slice(shared.prefix.length + 8).trim();

    await MinecraftUUID.defer;
    console.log("MinecraftUUID: " + MinecraftUUID.size + " keys loaded");
    await hypixel1.getKeyInfo((err, info) => {
      if (err) hypixel = hypixel2;
      else hypixel = hypixel1;
      init();
    });

    function init() {
      if (!rawcontent) {
        if (MinecraftUUID.get(message.member.id) === null) {
          return message.channel.send(
            fn.embed(client, {
              title: "Command used incorrectly!",
              description: `Please follow the format below:\n\`${shared.customPrefix}hypixel <username/UUID> [gamemode]\``
            })
          );
        } else checkUuid(MinecraftUUID.get(message.member.id));
      } else checkUsername(nameOrID);
    }

    function checkUsername(nameOrID) {
      hypixel.getPlayerByUsername(nameOrID, (err, player) => {
        if (err || player === null) {
          checkUuid(nameOrID);
        } else {
          MojangAPI.nameToUuid(nameOrID, function(err, res) {
            if (err) console.log(err);
            else checkGuildInfo(res[0].name, res[0].id, player);
          });
        }
      });
    }

    function checkUuid(Uuid) {
      hypixel.getPlayer(Uuid, (err, player) => {
        if (err || player === null) {
          if (MinecraftUUID.get(message.member.id) === null) {
            return message.channel.send(
              fn.embed(client, {
                title: "Username/UUID not found!",
                description: `Please follow the format below:\n\`${shared.customPrefix}hypixel <username/UUID> [gamemode]\``
              })
            );
          } else checkUuid(MinecraftUUID.get(message.member.id));
        } else {
          MojangAPI.profile(Uuid, function(err, res) {
            if (err) console.log(err);
            else checkGuildInfo(res.name, res.id, player);
          });
        }
      });
    }

    function checkGuildInfo(username, uuid, player) {
      hypixel.findGuildByPlayer(uuid, (err, guildId) => {
        if (err || guildId === null || guildId === undefined) console.log(err);
        else
          hypixel.getGuild(guildId, (err, guild) => {
            if (err || guild === null || guild === undefined) console.log(err);
            else checkGamemode(username, player, guild, uuid);
          });
      });
    }

    function checkGamemode(username, player, guildInfo, uuid) {
      let gamemode;
      if (rawcontent && MinecraftUUID.get(message.member.id) === uuid) {
        gamemode = rawcontent;
        if (gamemode === username) gamemode = null;
      } else
        gamemode = message.content
          .slice(shared.prefix.length + 8 + nameOrID.length)
          .trim();
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
        else if ((player.rankPlusColor === undefined) | null)
          rankcolor = "0xFF4f4f";
        else rankcolor = player.rankPlusColor;
        thumbnailURL =
          "https://cdn.glitch.com/018cc8ba-350d-4bd4-847b-a54addad6e97%2FMVP%2B%2B.png?v=1582193229141";
      } else if (player.newPackageRank === "MVP_PLUS") {
        rank = "MVP+";
        if (player.rankPlusColor === "WHITE") rankcolor = "0xfefefe";
        else if ((player.rankPlusColor === undefined) | null)
          rankcolor = "0xFF4f4f";
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
        if (guildInfo.name) {
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
              if (disc.id === message.member.id)
                MinecraftUUID.set(message.member.id, uuid);
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
          .addField("Rank", `\`${rank}\``, true)
          .addField("Level", `\`${netlvl}\``, true)
          .addField("Karma", `\`${player.karma}\``, true)
          .addField(
            "First Login",
            `\`${fn.date(player.firstLogin)} (${fn.ago(player.firstLogin)})\``
          )
          .addField(
            "Last Login",
            `\`${fn.date(player.lastLogin)} (${fn.ago(player.lastLogin)})\``
          )
          .setImage(`https://visage.surgeplay.com/full/${uuid}`)
          .setFooter(
            `UUID: ${player.uuid} | ${client.user.username}`,
            client.user.avatarURL
          );
        if (guildmsg !== undefined) embed.addField("Guild", guildmsg, true);
        if (forums !== undefined) embed.addField("Forums", forums, true);
        if (disc !== undefined) embed.addField("Discord", disc);
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
      rankcolor
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
      let thumbnailURL = `https://hypixel.net/styles/hypixel-uix/hypixel/game-icons/${gamemode}-64.png`;
      let stats = player.stats[gamemode];
      return message.channel.send(
        fn.embed(client, {
          title: "Coming soon!",
          description: `Game-specific stats are still a work in progress. Sorry for the inconvenience caused!`
        })
      );
    }
  }
};

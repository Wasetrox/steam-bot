require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const Parser = require('rss-parser');
const axios = require('axios');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.commands = new Collection();

const commandFiles = fs.readdirSync(path.join(__dirname, 'src/commands')).filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync(path.join(__dirname, 'src/events')).filter(file => file.endsWith('.js'));

(async () => {
  for (const file of commandFiles) {
    const command = require(`./src/commands/${file}`);
    client.commands.set(command.data.name, command);
  }

  for (const file of eventFiles) {
    const event = require(`./src/events/${file}`);
    client.on(event.name, (...args) => event.execute(...args));
  }

  const parser = new Parser();
  setInterval(async () => {
    try {
      const discountChannel = JSON.parse(await fsPromises.readFile(path.join(__dirname, 'src/data/discountChannel.json')));
      if (!discountChannel.channelId) return;

      const feed = await parser.parseURL('https://steamcommunity.com/games/steam/rss/');
      for (const item of feed.items) {
        const appId = item.link.match(/\/app\/(\d+)/)?.[1];
        if (!appId) continue;

        const gameInfo = await getGameInfo(appId);
        if (gameInfo && gameInfo.discount_percent > 0) {
          const channel = await client.channels.fetch(discountChannel.channelId);
          const embed = {
            title: gameInfo.name,
            description: `**İndirim!** ${gameInfo.discount_percent}%`,
            fields: [
              { name: 'Eski Fiyat', value: `${gameInfo.original_price} USD`, inline: true },
              { name: 'Yeni Fiyat', value: `${gameInfo.final_price} USD`, inline: true },
              { name: 'TL Fiyatı', value: `${await convertToTL(gameInfo.final_price)} TL`, inline: true },
              { name: 'Yapımcı', value: gameInfo.developer, inline: true },
            ],
            image: { url: gameInfo.header_image },
            timestamp: new Date(),
          };
          const components = [
            {
              type: 1,
              components: [
                {
                  type: 2,
                  style: 5,
                  label: 'Steam Sayfası',
                  url: `https://store.steampowered.com/app/${appId}`,
                },
              ],
            },
          ];
          await channel.send({ embeds: [embed], components });
        }
      }
    } catch (error) {
      console.error('İndirim kontrol hatası:', error);
    }
  }, 30 * 60 * 1000);

  client.login(process.env.DISCORD_TOKEN);
})();

async function getGameInfo(appId) {
  try {
    const response = await axios.get(`https://store.steampowered.com/api/appdetails?appids=${appId}`);
    const data = response.data[appId].data;
    if (!data) return null;

    return {
      name: data.name,
      original_price: data.price_overview?.initial / 100 || 0,
      final_price: data.price_overview?.final / 100 || 0,
      discount_percent: data.price_overview?.discount_percent || 0,
      developer: data.developers?.[0] || 'Bilinmiyor',
      header_image: data.header_image,
      supported_languages: data.supported_languages || 'Bilinmiyor',
      metascore: data.metacritic?.score || 'Yok',
    };
  } catch (error) {
    console.error('Oyun bilgisi alınamadı:', error);
    return null;
  }
}

async function convertToTL(usd) {
  try {
    const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
    const rate = response.data.rates.TRY;
    return (usd * rate).toFixed(2);
  } catch (error) {
    console.error('Döviz kuru hatası:', error);
    return (usd * 35).toFixed(2);
  }
}
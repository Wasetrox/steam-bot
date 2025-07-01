const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('oyun-bilgi')
    .setDescription('Bir oyunun bilgilerini gösterir.')
    .addStringOption(option =>
      option.setName('oyun')
        .setDescription('Oyun adı veya Steam App ID')
        .setRequired(true)
    ),
  async execute(interaction) {
    const query = interaction.options.getString('oyun');
    let appId = query;

    if (isNaN(query)) {
      try {
        const cleanedQuery = query.trim().replace(/\s+/g, ' ').toLowerCase();
        const response = await axios.get(`https://store.steampowered.com/api/storesearch?term=${encodeURIComponent(cleanedQuery)}&cc=TR`);

        if (!response.data || !Array.isArray(response.data.items) || response.data.items.length === 0) {
          return interaction.reply({ 
            content: `Oyun "${query}" bulunamadı! Lütfen oyun adını doğru yazdığınızdan emin olun (örneğin, "Assetto Corsa") veya Steam App ID kullanın (örneğin, 244210).`, 
            ephemeral: true 
          });
        }

        const matchingGame = response.data.items.find(item => item.name.toLowerCase() === cleanedQuery);
        if (!matchingGame) {
          return interaction.reply({ 
            content: `Oyun "${query}" tam olarak eşleşmedi! Lütfen oyun adını doğru yazdığınızdan emin olun veya Steam App ID kullanın.`, 
            ephemeral: true 
          });
        }
        appId = matchingGame.id;
      } catch (error) {
        console.error('Steam API arama hatası:', error.message);
        return interaction.reply({ 
          content: 'Oyun aranırken bir hata oluştu! Lütfen tekrar deneyin veya Steam App ID kullanın.', 
          ephemeral: true 
        });
      }
    }

    const gameInfo = await getGameInfo(appId);
    if (!gameInfo) {
      return interaction.reply({ 
        content: `Oyun (App ID: ${appId}) bilgisi alınamadı! Geçerli bir ID olduğundan emin olun.`, 
        ephemeral: true 
      });
    }

    const embed = {
      title: gameInfo.name || 'Bilinmeyen Oyun',
      fields: [
        { 
          name: 'Fiyat', 
          value: gameInfo.final_price ? '```ini\n[' + `${gameInfo.final_price} USD` + ']\n```' : '```ini\n[Ücretsiz veya Bilinmiyor]\n```', 
          inline: true 
        },
        { 
          name: 'TL Fiyatı', 
          value: gameInfo.final_price ? '```yaml\n[' + `${await convertToTL(gameInfo.final_price)} TL` + ']\n```' : '```diff\n- Bilinmiyor\n```', 
          inline: true 
        },
        { 
          name: 'Yapımcı', 
          value: gameInfo.developer ? '```diff\n+ ' + `${gameInfo.developer}` + '\n```' : '```diff\n+ Bilinmiyor\n```', 
          inline: true 
        },
        { 
          name: 'Desteklenen Diller', 
          value: gameInfo.supported_languages ? '```diff\n-' + ` ${gameInfo.supported_languages}` + '\n```' : '```yaml\nBilinmiyor\n```', 
          inline: true 
        },
        { 
          name: 'Metascore', 
          value: gameInfo.metascore ? '```arm\n' + `${gameInfo.metascore}` + '\n```' : '```arm\nYok\n```', 
          inline: true 
        },
      ],
      image: { url: gameInfo.header_image || '' },
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

    await interaction.reply({ embeds: [embed], components });
  },
};

async function getGameInfo(appId) {
  try {
    const response = await axios.get(`https://store.steampowered.com/api/appdetails?appids=${appId}&cc=TR`);
    const data = response.data[appId]?.data;
    if (!data) return null;

    return {
      name: data.name || 'Bilinmeyen Oyun',
      final_price: data.price_overview?.final / 100 || 0,
      developer: data.developers?.[0] || 'Bilinmiyor',
      header_image: data.header_image || '',
      supported_languages: data.supported_languages?.replace(/<[^>]+>/g, '') || 'Bilinmiyor', // HTML etiketlerini kaldır
      metascore: data.metacritic && data.metacritic.score ? `${data.metacritic.score}` : 'Yok',
    };
  } catch (error) {
    console.error('Oyun bilgisi alınamadı:', error.message);
    return null;
  }
}

async function convertToTL(usd) {
  try {
    const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
    const rate = response.data.rates?.TRY;
    if (!rate) throw new Error('Döviz kuru alınamadı');
    return (usd * rate).toFixed(2);
  } catch (error) {
    console.error('Döviz kuru hatası:', error.message);
    return (usd * 35).toFixed(2);
  }
}
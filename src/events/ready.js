const { joinVoiceChannel } = require('@discordjs/voice');
const { ActivityType } = require('discord.js');
require('dotenv').config();

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    console.log(`Bot ${client.user.tag} olarak giriş yaptı!`);

    // Botun durumunu ayarla
    try {
      if (!client.user) {
        console.error('Bot kullanıcısı hazır değil!');
        return;
      }
      client.user.setPresence({
        activities: [
          {
            name: '🍷 Wasetrox Was Here',
            type: ActivityType.Streaming,
            url: 'https://www.twitch.tv/wasetrox',
          },
        ],
        status: 'dnd',
      });
      console.log('Bot durumu ayarlandı!');
    } catch (error) {
      console.error('Durum ayarlanırken hata oluştu:', error);
    }

    // Ses kanalına bağlanma
    const voiceChannelId = process.env.SES_ID;
    try {
      const channel = await client.channels.fetch(voiceChannelId).catch(() => null);
      if (channel && channel.isVoiceBased()) {
        joinVoiceChannel({
          channelId: voiceChannelId,
          guildId: channel.guild.id,
          adapterCreator: channel.guild.voiceAdapterCreator,
        });
        console.log(`Bot ${channel.name} ses kanalına bağlandı!`);
      } else {
        console.log('Ses kanalı bulunamadı veya geçersiz!');
      }
    } catch (error) {
      console.error('Ses kanalına bağlanırken hata oluştu:', error);
    }

    // Komutları kaydet
    try {
      await client.application.commands.set(client.commands.map(cmd => cmd.data));
      console.log('Komutlar kaydedildi!');
    } catch (error) {
      console.error('Komutlar kaydedilirken hata oluştu:', error);
    }
  },
};
const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const fs = require('fs').promises;
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sistem-sıfırla')
    .setDescription('İndirim sistemini sıfırlar.'),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.reply({ content: 'Bu komutu kullanmak için yönetici yetkisine sahip olmalısınız!', ephemeral: true });
    }

    await fs.writeFile(path.join(__dirname, '../data/discountChannel.json'), JSON.stringify({ channelId: null }));
    await interaction.reply({ content: 'İndirim sistemi sıfırlandı!', ephemeral: true });
  },
};
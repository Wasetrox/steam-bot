const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const fs = require('fs').promises;
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sistem-kur')
    .setDescription('İndirim sistemini belirtilen kanala kurar.')
    .addChannelOption(option =>
      option.setName('kanal')
        .setDescription('İndirim bildirimlerinin gönderileceği kanal')
        .setRequired(true)
    ),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.reply({ content: 'Bu komutu kullanmak için yönetici yetkisine sahip olmalısınız!', ephemeral: true });
    }

    const channel = interaction.options.getChannel('kanal');
    await fs.writeFile(path.join(__dirname, '../data/discountChannel.json'), JSON.stringify({ channelId: channel.id }));
    await interaction.reply({ content: `İndirim sistemi ${channel} kanalına kuruldu!`, ephemeral: true });
  },
};
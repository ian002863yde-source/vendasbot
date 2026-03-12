const {
  ChannelType,
  PermissionFlagsBits,
  EmbedBuilder
} = require("discord.js");

const ensureCategory = require("../utils/ensureCategory");

module.exports = async function openOrderChannel(interaction, product) {
  const guild = interaction.guild;
  const { salesCategoryName, supportRoleId } = interaction.client.config;

  const category = await ensureCategory(guild, salesCategoryName);

  const channel = await guild.channels.create({
    name: `pedido-${interaction.user.username}`,
    type: ChannelType.GuildText,
    parent: category.id,
    permissionOverwrites: [
      {
        id: guild.id,
        deny: [PermissionFlagsBits.ViewChannel]
      },
      {
        id: interaction.user.id,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages
        ]
      },
      {
        id: supportRoleId,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages
        ]
      }
    ]
  });

  const embed = new EmbedBuilder()
    .setTitle("📦 Pedido iniciado")
    .setDescription(`Produto: ${product.name}\nCliente: ${interaction.user}`);

  await channel.send({
    embeds: [embed]
  });

  return channel;
};
const {
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder
} = require("discord.js");

const catalog = require("../systems/productCatalog");

module.exports = async function sendSalesPanel(client) {
  const { guildId, panelChannelId } = client.config;

  const guild = await client.guilds.fetch(guildId);
  const channel = await guild.channels.fetch(panelChannelId);

  const options = catalog.map(product => ({
    label: product.name,
    description: product.shortDescription,
    value: product.id
  }));

  const embed = new EmbedBuilder()
    .setTitle("🛒 Central de Vendas")
    .setDescription("Escolha um produto no menu abaixo para iniciar sua compra.");

  const menu = new StringSelectMenuBuilder()
    .setCustomId("sales-product-select")
    .setPlaceholder("Selecione um produto")
    .addOptions(options);

  const row = new ActionRowBuilder().addComponents(menu);

  await channel.send({
    embeds: [embed],
    components: [row]
  });
};
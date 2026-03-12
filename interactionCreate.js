const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

const catalog = require("../systems/productCatalog");
const openOrderChannel = require("../systems/openOrderChannel");

module.exports = {
  name: "interactionCreate",
  once: false,

  async execute(client, interaction) {
    try {
      if (interaction.isStringSelectMenu()) {
        if (interaction.customId !== "sales-product-select") return;

        const selectedProductId = interaction.values[0];
        const product = catalog.find(item => item.id === selectedProductId);

        if (!product) {
          return interaction.reply({
            content: "Produto não encontrado.",
            ephemeral: true
          });
        }

        const embed = new EmbedBuilder()
          .setTitle(`Produto: ${product.name}`)
          .setDescription(product.description)
          .addFields(
            { name: "Preço", value: product.priceLabel, inline: true },
            { name: "Prazo", value: product.deliveryTime, inline: true }
          );

        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId(`buy:${product.id}`)
            .setLabel("Comprar")
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId("cancel-selection")
            .setLabel("Cancelar")
            .setStyle(ButtonStyle.Secondary)
        );

        return interaction.reply({
          embeds: [embed],
          components: [row],
          ephemeral: true
        });
      }

      if (interaction.isButton()) {
        if (interaction.customId === "cancel-selection") {
          return interaction.update({
            content: "Seleção cancelada.",
            embeds: [],
            components: []
          });
        }

        if (!interaction.customId.startsWith("buy:")) return;

        const productId = interaction.customId.split(":")[1];
        const product = catalog.find(item => item.id === productId);

        if (!product) {
          return interaction.reply({
            content: "Produto inválido.",
            ephemeral: true
          });
        }

        const channel = await openOrderChannel(interaction, product);

        return interaction.reply({
          content: `Seu atendimento foi criado em ${channel}`,
          ephemeral: true
        });
      }
    } catch (error) {
      console.error(error);
      interaction.reply({
        content: "Erro ao processar interação.",
        ephemeral: true
      });
    }
  }
};
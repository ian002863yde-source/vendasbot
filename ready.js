const { ActivityType } = require("discord.js");
const sendSalesPanel = require("../panels/salesPanel");

module.exports = {
  name: "ready",
  once: true,

  async execute(client) {
    console.log(`[BOT] Online como ${client.user.tag}`);

    client.user.setPresence({
      activities: [
        {
          name: "vendas e pedidos",
          type: ActivityType.Watching
        }
      ],
      status: "online"
    });

    try {
      await sendSalesPanel(client);
      console.log("[PAINEL] Painel verificado.");
    } catch (error) {
      console.error("[ERRO] Painel:", error);
    }
  }
};
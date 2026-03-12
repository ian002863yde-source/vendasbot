const { ChannelType } = require("discord.js");

module.exports = async function ensureCategory(guild, categoryName) {
  let category = guild.channels.cache.find(
    c => c.type === ChannelType.GuildCategory && c.name === categoryName
  );

  if (!category) {
    category = await guild.channels.create({
      name: categoryName,
      type: ChannelType.GuildCategory
    });
  }

  return category;
};
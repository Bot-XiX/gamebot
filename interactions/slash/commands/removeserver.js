const { SlashCommandBuilder } = require("discord.js")
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
require('dotenv').config();

/**
* @file Slash interaction: removeserver
* @author Felix
* @since 1.0.0
*/
module.exports = {
  data: new SlashCommandBuilder()
    .setName('removeserver')
    .setDescription('Remove global command')
    .addStringOption((option) => option.setName('server').setDescription('Server ID').setRequired(true))
    .addStringOption((option) => option.setName('id').setDescription('Command ID').setRequired(false)),

  /**
* @description Executes when the slash command with ID removeserver is called.
* @author Felix
* @param {Object} interaction The Interaction Object of the command.
*/
  async execute (interaction) {
    const rest = new REST({ version: '10' }).setToken(process.env.token);
    const client = interaction.client.application;
    const guild = await interaction.client.guilds.cache.get(interaction.options.getString('server'))
    if(!interaction.options.getString('id')) {
      rest.delete(Routes.applicationGuildCommands(client.id, guild.id), { body: [] })
        .then(() => interaction.reply('Successfully deleted guild commands'))
        .catch(interaction.reply('Failed to delete guild commands'))
    } else {
      rest.delete(Routes.applicationGuildCommand(client.id, guild.id, interaction.options.getString('id')))
        .then(() => interaction.reply('Successfully deleted guild command'))
        .catch(interaction.reply('Failed to delete guild command'))
    }
  }
}

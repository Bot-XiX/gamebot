const { SlashCommandBuilder } = require("discord.js")
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
require('dotenv').config();

/**
* @file Slash interaction: removeglobal
* @author Felix
* @since 1.0.0
*/
module.exports = {
  data: new SlashCommandBuilder()
    .setName('removeglobal')
    .setDescription('Remove global command')
    .addStringOption((option) => option.setName('id').setDescription('Command ID').setRequired(false)),

  /**
* @description Executes when the slash command with ID removeglobal is called.
* @author Felix
* @param {Object} interaction The Interaction Object of the command.
*/
  async execute (interaction) {
    const rest = new REST({ version: '10' }).setToken(process.env.token);
    const client = interaction.client.application;
    if (!interaction.options.getString('id')) {
      rest.delete(Routes.applicationCommands(client.id), { body: [] })
        .then(() => interaction.reply('Successfully deleted guild commands'))
        .catch(interaction.reply('Failed to delete guild commands'))
    } else {
      rest.delete(Routes.applicationCommand(client.id, interaction.options.getString('id')))
        .then(() => interaction.reply('Successfully deleted guild command'))
        .catch(interaction.reply('Failed to delete guild command'))
    }
  }
}

const { SlashCommandBuilder } = require('discord.js')
const { getDatabase, remove, ref } = require('firebase/database')
/**
 * @file Slash interaction: label
 * @since 1.0.0
*/
module.exports = {
  data: new SlashCommandBuilder()
    .setName('deleteradio')
    .setDescription('Löscht das Radio um ein erneutes Verbinden zu verhindern'),
  /**
* @description Executes when the slash command with ID label is called.

* @param {Object} interaction The Interaction Object of the command.
*/
  async execute (interaction) {
    const db = getDatabase()
    const id = interaction.guild.id
    remove(ref(db, '/radio/' + id))
    await interaction.reply({ content: 'Radio gelöscht, bitte entferne den Bot manuell aus dem Channel!', ephemeral: true })
  }
}

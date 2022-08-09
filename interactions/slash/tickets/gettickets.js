const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { getDatabase, ref, onValue } = require('firebase/database')
/**
 * @file Slash interaction: gettickets
 * @since 1.0.0
*/
module.exports = {
  data: new SlashCommandBuilder()
    .setName('gettickets')
    .setDescription('Get All Tickets'),
  /**
* @description Executes when the slash command with ID gettickets is called.

* @param {Object} interaction The Interaction Object of the command.
*/
  async execute (interaction) {
    const id = interaction.guild.id
    const db = getDatabase()
    const tickets = ref(db, id + '/tickets/config')
    const unsub = onValue(tickets, async (snapshot) => {
      const tickets = await snapshot.val()
      const embed = new EmbedBuilder()
        .setTitle('Tickets')
        .addFields(Object.keys(tickets).map((key) => {
          return { name: key, value: tickets[key].name }
        }))
      interaction.reply({ embeds: [embed] })
      unsub()
    })
  }
}
